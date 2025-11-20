import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { DoorDetector } from '@/lib/budget-estimation/door-detector'
import { DimensionExtractor, extractDoorSchedule } from '@/lib/blueprint-parser/dimension-extractor'
import { formatDimension } from '@/lib/blueprint-parser/unit-converter'
import { join } from 'path'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { estimationId } = await request.json()

    if (!estimationId) {
      return NextResponse.json(
        { error: 'Estimation ID is required' },
        { status: 400 }
      )
    }

    // Get estimation and documents
    const estimation = await prisma.budgetEstimation.findUnique({
      where: { id: estimationId },
      include: {
        documents: {
          where: {
            documentType: { in: ['ARCHITECTURAL_DRAWING', 'AUTOCAD_PDF'] },
            parseStatus: 'PENDING'
          }
        }
      }
    })

    if (!estimation) {
      return NextResponse.json(
        { error: 'Estimation not found' },
        { status: 404 }
      )
    }

    // Update status to PARSING
    await prisma.budgetEstimation.update({
      where: { id: estimationId },
      data: { status: 'PARSING' }
    })

    const dimensionExtractor = new DimensionExtractor()
    let totalDoorsDetected = 0
    const allDetectedDoors = []

    // Analyze each document (PDF or CAD)
    for (const doc of estimation.documents) {
      try {
        // Update document status
        await prisma.estimationDocument.update({
          where: { id: doc.id },
          data: { parseStatus: 'PROCESSING' }
        })

        // Get file path
        const filepath = join(process.cwd(), 'public', doc.url)
        const fileExt = doc.fileType.toLowerCase()

        let doorAnnotations: any[] = []
        let metadata: any = {}

        // Route to appropriate parser based on file type
        if (fileExt === 'pdf') {
          // PDF parsing using dimension extractor
          metadata = await dimensionExtractor.extractMetadata(filepath)

          console.log(`Blueprint metadata for ${doc.originalName}:`, metadata)

          // Extract door annotations (marks, dimensions, locations)
          doorAnnotations = await extractDoorSchedule(filepath)
        } else if (fileExt === 'dxf') {
          // CAD parsing using Python ezdxf
          console.log(`Parsing CAD file: ${doc.originalName}`)

          try {
            const cadParseResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/budget-estimation/parse-cad`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filePath: filepath })
            })

            if (!cadParseResponse.ok) {
              throw new Error('CAD parsing failed')
            }

            const cadResult = await cadParseResponse.json()

            metadata = cadResult.metadata
            doorAnnotations = cadResult.doors || []

            console.log(`CAD parser found ${doorAnnotations.length} doors`)
          } catch (cadError) {
            console.error('CAD parsing error:', cadError)
            // Fallback to PDF extraction if CAD parsing fails
            console.log('Falling back to PDF extraction...')
            doorAnnotations = await extractDoorSchedule(filepath)
          }
        } else {
          // Unsupported format - try PDF extraction anyway
          console.warn(`Unsupported file format: ${fileExt}, attempting PDF extraction`)
          doorAnnotations = await extractDoorSchedule(filepath)
        }

        // Update estimation with blueprint metadata if found
        if (metadata.drawingScale || metadata.primaryUnit || metadata.scale) {
          await prisma.budgetEstimation.update({
            where: { id: estimationId },
            data: {
              blueprintScale: metadata.drawingScale || metadata.scale?.toString(),
              sourceFormat: fileExt.toUpperCase()
            }
          })
        }

        console.log(`Found ${doorAnnotations.length} door annotations in ${doc.originalName}`)

        // Store results
        await prisma.estimationDocument.update({
          where: { id: doc.id },
          data: {
            parseStatus: 'COMPLETED',
            pageCount: metadata.totalPages || 1,
            detectedItems: JSON.stringify(doorAnnotations),
            processedAt: new Date()
          }
        })

        totalDoorsDetected += doorAnnotations.length
        allDetectedDoors.push(...doorAnnotations)

        console.log(`Detected ${doorAnnotations.length} doors in ${doc.originalName}`)
      } catch (error) {
        console.error(`Error analyzing ${doc.originalName}:`, error)

        await prisma.estimationDocument.update({
          where: { id: doc.id },
          data: {
            parseStatus: 'FAILED',
            parseError: error instanceof Error ? error.message : 'Unknown error'
          }
        })
      }
    }

    // Create EstimationItem and ItemLocation records for each detected door
    let itemsCreated = 0
    let hardwareCreated = 0

    for (const door of allDetectedDoors) {
      try {
        // Determine floor and area (fallback to defaults if not detected)
        const floor = door.floor || 'F1'
        const area = door.area || 'Área Desconocida'
        const mark = door.mark || `DOOR-${itemsCreated + 1}`

        // Create or find location
        let location = await prisma.itemLocation.findFirst({
          where: {
            floor,
            area,
            mark
          }
        })

        if (!location) {
          location = await prisma.itemLocation.create({
            data: {
              floor,
              area,
              mark,
              fullLocation: `${floor} - ${area} - ${mark}`,
              drawingPage: door.page
            }
          })
        }

        // Format dimensions for storage (both metric and imperial)
        const dimensionMetric = door.width
          ? formatDimension(door.width.widthCm, door.width.heightCm, 'metric')
          : undefined
        const dimensionImperial = door.width
          ? formatDimension(door.width.widthInches, door.width.heightInches, 'imperial')
          : undefined

        // Determine door type (use detected or default to INTERIOR_SINGLE)
        const doorType = door.doorType || 'INTERIOR_SINGLE'

        // Create door item
        const doorItem = await prisma.estimationItem.create({
          data: {
            estimationId: estimation.id,
            locationId: location.id,
            itemType: 'DOOR',
            doorType: doorType as any,
            productName: `Puerta ${doorType}`,
            specifications: JSON.stringify({
              width: door.width,
              doorType: doorType,
              detectionSource: 'PDF_TEXT_EXTRACTION'
            }),
            quantity: 1,
            detectedByAI: true,
            aiConfidence: door.confidence || 0.7,
            // New dimension fields
            dimensionMetric,
            dimensionImperial,
            dimensionWidth: door.width?.widthCm,
            dimensionHeight: door.width?.heightCm,
            dimensionUnit: 'CM',
            detectionSource: 'PDF_TEXT_EXTRACTION'
          }
        })

        itemsCreated++

        // Calculate and create required hardware
        const hardwareReqs = DoorDetector.calculateHardware(doorType)

        for (const hardware of hardwareReqs) {
          await prisma.estimationItem.create({
            data: {
              estimationId: estimation.id,
              locationId: location.id,
              itemType: hardware.itemType as any,
              productName: hardware.productName,
              brand: hardware.brand,
              specifications: hardware.specifications,
              quantity: hardware.quantity,
              detectedByAI: true,
              aiConfidence: door.confidence || 0.7,
              detectionSource: 'HARDWARE_CALCULATOR',
              notes: `Auto-calculated for ${mark}`
            }
          })

          hardwareCreated++
        }
      } catch (error) {
        console.error(`Error creating items for door ${door.mark}:`, error)
      }
    }

    // Update estimation with totals
    await prisma.budgetEstimation.update({
      where: { id: estimationId },
      data: {
        status: 'REVIEWED',
        totalDoors: itemsCreated,
        totalHardware: hardwareCreated
      }
    })

    return NextResponse.json({
      success: true,
      totalDoorsDetected,
      itemsCreated,
      hardwareCreated,
      message: `Successfully analyzed drawings and detected ${totalDoorsDetected} doors`
    })
  } catch (error) {
    console.error('Error analyzing estimation:', error)
    return NextResponse.json(
      { error: 'Failed to analyze estimation' },
      { status: 500 }
    )
  }
}
