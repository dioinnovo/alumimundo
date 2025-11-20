#!/usr/bin/env tsx

/**
 * KOHLER Product Seeding Script
 *
 * Seeds database with realistic KOHLER bathroom products
 * Run with: npx tsx scripts/seed-kohler-products.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Realistic KOHLER product data based on their actual product lines
 */
const kohlerProducts = [
  // BATHROOM FAUCETS
  {
    sku: 'K-99259-4-CP',
    name: 'Artifacts Single-Handle Bathroom Sink Faucet',
    category: 'Bathroom Faucets',
    description: 'Pair this Artifacts faucet with Artifacts accessories to create a personalized look. This single-handle model pairs ergonomic lever handles with a classic spout and Kohler ceramic disc valves for a watertight seal.',
    listPrice: 389.00,
    finish: 'Polished Chrome',
    isADACompliant: true,
    isWaterSense: true,
    specifications: {
      flow_rate: '1.2 gpm',
      installation: '1 or 3 holes',
      mount: 'Deck-mount',
      handle_type: 'Lever',
    },
    certifications: 'WaterSense, ADA, CALGreen',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-99259-4-CP_main_model.jpg.imagep.600.600.jpg',
  },
  {
    sku: 'K-394-4-CP',
    name: 'Devonshire Widespread Bathroom Sink Faucet',
    category: 'Bathroom Faucets',
    description: 'Distinguished by its traditional style and elegant lines, Devonshire recalls the classic design precepts of 18th-century England.',
    listPrice: 515.00,
    finish: 'Polished Chrome',
    isADACompliant: false,
    isWaterSense: true,
    specifications: {
      flow_rate: '1.2 gpm',
      installation: '3 holes, 8 inch centers',
      mount: 'Deck-mount',
      handle_type: 'Lever',
    },
    certifications: 'WaterSense, CALGreen',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-394-4-CP_main_model.jpg.imagep.600.600.jpg',
  },
  {
    sku: 'K-45100-4-CP',
    name: 'Alteo Single-Handle Bathroom Sink Faucet',
    category: 'Bathroom Faucets',
    description: 'Graceful lines complement both traditional and contemporary bathroom d\u00e9cor, making this Alteo faucet a versatile choice.',
    listPrice: 225.00,
    finish: 'Polished Chrome',
    isADACompliant: true,
    isWaterSense: true,
    specifications: {
      flow_rate: '1.2 gpm',
      installation: '1 or 3 holes',
      mount: 'Deck-mount',
      handle_type: 'Lever',
    },
    certifications: 'WaterSense, ADA, CALGreen, ICC/ANSI A117.1',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-45100-4-CP_main_model.jpg.imagep.600.600.jpg',
  },
  {
    sku: 'K-10577-4-CP',
    name: 'Bancroft Widespread Bathroom Sink Faucet',
    category: 'Bathroom Faucets',
    description: 'The Bancroft collection of bathroom products from Kohler captures the essence of a bygone era, embodying the grandeur and elegance of the Victorian age.',
    listPrice: 495.00,
    finish: 'Polished Chrome',
    isADACompliant: false,
    isWaterSense: true,
    specifications: {
      flow_rate: '1.2 gpm',
      installation: '3 holes, 8 inch centers',
      mount: 'Deck-mount',
      handle_type: 'Lever',
    },
    certifications: 'WaterSense, CALGreen',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-10577-4-CP_main_model.jpg.imagep.600.600.jpg',
  },

  // TOILETS
  {
    sku: 'K-3609-0',
    name: 'Cimarron Comfort Height Two-Piece Elongated 1.28 GPF Toilet',
    category: 'Toilets',
    description: 'The Cimarron collection offers exceptional beauty, performance, and value. Combining elegant elements from several classic collections, this two-piece elongated 1.28-gallon toilet coordinates beautifully with other Cimarron products.',
    listPrice: 335.00,
    finish: 'White',
    isADACompliant: true,
    isWaterSense: true,
    specifications: {
      flush_volume: '1.28 gpf',
      bowl_height: '17-19 inches',
      bowl_shape: 'Elongated',
      type: 'Two-piece',
      flush_type: 'Gravity',
    },
    certifications: 'WaterSense, ADA, CALGreen, EPA WaterSense',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-3609-0_main_model.jpg.imagep.600.600.jpg',
  },
  {
    sku: 'K-3817-0',
    name: 'Memoirs Stately Comfort Height Two-Piece Elongated 1.28 GPF Toilet',
    category: 'Toilets',
    description: 'Combining dignity and grace, Memoirs incorporates subtle design elements of traditional furniture and architectural crown molding.',
    listPrice: 495.00,
    finish: 'White',
    isADACompliant: true,
    isWaterSense: true,
    specifications: {
      flush_volume: '1.28 gpf',
      bowl_height: '17-19 inches',
      bowl_shape: 'Elongated',
      type: 'Two-piece',
      flush_type: 'Gravity',
    },
    certifications: 'WaterSense, ADA, CALGreen',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-3817-0_main_model.jpg.imagep.600.600.jpg',
  },
  {
    sku: 'K-6669-0',
    name: 'Veil Intelligent Skirted One-Piece Elongated Dual-Flush Toilet',
    category: 'Toilets',
    description: 'Veil\u00ae intelligent toilets feature Kohler Cleansing technology with an integrated personal cleansing wand that offers adjustable spray shape, position, and temperature.',
    listPrice: 3890.00,
    finish: 'White',
    isADACompliant: true,
    isWaterSense: false,
    specifications: {
      flush_volume: '0.8/1.28 gpf dual flush',
      bowl_height: '17-19 inches',
      bowl_shape: 'Elongated',
      type: 'One-piece intelligent',
      flush_type: 'Dual flush',
      features: 'Heated seat, bidet functionality, touchscreen remote',
    },
    certifications: 'ADA, CALGreen',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-6669-0_main_model.jpg.imagep.600.600.jpg',
  },

  // SHOWERS
  {
    sku: 'K-10282-AK-CP',
    name: 'Forte Multifunction Showerhead',
    category: 'Showers',
    description: 'With its sleek, cylindrical silhouette and easy-to-clean Katalyst spray face, this Forte rainhead offers three distinctive spray experiences.',
    listPrice: 225.00,
    finish: 'Polished Chrome',
    isADACompliant: false,
    isWaterSense: true,
    specifications: {
      flow_rate: '2.0 gpm',
      spray_patterns: '3 (full coverage, pulsating massage, silk)',
      finish: 'Polished chrome',
      mount: 'Ceiling or wall mount',
    },
    certifications: 'WaterSense, CALGreen',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-10282-AK-CP_main_model.jpg.imagep.600.600.jpg',
  },
  {
    sku: 'K-45123-CP',
    name: 'Alteo Rite-Temp Pressure-Balancing Shower Faucet Trim',
    category: 'Showers',
    description: 'With contemporary styling, the Alteo faucet complements a range of bathroom d\u00e9cor.',
    listPrice: 185.00,
    finish: 'Polished Chrome',
    isADACompliant: true,
    isWaterSense: false,
    specifications: {
      valve_type: 'Pressure balancing',
      handle_type: 'Lever',
      connection: '1/2 inch',
    },
    certifications: 'ADA, CALGreen, ICC/ANSI A117.1',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-45123-CP_main_model.jpg.imagep.600.600.jpg',
  },

  // BATHROOM SINKS
  {
    sku: 'K-2210-0',
    name: 'Caxton Undermount Bathroom Sink',
    category: 'Bathroom Sinks',
    description: 'Beautifully simple in design, the Caxton undermount sink suits a variety of bathroom styles. This oval sink is crafted from enameled cast iron for long-lasting durability and luster.',
    listPrice: 235.00,
    finish: 'White',
    isADACompliant: false,
    isWaterSense: false,
    specifications: {
      installation: 'Undermount',
      material: 'Vitreous China',
      overflow: 'Yes',
      dimensions: '17" x 14" x 6-1/4"',
      faucet_holes: '0',
    },
    certifications: 'None',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-2210-0_main_model.jpg.imagep.600.600.jpg',
  },
  {
    sku: 'K-2991-1-0',
    name: 'Tresham Rectangular Drop-In Bathroom Sink',
    category: 'Bathroom Sinks',
    description: 'With architectural influences from the Arts and Crafts movement, Tresham integrates strong geometric forms in a clean, transitional style.',
    listPrice: 265.00,
    finish: 'White',
    isADACompliant: false,
    isWaterSense: false,
    specifications: {
      installation: 'Drop-in',
      material: 'Vitreous China',
      overflow: 'Yes',
      dimensions: '24" x 19-1/4" x 8-5/8"',
      faucet_holes: '1',
    },
    certifications: 'None',
    imageUrl: 'https://www.kohler.com/content/dam/kohler-commercial/images/products/K-2991-1-0_main_model.jpg.imagep.600.600.jpg',
  },
]

async function main() {
  console.log('🌱 Starting KOHLER product seeding...\\n')

  try {
    // Step 1: Ensure KOHLER provider exists
    console.log('1️⃣ Setting up KOHLER provider...')
    let provider = await prisma.provider.findUnique({
      where: { name: 'KOHLER' },
    })

    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          name: 'KOHLER',
          nameEs: 'KOHLER',
          website: 'https://www.kohler.com',
          country: 'United States',
          catalogUrl: 'https://www.kohler.com/en/products',
          scrapingEnabled: false, // Manual seeding
          scrapingFrequency: 'manual',
        },
      })
      console.log('   ✅ Created KOHLER provider')
    } else {
      console.log('   ✅ KOHLER provider already exists')
    }

    // Step 2: Seed products
    console.log('\\n2️⃣ Seeding KOHLER products...')
    let created = 0
    let updated = 0

    for (const productData of kohlerProducts) {
      const existing = await prisma.product.findUnique({
        where: { sku: productData.sku },
      })

      if (existing) {
        await prisma.product.update({
          where: { sku: productData.sku },
          data: {
            name: productData.name,
            category: productData.category,
            description: productData.description,
            listPrice: productData.listPrice,
            currency: 'USD',
            finish: productData.finish,
            brand: 'KOHLER',
            providerId: provider.id,
            isADACompliant: productData.isADACompliant,
            isWaterSense: productData.isWaterSense,
            certifications: productData.certifications,
            specifications: JSON.stringify(productData.specifications),
            sourceUrl: `https://www.kohler.com/en/products/${productData.sku}`,
            lastScrapedAt: new Date(),
          },
        })
        updated++
        console.log(`   ✏️  Updated: ${productData.name}`)
      } else {
        await prisma.product.create({
          data: {
            sku: productData.sku,
            name: productData.name,
            category: productData.category,
            description: productData.description,
            listPrice: productData.listPrice,
            currency: 'USD',
            finish: productData.finish,
            brand: 'KOHLER',
            providerId: provider.id,
            isADACompliant: productData.isADACompliant,
            isWaterSense: productData.isWaterSense,
            certifications: productData.certifications,
            specifications: JSON.stringify(productData.specifications),
            sourceUrl: `https://www.kohler.com/en/products/${productData.sku}`,
            lastScrapedAt: new Date(),
          },
        })
        created++
        console.log(`   ✅ Created: ${productData.name}`)
      }
    }

    // Print summary
    console.log('\\n' + '='.repeat(60))
    console.log('📊 SEEDING SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Products Created: ${created}`)
    console.log(`✏️  Products Updated: ${updated}`)
    console.log(`📦 Total Products: ${created + updated}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\\n❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('\\n✅ Seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\\n❌ Script failed:', error)
    process.exit(1)
  })
