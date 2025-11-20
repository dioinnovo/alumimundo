/**
 * Catalog Matching Engine
 * Matches detected door dimensions with manufacturer catalog products
 *
 * Key Features:
 * - Fuzzy matching with tolerance (±2%)
 * - Multi-manufacturer support (Schlage, Steelcraft, KOHLER)
 * - Standard size mapping
 * - Confidence scoring
 * - Fallback to closest match
 */

import { dimensionsMatch, findClosestStandardSize } from '../blueprint-parser/unit-converter'

export interface CatalogProduct {
  id: string
  sku: string
  manufacturer: string
  productName: string
  category: string
  widthCm: number
  heightCm: number
  widthInches: number
  heightInches: number
  unitPrice: number
  currency: string
  specifications?: Record<string, any>
  availability?: 'IN_STOCK' | 'SPECIAL_ORDER' | 'DISCONTINUED'
}

export interface MatchResult {
  product: CatalogProduct
  matchScore: number // 0-1 score
  matchType: 'EXACT' | 'STANDARD' | 'CLOSEST' | 'FALLBACK'
  widthDifference: number // cm
  heightDifference: number // cm
  notes?: string
}

export interface MatchOptions {
  tolerancePercent?: number // Default: 2% (construction standard)
  preferredManufacturers?: string[] // ['Schlage', 'Steelcraft']
  maxResults?: number // Default: 5
  includeDiscontinued?: boolean // Default: false
  matchMode?: 'strict' | 'tolerant' | 'flexible' // Default: 'tolerant'
}

/**
 * Main catalog matcher class
 */
export class CatalogMatcher {
  private catalog: CatalogProduct[]

  constructor(catalog: CatalogProduct[]) {
    this.catalog = catalog
  }

  /**
   * Find matching products for given dimensions
   */
  findMatches(
    widthCm: number,
    heightCm: number,
    doorType?: string,
    options: MatchOptions = {}
  ): MatchResult[] {
    const {
      tolerancePercent = 2,
      preferredManufacturers = [],
      maxResults = 5,
      includeDiscontinued = false,
      matchMode = 'tolerant'
    } = options

    // Filter catalog by availability
    let availableProducts = this.catalog

    if (!includeDiscontinued) {
      availableProducts = availableProducts.filter(
        (p) => p.availability !== 'DISCONTINUED'
      )
    }

    // Filter by preferred manufacturers
    if (preferredManufacturers.length > 0) {
      const preferred = availableProducts.filter((p) =>
        preferredManufacturers.includes(p.manufacturer)
      )

      // Use preferred if available, otherwise use all
      if (preferred.length > 0) {
        availableProducts = preferred
      }
    }

    const matches: MatchResult[] = []

    // Step 1: Find exact matches (within tolerance)
    for (const product of availableProducts) {
      const widthMatches = dimensionsMatch(
        widthCm,
        product.widthCm,
        tolerancePercent
      )
      const heightMatches = dimensionsMatch(
        heightCm,
        product.heightCm,
        tolerancePercent
      )

      if (widthMatches && heightMatches) {
        const widthDiff = Math.abs(widthCm - product.widthCm)
        const heightDiff = Math.abs(heightCm - product.heightCm)

        matches.push({
          product,
          matchScore: this.calculateMatchScore(widthDiff, heightDiff, 'EXACT'),
          matchType: 'EXACT',
          widthDifference: widthDiff,
          heightDifference: heightDiff
        })
      }
    }

    // Step 2: If no exact matches, try standard sizes
    if (matches.length === 0 && matchMode !== 'strict') {
      const standardWidth = findClosestStandardSize(widthCm, 'width')
      const standardHeight = findClosestStandardSize(heightCm, 'height')

      for (const product of availableProducts) {
        const widthMatches = dimensionsMatch(
          standardWidth.standard,
          product.widthInches,
          tolerancePercent
        )
        const heightMatches = dimensionsMatch(
          standardHeight.standard,
          product.heightInches,
          tolerancePercent
        )

        if (widthMatches && heightMatches) {
          const widthDiff = Math.abs(widthCm - product.widthCm)
          const heightDiff = Math.abs(heightCm - product.heightCm)

          matches.push({
            product,
            matchScore: this.calculateMatchScore(
              widthDiff,
              heightDiff,
              'STANDARD'
            ),
            matchType: 'STANDARD',
            widthDifference: widthDiff,
            heightDifference: heightDiff,
            notes: `Matched to standard size: ${standardWidth.standard}" × ${standardHeight.standard}"`
          })
        }
      }
    }

    // Step 3: If still no matches, find closest products
    if (matches.length === 0 && matchMode === 'flexible') {
      // Calculate distance for all products
      const productsWithDistance = availableProducts.map((product) => {
        const widthDiff = Math.abs(widthCm - product.widthCm)
        const heightDiff = Math.abs(heightCm - product.heightCm)
        const totalDiff = Math.sqrt(widthDiff ** 2 + heightDiff ** 2)

        return {
          product,
          widthDiff,
          heightDiff,
          totalDiff
        }
      })

      // Sort by total difference
      productsWithDistance.sort((a, b) => a.totalDiff - b.totalDiff)

      // Take top N closest matches
      for (const { product, widthDiff, heightDiff } of productsWithDistance.slice(
        0,
        maxResults
      )) {
        matches.push({
          product,
          matchScore: this.calculateMatchScore(widthDiff, heightDiff, 'CLOSEST'),
          matchType: 'CLOSEST',
          widthDifference: widthDiff,
          heightDifference: heightDiff,
          notes: `Closest available size (${widthDiff.toFixed(1)}cm width diff, ${heightDiff.toFixed(1)}cm height diff)`
        })
      }
    }

    // Sort by match score (descending)
    matches.sort((a, b) => b.matchScore - a.matchScore)

    // Return top N results
    return matches.slice(0, maxResults)
  }

  /**
   * Calculate match score (0-1)
   */
  private calculateMatchScore(
    widthDiff: number,
    heightDiff: number,
    matchType: 'EXACT' | 'STANDARD' | 'CLOSEST'
  ): number {
    // Base score by match type
    let baseScore = 0.5

    switch (matchType) {
      case 'EXACT':
        baseScore = 1.0
        break
      case 'STANDARD':
        baseScore = 0.85
        break
      case 'CLOSEST':
        baseScore = 0.6
        break
    }

    // Reduce score based on dimensional difference
    // Penalty: 0.05 per cm of difference (max 0.5 penalty)
    const totalDiff = widthDiff + heightDiff
    const penalty = Math.min(totalDiff * 0.05, 0.5)

    return Math.max(0, baseScore - penalty)
  }

  /**
   * Find products by manufacturer
   */
  findByManufacturer(manufacturer: string): CatalogProduct[] {
    return this.catalog.filter(
      (p) => p.manufacturer.toLowerCase() === manufacturer.toLowerCase()
    )
  }

  /**
   * Find products by category
   */
  findByCategory(category: string): CatalogProduct[] {
    return this.catalog.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    )
  }

  /**
   * Get product by SKU
   */
  findBySKU(sku: string): CatalogProduct | undefined {
    return this.catalog.find((p) => p.sku === sku)
  }

  /**
   * Get catalog statistics
   */
  getStats(): {
    totalProducts: number
    manufacturers: string[]
    categories: string[]
    priceRange: { min: number; max: number; currency: string }
  } {
    const manufacturers = [...new Set(this.catalog.map((p) => p.manufacturer))]
    const categories = [...new Set(this.catalog.map((p) => p.category))]

    const prices = this.catalog.map((p) => p.unitPrice)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return {
      totalProducts: this.catalog.length,
      manufacturers,
      categories,
      priceRange: {
        min: minPrice,
        max: maxPrice,
        currency: this.catalog[0]?.currency || 'CRC'
      }
    }
  }
}

/**
 * Mock catalog data for demonstration
 * TODO: Replace with actual database queries
 */
export function getMockCatalog(): CatalogProduct[] {
  return [
    // Schlage Interior Doors
    {
      id: '1',
      sku: 'SCH-INT-36X84',
      manufacturer: 'Schlage',
      productName: 'Interior Single Door - Standard',
      category: 'INTERIOR_SINGLE',
      widthCm: 91.44, // 36"
      heightCm: 213.36, // 84"
      widthInches: 36,
      heightInches: 84,
      unitPrice: 45000,
      currency: 'CRC',
      availability: 'IN_STOCK'
    },
    {
      id: '2',
      sku: 'SCH-INT-32X84',
      manufacturer: 'Schlage',
      productName: 'Interior Single Door - Narrow',
      category: 'INTERIOR_SINGLE',
      widthCm: 81.28, // 32"
      heightCm: 213.36, // 84"
      widthInches: 32,
      heightInches: 84,
      unitPrice: 42000,
      currency: 'CRC',
      availability: 'IN_STOCK'
    },

    // Schlage Exterior Doors
    {
      id: '3',
      sku: 'SCH-EXT-36X84',
      manufacturer: 'Schlage',
      productName: 'Exterior Single Door - Security Grade',
      category: 'EXTERIOR_SINGLE',
      widthCm: 91.44,
      heightCm: 213.36,
      widthInches: 36,
      heightInches: 84,
      unitPrice: 125000,
      currency: 'CRC',
      availability: 'IN_STOCK'
    },

    // Steelcraft Fire-Rated Doors
    {
      id: '4',
      sku: 'STC-FIRE60-36X84',
      manufacturer: 'Steelcraft',
      productName: 'Fire-Rated Door 60-Min',
      category: 'FIRE_RATED_60MIN',
      widthCm: 91.44,
      heightCm: 213.36,
      widthInches: 36,
      heightInches: 84,
      unitPrice: 185000,
      currency: 'CRC',
      availability: 'SPECIAL_ORDER'
    },
    {
      id: '5',
      sku: 'STC-FIRE90-36X84',
      manufacturer: 'Steelcraft',
      productName: 'Fire-Rated Door 90-Min',
      category: 'FIRE_RATED_90MIN',
      widthCm: 91.44,
      heightCm: 213.36,
      widthInches: 36,
      heightInches: 84,
      unitPrice: 225000,
      currency: 'CRC',
      availability: 'SPECIAL_ORDER'
    },

    // Metric standard sizes (common in Costa Rica)
    {
      id: '6',
      sku: 'SCH-INT-90X210',
      manufacturer: 'Schlage',
      productName: 'Interior Single Door - Metric Standard',
      category: 'INTERIOR_SINGLE',
      widthCm: 90,
      heightCm: 210,
      widthInches: 35.43,
      heightInches: 82.68,
      unitPrice: 44000,
      currency: 'CRC',
      availability: 'IN_STOCK'
    },
    {
      id: '7',
      sku: 'SCH-INT-80X210',
      manufacturer: 'Schlage',
      productName: 'Interior Single Door - Metric Narrow',
      category: 'INTERIOR_SINGLE',
      widthCm: 80,
      heightCm: 210,
      widthInches: 31.5,
      heightInches: 82.68,
      unitPrice: 41000,
      currency: 'CRC',
      availability: 'IN_STOCK'
    }
  ]
}

/**
 * Helper function to format match results for display
 */
export function formatMatchResults(matches: MatchResult[]): string {
  if (matches.length === 0) {
    return 'No matches found in catalog'
  }

  const results = matches.map((match, idx) => {
    const { product, matchScore, matchType, widthDifference, heightDifference } =
      match

    return `${idx + 1}. ${product.productName} (${product.sku})
   Manufacturer: ${product.manufacturer}
   Size: ${product.widthCm}cm × ${product.heightCm}cm (${product.widthInches}" × ${product.heightInches}")
   Price: ${product.currency} ${product.unitPrice.toLocaleString()}
   Match: ${(matchScore * 100).toFixed(1)}% (${matchType})
   Difference: ±${widthDifference.toFixed(1)}cm width, ±${heightDifference.toFixed(1)}cm height
   ${match.notes ? `Notes: ${match.notes}` : ''}`
  })

  return results.join('\n\n')
}
