import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/design/images - Add an image to an area
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { areaId, imageUrl, imageName, visionAnalysis, detectedItems, aiTags } = body

    if (!areaId || !imageUrl || !imageName) {
      return NextResponse.json(
        { error: 'Missing required fields: areaId, imageUrl, imageName' },
        { status: 400 }
      )
    }

    const image = await prisma.areaImage.create({
      data: {
        areaId,
        imageUrl,
        imageName,
        visionAnalysis: visionAnalysis || null,
        detectedItems: detectedItems || null,
        aiTags: aiTags || null
      }
    })

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    console.error('Error creating image:', error)
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    )
  }
}
