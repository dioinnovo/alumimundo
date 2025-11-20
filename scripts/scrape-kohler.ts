#!/usr/bin/env tsx

/**
 * KOHLER Scraper Script
 *
 * Run with: npx tsx scripts/scrape-kohler.ts
 */

import { PrismaClient } from '@prisma/client'
import { KohlerScraper } from '../src/lib/scraping/scrapers/kohler-scraper'
import { ImageProcessor } from '../src/lib/scraping/image-processor'
import { ProgressTracker } from '../src/lib/scraping/progress-tracker'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting KOHLER product scraper...\n')

  try {
    // Step 1: Ensure KOHLER provider exists in database
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
          scrapingEnabled: true,
          scrapingFrequency: 'weekly',
        },
      })
      console.log('   ✅ Created KOHLER provider')
    } else {
      console.log('   ✅ KOHLER provider already exists')
    }

    // Step 2: Initialize progress tracker
    console.log('\n2️⃣ Initializing progress tracker...')
    const tracker = new ProgressTracker(provider.id)
    await tracker.start('kohler-scraper-script')

    // Step 3: Run scraper
    console.log('\n3️⃣ Starting scraping process...')
    const scraper = new KohlerScraper(provider.id)
    const result = await scraper.scrape()

    // Step 4: Save products to database
    if (result.productsScraped.length > 0) {
      console.log('\n4️⃣ Saving products to database...')
      await scraper.saveToDatabase(result.productsScraped)

      // Update tracker
      await tracker.updateProgress({
        productsFound: result.productsFound,
        productsAdded: result.productsScraped.length,
      })

      // Step 5: Process images
      console.log('\n5️⃣ Processing product images...')
      const imageProcessor = new ImageProcessor()

      let totalImagesDownloaded = 0

      for (const scrapedProduct of result.productsScraped) {
        // Find the saved product in database
        const dbProduct = await prisma.product.findUnique({
          where: { sku: scrapedProduct.sku },
        })

        if (dbProduct && scrapedProduct.imageUrls.length > 0) {
          const imageResults = await imageProcessor.processProductImages(
            dbProduct.id,
            scrapedProduct.brand,
            scrapedProduct.sku,
            scrapedProduct.imageUrls
          )

          const successCount = imageResults.filter(r => r.success).length
          totalImagesDownloaded += successCount

          // Update primary image
          await imageProcessor.updatePrimaryImage(dbProduct.id)
        }
      }

      // Step 6: Complete tracking
      await tracker.complete({
        productsFound: result.productsFound,
        productsAdded: result.productsScraped.length,
        productsUpdated: 0,
        imagesDownloaded: totalImagesDownloaded,
        status: 'COMPLETED',
        notes: `Successfully scraped ${result.productsScraped.length} KOHLER products`,
      })

      // Print summary
      console.log('\n' + '='.repeat(60))
      console.log('📊 SCRAPING SUMMARY')
      console.log('='.repeat(60))
      console.log(`✅ Products Found: ${result.productsFound}`)
      console.log(`✅ Products Saved: ${result.productsScraped.length}`)
      console.log(`✅ Images Downloaded: ${totalImagesDownloaded}`)
      console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`)
      if (result.errors.length > 0) {
        console.log(`⚠️  Errors: ${result.errors.length}`)
      }
      console.log('='.repeat(60))
    } else {
      await tracker.fail('No products found')
      console.error('\n❌ No products were scraped')
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('\n✅ Scraping complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
