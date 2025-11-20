import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const projectName = formData.get('projectName') as string
    const clientName = formData.get('clientName') as string
    const clientEmail = formData.get('clientEmail') as string | null
    const clientPhone = formData.get('clientPhone') as string | null
    const propertyType = formData.get('propertyType') as string
    const location = formData.get('location') as string
    const address = formData.get('address') as string | null
    const city = formData.get('city') as string | null
    const province = formData.get('province') as string | null

    // Validate required fields
    if (!projectName || !clientName || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique project number
    const projectNumber = `PE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    // Create budget estimation record
    const estimation = await prisma.budgetEstimation.create({
      data: {
        projectNumber,
        projectName,
        clientName,
        clientEmail,
        clientPhone,
        propertyType: propertyType as any,
        location,
        address,
        city,
        province,
        status: 'DRAFT'
      }
    })

    // Process uploaded files
    const files = formData.getAll('files') as File[]
    const uploadedDocuments = []

    if (files.length > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'budget-estimations', estimation.id)
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filepath = join(uploadsDir, filename)

        // Save file
        await writeFile(filepath, buffer)

        // Create document record
        const document = await prisma.estimationDocument.create({
          data: {
            estimationId: estimation.id,
            filename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url: `/uploads/budget-estimations/${estimation.id}/${filename}`,
            documentType: file.type === 'application/pdf' ? 'ARCHITECTURAL_DRAWING' : 'OTHER',
            parseStatus: 'PENDING'
          }
        })

        uploadedDocuments.push(document)
      }

      // Update estimation status to UPLOADED
      await prisma.budgetEstimation.update({
        where: { id: estimation.id },
        data: { status: 'UPLOADED' }
      })

      // TODO: Trigger AI analysis in background
      // This will be implemented with the door detector
      // triggerAIAnalysis(estimation.id, uploadedDocuments)
    }

    return NextResponse.json({
      success: true,
      estimation,
      documents: uploadedDocuments
    })
  } catch (error) {
    console.error('Error creating budget estimation:', error)
    return NextResponse.json(
      { error: 'Failed to create budget estimation' },
      { status: 500 }
    )
  }
}
