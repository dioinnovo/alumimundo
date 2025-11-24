import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/design/specifications - Add a product specification to an area
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      areaId,
      productSku,
      productName,
      brand,
      category,
      quantity,
      unitPrice,
      totalPrice,
      recommendedByAI,
      aiConfidence
    } = body

    if (!areaId || !productSku || !productName || !brand || !category || quantity === undefined || unitPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const specification = await prisma.areaSpecification.create({
      data: {
        areaId,
        productSku,
        productName,
        brand,
        category,
        quantity,
        unitPrice,
        totalPrice: totalPrice || quantity * unitPrice,
        recommendedByAI: recommendedByAI || false,
        aiConfidence: aiConfidence || null
      }
    })

    return NextResponse.json({ specification }, { status: 201 })
  } catch (error) {
    console.error('Error creating specification:', error)
    return NextResponse.json(
      { error: 'Failed to create specification' },
      { status: 500 }
    )
  }
}

// GET /api/design/specifications?areaId=xxx - Get all specifications for an area
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')

    if (!areaId) {
      return NextResponse.json(
        { error: 'areaId is required' },
        { status: 400 }
      )
    }

    const specifications = await prisma.areaSpecification.findMany({
      where: { areaId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ specifications })
  } catch (error) {
    console.error('Error fetching specifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch specifications' },
      { status: 500 }
    )
  }
}
