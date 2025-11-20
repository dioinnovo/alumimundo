import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Prisma client singleton pattern for Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const isADACompliant = searchParams.get('isADACompliant')
    const isWaterSense = searchParams.get('isWaterSense')
    const isMarineGrade = searchParams.get('isMarineGrade')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}

    if (category) where.category = category
    if (brand) where.brand = brand
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (isADACompliant === 'true') where.isADACompliant = true
    if (isWaterSense === 'true') where.isWaterSense = true
    if (isMarineGrade === 'true') where.isMarineGrade = true

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          provider: {
            select: {
              name: true,
              website: true,
            },
          },
          images: {
            orderBy: {
              displayOrder: 'asc',
            },
            take: 1, // Only get primary image for list view
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      limit,
      offset,
      hasMore: offset + products.length < total,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
