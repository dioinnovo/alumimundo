import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Prisma client singleton pattern for Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    // Get unique categories
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    })

    // Get unique brands with count
    const brands = await prisma.product.groupBy({
      by: ['brand'],
      _count: {
        brand: true,
      },
      orderBy: {
        brand: 'asc',
      },
    })

    // Get compliance counts
    const stats = await prisma.product.aggregate({
      _count: {
        _all: true,
      },
      where: {},
    })

    const adaCount = await prisma.product.count({
      where: { isADACompliant: true },
    })

    const waterSenseCount = await prisma.product.count({
      where: { isWaterSense: true },
    })

    const marineGradeCount = await prisma.product.count({
      where: { isMarineGrade: true },
    })

    return NextResponse.json({
      categories: categories.map(c => c.category).filter(Boolean),
      brands: brands.map(b => ({
        name: b.brand,
        count: b._count.brand,
      })),
      stats: {
        total: stats._count._all,
        adaCompliant: adaCount,
        waterSense: waterSenseCount,
        marineGrade: marineGradeCount,
      },
    })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch filters',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
