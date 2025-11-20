import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Testing database connection...')
    
    // Get unique categories
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    })
    
    console.log('Categories:', categories)
    
    // Get unique brands with count
    const brands = await prisma.product.groupBy({
      by: ['brand'],
      _count: { brand: true },
      orderBy: { brand: 'asc' },
    })
    
    console.log('Brands:', brands)
    
    // Get compliance counts
    const adaCount = await prisma.product.count({ where: { isADACompliant: true } })
    const waterSenseCount = await prisma.product.count({ where: { isWaterSense: true } })
    const marineGradeCount = await prisma.product.count({ where: { isMarineGrade: true } })
    
    console.log('ADA:', adaCount, 'WaterSense:', waterSenseCount, 'MarineGrade:', marineGradeCount)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
