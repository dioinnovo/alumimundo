/**
 * Base Web Scraper for Product Data
 *
 * Uses Puppeteer to scrape manufacturer websites systematically
 */

import puppeteer, { Browser, Page } from 'puppeteer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface ScrapedProduct {
  sku: string
  name: string
  nameEs?: string
  brand: string
  category: string
  subcategory?: string
  description?: string
  descriptionEs?: string
  specifications?: Record<string, any>
  finish?: string
  color?: string
  material?: string

  // Compliance
  isADACompliant?: boolean
  isMarineGrade?: boolean
  isWaterSense?: boolean
  certifications?: string[]

  // Environmental
  isEcoFriendly?: boolean
  sustainabilityRating?: number

  // Pricing
  listPrice?: number
  currency?: string

  // Metadata
  weight?: number
  dimensions?: string
  warrantyYears?: number
  searchKeywords?: string[]

  // Images
  imageUrls: string[]

  // Source
  sourceUrl: string
}

export interface ScrapeResult {
  success: boolean
  productsFound: number
  productsScraped: ScrapedProduct[]
  errors: string[]
  duration: number
}

export abstract class BaseScraper {
  protected browser: Browser | null = null
  protected page: Page | null = null
  protected brand: string
  protected providerId: string

  constructor(brand: string, providerId: string) {
    this.brand = brand
    this.providerId = providerId
  }

  /**
   * Initialize Puppeteer browser
   */
  protected async initBrowser(): Promise<void> {
    if (this.browser) return

    console.log(`🌐 Launching browser for ${this.brand}...`)

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    })

    this.page = await this.browser.newPage()

    // Set a realistic user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Set viewport
    await this.page.setViewport({
      width: 1920,
      height: 1080,
    })

    console.log(`✅ Browser ready for ${this.brand}`)
  }

  /**
   * Close browser
   */
  protected async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.page = null
      console.log(`🔒 Browser closed for ${this.brand}`)
    }
  }

  /**
   * Navigate to a URL with retry logic
   */
  protected async navigateTo(url: string, maxRetries = 3): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`📍 Navigating to: ${url}`)
        await this.page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        })
        return
      } catch (error) {
        lastError = error as Error
        console.warn(`⚠️  Navigation failed (attempt ${attempt + 1}/${maxRetries}):`, error)

        if (attempt < maxRetries - 1) {
          await this.delay(2000 * (attempt + 1)) // Exponential backoff
        }
      }
    }

    throw lastError || new Error('Navigation failed')
  }

  /**
   * Wait for selector with timeout
   */
  protected async waitForSelector(selector: string, timeout = 10000): Promise<boolean> {
    if (!this.page) return false

    try {
      await this.page.waitForSelector(selector, { timeout })
      return true
    } catch {
      return false
    }
  }

  /**
   * Scroll page to load lazy images
   */
  protected async scrollPage(): Promise<void> {
    if (!this.page) return

    await this.page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0
        const distance = 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance

          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })
  }

  /**
   * Delay helper
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Abstract method: Get product listing URLs
   */
  protected abstract getProductListingUrls(): Promise<string[]>

  /**
   * Abstract method: Scrape product list page
   */
  protected abstract scrapeProductList(listUrl: string): Promise<string[]>

  /**
   * Abstract method: Scrape individual product page
   */
  protected abstract scrapeProductPage(productUrl: string): Promise<ScrapedProduct | null>

  /**
   * Main scrape method
   */
  async scrape(): Promise<ScrapeResult> {
    const startTime = Date.now()
    const errors: string[] = []
    const scrapedProducts: ScrapedProduct[] = []

    try {
      // Initialize browser
      await this.initBrowser()

      // Get listing URLs
      console.log(`\n📋 Getting product listings for ${this.brand}...`)
      const listingUrls = await this.getProductListingUrls()
      console.log(`✅ Found ${listingUrls.length} product listing pages`)

      // Scrape each listing page
      for (const listUrl of listingUrls) {
        try {
          const productUrls = await this.scrapeProductList(listUrl)
          console.log(`✅ Found ${productUrls.length} products on listing page`)

          // Scrape each product
          for (const productUrl of productUrls) {
            try {
              const product = await this.scrapeProductPage(productUrl)

              if (product) {
                scrapedProducts.push(product)
                console.log(`✅ Scraped: ${product.name} (${product.sku})`)
              }

              // Rate limiting
              await this.delay(1000 + Math.random() * 1000)
            } catch (error) {
              const errorMsg = `Failed to scrape product ${productUrl}: ${error}`
              console.error(`❌ ${errorMsg}`)
              errors.push(errorMsg)
            }
          }
        } catch (error) {
          const errorMsg = `Failed to scrape listing ${listUrl}: ${error}`
          console.error(`❌ ${errorMsg}`)
          errors.push(errorMsg)
        }
      }

      const duration = Date.now() - startTime

      return {
        success: scrapedProducts.length > 0,
        productsFound: scrapedProducts.length,
        productsScraped: scrapedProducts,
        errors,
        duration,
      }
    } catch (error) {
      const errorMsg = `Fatal scraping error for ${this.brand}: ${error}`
      console.error(`❌ ${errorMsg}`)
      errors.push(errorMsg)

      return {
        success: false,
        productsFound: 0,
        productsScraped: [],
        errors,
        duration: Date.now() - startTime,
      }
    } finally {
      await this.closeBrowser()
    }
  }

  /**
   * Save scraped products to database
   */
  async saveToDatabase(products: ScrapedProduct[]): Promise<void> {
    console.log(`\n💾 Saving ${products.length} products to database...`)

    for (const product of products) {
      try {
        await prisma.product.upsert({
          where: { sku: product.sku },
          update: {
            name: product.name,
            nameEs: product.nameEs,
            brand: product.brand,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,
            descriptionEs: product.descriptionEs,
            specifications: JSON.stringify(product.specifications),
            finish: product.finish,
            color: product.color,
            material: product.material,
            isADACompliant: product.isADACompliant || false,
            isMarineGrade: product.isMarineGrade || false,
            isWaterSense: product.isWaterSense || false,
            certifications: product.certifications?.join(', '),
            isEcoFriendly: product.isEcoFriendly || false,
            sustainabilityRating: product.sustainabilityRating,
            listPrice: product.listPrice,
            currency: product.currency || 'USD',
            weight: product.weight,
            dimensions: product.dimensions,
            warrantyYears: product.warrantyYears,
            searchKeywords: product.searchKeywords?.join(', '),
            sourceUrl: product.sourceUrl,
            lastScrapedAt: new Date(),
            providerId: this.providerId,
          },
          create: {
            sku: product.sku,
            name: product.name,
            nameEs: product.nameEs,
            brand: product.brand,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,
            descriptionEs: product.descriptionEs,
            specifications: JSON.stringify(product.specifications),
            finish: product.finish,
            color: product.color,
            material: product.material,
            isADACompliant: product.isADACompliant || false,
            isMarineGrade: product.isMarineGrade || false,
            isWaterSense: product.isWaterSense || false,
            certifications: product.certifications?.join(', '),
            isEcoFriendly: product.isEcoFriendly || false,
            sustainabilityRating: product.sustainabilityRating,
            listPrice: product.listPrice,
            currency: product.currency || 'USD',
            weight: product.weight,
            dimensions: product.dimensions,
            warrantyYears: product.warrantyYears,
            searchKeywords: product.searchKeywords?.join(', '),
            sourceUrl: product.sourceUrl,
            lastScrapedAt: new Date(),
            providerId: this.providerId,
          },
        })

        console.log(`✅ Saved: ${product.name}`)
      } catch (error) {
        console.error(`❌ Failed to save ${product.sku}:`, error)
      }
    }

    console.log(`✅ Saved ${products.length} products to database`)
  }
}
