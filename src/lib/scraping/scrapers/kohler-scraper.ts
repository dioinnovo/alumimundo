/**
 * KOHLER Product Scraper
 *
 * Scrapes bathroom fixtures from KOHLER website:
 * - Bathroom Faucets
 * - Toilets
 * - Showers
 * - Sinks
 * - Accessories
 */

import { BaseScraper, ScrapedProduct } from '../base-scraper'

export class KohlerScraper extends BaseScraper {
  private readonly BASE_URL = 'https://www.kohler.com'
  private readonly CATEGORY_URLS = {
    'Bathroom Faucets': '/en/products/bathroom-faucets',
    'Toilets': '/en/products/toilets/shop-toilets',
    'Showers': '/en/products/showers/shop-showers',
    'Bathroom Sinks': '/en/products/bathroom-sinks',
    'Widespread Faucets': '/en/products/bathroom-faucets/shop-widespread-bathroom-sink-faucets',
  }

  constructor(providerId: string) {
    super('KOHLER', providerId)
  }

  /**
   * Get product listing URLs for KOHLER bathroom categories
   */
  protected async getProductListingUrls(): Promise<string[]> {
    const urls: string[] = []

    for (const [category, path] of Object.entries(this.CATEGORY_URLS)) {
      urls.push(`${this.BASE_URL}${path}`)
      console.log(`📋 Added category: ${category}`)
    }

    return urls
  }

  /**
   * Scrape product list page to get individual product URLs
   */
  protected async scrapeProductList(listUrl: string): Promise<string[]> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    await this.navigateTo(listUrl)
    await this.delay(2000)

    // Scroll to load lazy-loaded products
    await this.scrollPage()
    await this.delay(1000)

    // Extract product URLs
    const productUrls = await this.page.evaluate(() => {
      const urls: string[] = []

      // KOHLER uses various selectors for product cards
      const selectors = [
        'a[href*="/products/"]',
        'a[data-testid*="product"]',
        '.product-card a',
        '[class*="ProductCard"] a',
      ]

      const links = new Set<string>()

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          const href = (el as HTMLAnchorElement).href
          if (href && href.includes('/products/') && !href.includes('#')) {
            links.add(href)
          }
        })
      })

      return Array.from(links)
    })

    // Filter to get unique product pages (not category pages)
    const filteredUrls = productUrls.filter(url => {
      // Skip category/collection/bundle pages
      const skipPatterns = [
        '/shop-',
        '/browse-',
        '/collections',
        '-collection',
        '-bundles',
        '/bundles',
        '/smart-home',
        '/mix-and-match',
        '/bathroom-faucets$',  // Category page itself
        '/toilets$',           // Category page itself
        '/showers$',           // Category page itself
        '/bathroom-sinks$',    // Category page itself
      ]

      // Check if URL matches any skip pattern
      const shouldSkip = skipPatterns.some(pattern => {
        if (pattern.includes('$')) {
          // Exact match for category pages
          return url.match(new RegExp(pattern))
        }
        return url.includes(pattern)
      })

      // Only include if:
      // 1. It's under /products/
      // 2. It doesn't match skip patterns
      // 3. It has a specific product path (more than just category)
      return url.includes('/products/') &&
             !shouldSkip &&
             url.split('/').length > 5 // Ensures there's a specific product segment
    })

    console.log(`   Found ${filteredUrls.length} product URLs`)

    // Limit to prevent overwhelming scraping
    return filteredUrls.slice(0, 20) // Take first 20 products per category
  }

  /**
   * Scrape individual product page
   */
  protected async scrapeProductPage(productUrl: string): Promise<ScrapedProduct | null> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    try {
      await this.navigateTo(productUrl)
      await this.delay(2000)

      // Extract product data
      const product = await this.page.evaluate((url) => {
        // Helper to safely extract text
        const getText = (selector: string): string | undefined => {
          const el = document.querySelector(selector)
          return el?.textContent?.trim()
        }

        // Helper to extract multiple texts
        const getTexts = (selector: string): string[] => {
          const elements = document.querySelectorAll(selector)
          return Array.from(elements).map(el => el.textContent?.trim() || '').filter(Boolean)
        }

        // Get product name
        const name = getText('h1') ||
                     getText('[class*="ProductTitle"]') ||
                     getText('[data-testid="product-name"]') ||
                     'Unknown Product'

        // Get SKU/Model number
        const sku = getText('[class*="model"]')?.replace(/Model[:\s]*/i, '') ||
                    getText('[data-testid="sku"]') ||
                    getText('[class*="sku"]') ||
                    url.split('/').pop()?.split('.')[0] ||
                    `KOHLER-${Date.now()}`

        // Get description
        const description = getText('[class*="description"]') ||
                           getText('[class*="ProductDescription"]') ||
                           getText('meta[name="description"]')

        // Get price
        const priceText = getText('[class*="price"]') ||
                         getText('[data-testid="price"]') ||
                         getText('[class*="Price"]')
        const listPrice = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : undefined

        // Get specifications
        const specs: Record<string, any> = {}
        const specElements = document.querySelectorAll('[class*="spec"], [class*="specification"]')
        specElements.forEach(el => {
          const label = el.querySelector('[class*="label"]')?.textContent?.trim()
          const value = el.querySelector('[class*="value"]')?.textContent?.trim()
          if (label && value) {
            specs[label] = value
          }
        })

        // Get features/certifications
        const features = getTexts('[class*="feature"]')
        const isADACompliant = features.some(f => f.toLowerCase().includes('ada')) ||
                              description?.toLowerCase().includes('ada') ||
                              false

        const isWaterSense = features.some(f => f.toLowerCase().includes('watersense')) ||
                            description?.toLowerCase().includes('watersense') ||
                            false

        // Get finish/color
        const finish = getText('[class*="finish"]') ||
                      specs['Finish'] ||
                      specs['Color']

        // Get images
        const imageUrls: string[] = []
        const imgSelectors = [
          'img[class*="product"]',
          'img[data-testid*="image"]',
          '[class*="ProductImage"] img',
          '.gallery img',
        ]

        imgSelectors.forEach(selector => {
          const images = document.querySelectorAll(selector)
          images.forEach(img => {
            const src = (img as HTMLImageElement).src
            if (src && !src.includes('placeholder') && !imageUrls.includes(src)) {
              imageUrls.push(src)
            }
          })
        })

        // Determine category from URL or breadcrumbs
        let category = 'Bathroom'
        if (url.includes('faucet')) category = 'Faucets'
        else if (url.includes('toilet')) category = 'Toilets'
        else if (url.includes('shower')) category = 'Showers'
        else if (url.includes('sink')) category = 'Sinks'

        return {
          sku,
          name,
          brand: 'KOHLER',
          category,
          description,
          specifications: specs,
          finish,
          isADACompliant,
          isWaterSense,
          listPrice,
          currency: 'USD',
          imageUrls: imageUrls.slice(0, 5), // Limit to 5 images
          sourceUrl: url,
        }
      }, productUrl)

      // Validate required fields
      if (!product.name || product.name === 'Unknown Product') {
        console.warn(`⚠️  Skipping product with no name: ${productUrl}`)
        return null
      }

      return product as ScrapedProduct
    } catch (error) {
      console.error(`❌ Failed to scrape ${productUrl}:`, error)
      return null
    }
  }
}
