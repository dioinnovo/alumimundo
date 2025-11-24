import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/design/images/[imageId] - Update image analysis data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params
    const body = await request.json()
    const { visionAnalysis, detectedItems, aiTags } = body

    const updateData: any = {}
    if (visionAnalysis !== undefined) updateData.visionAnalysis = visionAnalysis
    if (detectedItems !== undefined) updateData.detectedItems = detectedItems
    if (aiTags !== undefined) updateData.aiTags = aiTags

    const image = await prisma.areaImage.update({
      where: { id: imageId },
      data: updateData
    })

    return NextResponse.json({ image })
  } catch (error) {
    console.error('Error updating image:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}

// DELETE /api/design/images/[imageId] - Delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params
    await prisma.areaImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
