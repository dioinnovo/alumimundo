import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/design/areas/[areaId] - Get a single area
export async function GET(
  request: NextRequest,
  { params }: { params: { areaId: string } }
) {
  try {
    const area = await prisma.designArea.findUnique({
      where: { id: params.areaId },
      include: {
        images: true,
        specifications: true
      }
    })

    if (!area) {
      return NextResponse.json(
        { error: 'Area not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ area })
  } catch (error) {
    console.error('Error fetching area:', error)
    return NextResponse.json(
      { error: 'Failed to fetch area' },
      { status: 500 }
    )
  }
}

// PATCH /api/design/areas/[areaId] - Update an area
export async function PATCH(
  request: NextRequest,
  { params }: { params: { areaId: string } }
) {
  try {
    const body = await request.json()
    const {
      status,
      userRequirements,
      voiceTranscript,
      visionAnalysis,
      estimatedCost
    } = body

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (userRequirements !== undefined) updateData.userRequirements = userRequirements
    if (voiceTranscript !== undefined) updateData.voiceTranscript = voiceTranscript
    if (visionAnalysis !== undefined) updateData.visionAnalysis = visionAnalysis
    if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost

    const area = await prisma.designArea.update({
      where: { id: params.areaId },
      data: updateData
    })

    return NextResponse.json({ area })
  } catch (error) {
    console.error('Error updating area:', error)
    return NextResponse.json(
      { error: 'Failed to update area' },
      { status: 500 }
    )
  }
}

// DELETE /api/design/areas/[areaId] - Delete an area
export async function DELETE(
  request: NextRequest,
  { params }: { params: { areaId: string } }
) {
  try {
    await prisma.designArea.delete({
      where: { id: params.areaId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting area:', error)
    return NextResponse.json(
      { error: 'Failed to delete area' },
      { status: 500 }
    )
  }
}
