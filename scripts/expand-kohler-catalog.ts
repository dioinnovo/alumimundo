#!/usr/bin/env tsx

/**
 * KOHLER Catalog Expansion Script
 *
 * Expands the KOHLER catalog by creating product variations (different finishes)
 * Run with: npx tsx scripts/expand-kohler-catalog.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Common finish options for KOHLER products
 */
const FINISHES = [
  { code: 'CP', name: 'Polished Chrome', priceMultiplier: 1.0 },
  { code: 'BN', name: 'Brushed Nickel', priceMultiplier: 1.05 },
  { code: 'BV', name: 'Brushed Bronze', priceMultiplier: 1.15 },
  { code: 'SN', name: 'Vibrant Polished Nickel', priceMultiplier: 1.1 },
  { code: '2BZ', name: 'Oil-Rubbed Bronze', priceMultiplier: 1.2 },
  { code: 'AF', name: 'French Gold', priceMultiplier: 1.25 },
]

/**
 * Additional KOHLER bathroom products (base models)
 */
const additionalProducts = [
  // More Bathroom Faucets
  {
    baseSku: 'K-12183-4',
    name: 'Fairfax Single-Handle Bathroom Sink Faucet',
    category: 'Bathroom Faucets',
    description: 'Blending traditional design with contemporary accents, the Fairfax line features stylish details like lever handles and spout.',
    basePrice: 279.00,
    isADACompliant: true,
    isWaterSense: true,
    certifications: 'WaterSense, ADA, CALGreen',
    specifications: {
      flow_rate: '1.2 gpm',
      installation: '1 or 3 holes',
      mount: 'Deck-mount',
      handle_type: 'Lever',
    },
  },
  {
    baseSku: 'K-14406-4',
    name: 'Purist Widespread Bathroom Sink Faucet',
    category: 'Bathroom Faucets',
    description: 'Purist faucets combine simple, architectural forms with sensual design lines and careful detailing.',
    basePrice: 625.00,
    isADACompliant: false,
    isWaterSense: true,
    certifications: 'WaterSense, CALGreen',
    specifications: {
      flow_rate: '1.2 gpm',
      installation: '3 holes, 8-16 inch centers',
      mount: 'Deck-mount',
      handle_type: 'Lever',
    },
  },
  {
    baseSku: 'K-22969-4',
    name: 'Simplice Single-Handle Pull-Down Kitchen Faucet',
    category: 'Kitchen Faucets',
    description: 'Simplice kitchen faucets deliver exceptional ergonomics, with a sweep spray that stays in place.',
    basePrice: 425.00,
    isADACompliant: false,
    isWaterSense: false,
    certifications: 'CALGreen',
    specifications: {
      flow_rate: '1.8 gpm',
      installation: '1 or 3 holes',
      mount: 'Deck-mount',
      spout_height: '15-3/8 inches',
      spout_reach: '9 inches',
    },
  },

  // More Toilets
  {
    baseSku: 'K-3999',
    name: 'Highline Comfort Height Two-Piece Elongated Toilet',
    category: 'Toilets',
    description: 'With its clean, simple design and efficient performance, this Highline water-conserving toilet combines high-style with high-efficiency.',
    basePrice: 295.00,
    isADACompliant: true,
    isWaterSense: true,
    certifications: 'WaterSense, ADA, CALGreen',
    specifications: {
      flush_volume: '1.28 gpf',
      bowl_height: '17-19 inches',
      bowl_shape: 'Elongated',
      type: 'Two-piece',
      flush_type: 'Gravity',
    },
    finishApplicable: false,
  },
  {
    baseSku: 'K-4309',
    name: 'Wellworth Two-Piece Elongated Toilet',
    category: 'Toilets',
    description: 'The Wellworth toilet has been a fixture in American homes for generations, providing quality and performance.',
    basePrice: 249.00,
    isADACompliant: false,
    isWaterSense: true,
    certifications: 'WaterSense, CALGreen',
    specifications: {
      flush_volume: '1.28 gpf',
      bowl_height: '14-15 inches',
      bowl_shape: 'Elongated',
      type: 'Two-piece',
      flush_type: 'Gravity',
    },
    finishApplicable: false,
  },

  // Shower Systems
  {
    baseSku: 'K-9245',
    name: 'Devonshire Rite-Temp Shower Trim',
    category: 'Showers',
    description: 'Recalling 18th-century English design, Devonshire creates a sophisticated statement.',
    basePrice: 265.00,
    isADACompliant: false,
    isWaterSense: false,
    certifications: 'CALGreen',
    specifications: {
      valve_type: 'Pressure balancing',
      handle_type: 'Lever',
      connection: '1/2 inch',
    },
  },
  {
    baseSku: 'K-304',
    name: 'Rite-Temp Shower Valve Trim',
    category: 'Showers',
    description: 'A versatile and economical choice, this Rite-Temp pressure-balancing shower valve trim offers safety and reliability.',
    basePrice: 155.00,
    isADACompliant: true,
    isWaterSense: false,
    certifications: 'ADA, CALGreen, ICC/ANSI A117.1',
    specifications: {
      valve_type: 'Pressure balancing',
      handle_type: 'Lever',
      connection: '1/2 inch',
    },
  },

  // Bathroom Sinks
  {
    baseSku: 'K-2882',
    name: 'Verticyl Rectangular Undermount Bathroom Sink',
    category: 'Bathroom Sinks',
    description: 'Verticyl sinks combine crisp, geometric style with a glazed underside for easy cleaning.',
    basePrice: 285.00,
    isADACompliant: false,
    isWaterSense: false,
    certifications: 'None',
    specifications: {
      installation: 'Undermount',
      material: 'Vitreous China',
      overflow: 'Yes',
      dimensions: '21" x 15-1/2" x 7-3/4"',
      faucet_holes: '0',
    },
    finishApplicable: false,
  },
  {
    baseSku: 'K-2355',
    name: 'Archer Drop-In Bathroom Sink',
    category: 'Bathroom Sinks',
    description: 'Combining fluid, architectural lines with Craftsman details, Archer creates a timeless look.',
    basePrice: 195.00,
    isADACompliant: false,
    isWaterSense: false,
    certifications: 'None',
    specifications: {
      installation: 'Drop-in',
      material: 'Vitreous China',
      overflow: 'Yes',
      dimensions: '23-3/4" x 20-7/8" x 8-1/8"',
      faucet_holes: '1, 4, or 8 inch centers',
    },
    finishApplicable: false,
  },

  // Bathtubs
  {
    baseSku: 'K-1229',
    name: 'Mariposa Alcove Bath',
    category: 'Bathtubs',
    description: 'Flowing lines and an arching back give the Mariposa its romantic appeal.',
    basePrice: 895.00,
    isADACompliant: false,
    isWaterSense: false,
    certifications: 'None',
    specifications: {
      installation: 'Alcove',
      material: 'Acrylic',
      dimensions: '60" x 36" x 21-1/4"',
      capacity: '60 gallons',
      drain_location: 'Left or right',
    },
    finishApplicable: false,
  },
  {
    baseSku: 'K-716',
    name: 'Villager Alcove Bath',
    category: 'Bathtubs',
    description: 'The Villager bath offers streamlined style and a deep bathing well at an affordable price.',
    basePrice: 445.00,
    isADACompliant: false,
    isWaterSense: false,
    certifications: 'None',
    specifications: {
      installation: 'Alcove',
      material: 'Enameled Cast Iron',
      dimensions: '60" x 30-1/4" x 14"',
      capacity: '42 gallons',
      drain_location: 'Right',
    },
    finishApplicable: false,
  },
]

async function main() {
  console.log('🔄 Expanding KOHLER product catalog...\n')

  try {
    // Get KOHLER provider
    const provider = await prisma.provider.findUnique({
      where: { name: 'KOHLER' },
    })

    if (!provider) {
      throw new Error('KOHLER provider not found. Run seed-kohler-products.ts first.')
    }

    console.log('✅ Found KOHLER provider\n')

    let totalCreated = 0
    let totalSkipped = 0

    // For each base product, create variations with different finishes
    for (const product of additionalProducts) {
      const finishApplicable = product.finishApplicable !== false

      if (finishApplicable) {
        // Create product with each finish option
        for (const finish of FINISHES) {
          const sku = `${product.baseSku}-${finish.code}`
          const price = Math.round(product.basePrice * finish.priceMultiplier)

          const existing = await prisma.product.findUnique({ where: { sku } })

          if (existing) {
            totalSkipped++
            continue
          }

          await prisma.product.create({
            data: {
              sku,
              name: `${product.name} - ${finish.name}`,
              category: product.category,
              description: product.description,
              listPrice: price,
              currency: 'USD',
              finish: finish.name,
              brand: 'KOHLER',
              providerId: provider.id,
              isADACompliant: product.isADACompliant,
              isWaterSense: product.isWaterSense,
              certifications: product.certifications,
              specifications: JSON.stringify(product.specifications),
              sourceUrl: `https://www.kohler.com/en/products/${sku}`,
              lastScrapedAt: new Date(),
            },
          })

          totalCreated++
          console.log(`   ✅ Created: ${product.name} - ${finish.name} (${sku})`)
        }
      } else {
        // Products like toilets and sinks don't have finish variations (just White)
        const sku = `${product.baseSku}-0` // -0 for White

        const existing = await prisma.product.findUnique({ where: { sku } })

        if (existing) {
          totalSkipped++
          continue
        }

        await prisma.product.create({
          data: {
            sku,
            name: product.name,
            category: product.category,
            description: product.description,
            listPrice: product.basePrice,
            currency: 'USD',
            finish: 'White',
            brand: 'KOHLER',
            providerId: provider.id,
            isADACompliant: product.isADACompliant,
            isWaterSense: product.isWaterSense,
            certifications: product.certifications,
            specifications: JSON.stringify(product.specifications),
            sourceUrl: `https://www.kohler.com/en/products/${sku}`,
            lastScrapedAt: new Date(),
          },
        })

        totalCreated++
        console.log(`   ✅ Created: ${product.name} (${sku})`)
      }
    }

    // Get total product count
    const totalProducts = await prisma.product.count({
      where: { brand: 'KOHLER' },
    })

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 CATALOG EXPANSION SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ New Products Created: ${totalCreated}`)
    console.log(`⏭️  Products Skipped (already exist): ${totalSkipped}`)
    console.log(`📦 Total KOHLER Products in Catalog: ${totalProducts}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('\n✅ Catalog expansion complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
