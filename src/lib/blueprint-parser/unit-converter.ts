/**
 * Unit Conversion Library for Construction Measurements
 *
 * Handles bidirectional conversion between metric (mm, cm, m) and imperial (in, ft, yd)
 * Includes tolerance handling for construction applications
 *
 * Key Features:
 * - Exact conversions using standard factors
 * - Tolerance-based matching for catalog products
 * - Rounding rules for construction measurements
 * - Support for fractional inches (e.g., 36 1/2")
 */

// Conversion constants (exact values)
const CM_TO_INCH = 0.393700787 // 1 cm = 0.393700787 inches
const INCH_TO_CM = 2.54 // 1 inch = 2.54 cm (exact)
const FOOT_TO_CM = 30.48 // 1 foot = 30.48 cm (exact)
const METER_TO_CM = 100 // 1 meter = 100 cm (exact)
const MM_TO_CM = 0.1 // 1 mm = 0.1 cm (exact)

export interface DimensionMetric {
  value: number
  unit: 'MM' | 'CM' | 'M'
}

export interface DimensionImperial {
  value: number
  unit: 'INCH' | 'FOOT' | 'YARD'
}

export interface ConversionResult {
  original: number
  originalUnit: string
  converted: number
  convertedUnit: string
  tolerance?: number
}

export interface DimensionPair {
  metric: string // "90cm × 210cm"
  imperial: string // "36\" × 84\""
  widthCm: number
  heightCm: number
  widthInches: number
  heightInches: number
}

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number, precision: number = 2): number {
  return parseFloat((cm * CM_TO_INCH).toFixed(precision))
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number, precision: number = 2): number {
  return parseFloat((inches * INCH_TO_CM).toFixed(precision))
}

/**
 * Convert meters to centimeters
 */
export function metersToCm(meters: number): number {
  return meters * METER_TO_CM
}

/**
 * Convert millimeters to centimeters
 */
export function mmToCm(mm: number): number {
  return mm * MM_TO_CM
}

/**
 * Convert feet to centimeters
 */
export function feetToCm(feet: number, precision: number = 2): number {
  return parseFloat((feet * FOOT_TO_CM).toFixed(precision))
}

/**
 * Convert fractional inches to decimal inches
 * Examples: "36 1/2" → 36.5, "3/4" → 0.75, "84" → 84
 */
export function fractionalInchesToDecimal(fractionalInches: string): number {
  // Remove extra spaces and quotes
  const clean = fractionalInches.replace(/["'\s]+/g, ' ').trim()

  // Pattern: "whole fraction" or just "fraction" or just "whole"
  const match = clean.match(/^(\d+)?\s*(\d+\/\d+)?$/)
  if (!match) {
    throw new Error(`Invalid fractional inches format: ${fractionalInches}`)
  }

  const whole = match[1] ? parseInt(match[1]) : 0
  const fraction = match[2]

  if (fraction) {
    const [num, denom] = fraction.split('/').map(Number)
    return whole + num / denom
  }

  return whole
}

/**
 * Convert decimal inches to fractional inches
 * Examples: 36.5 → "36 1/2\"", 84.25 → "84 1/4\"", 36 → "36\""
 */
export function decimalInchesToFractional(inches: number, denominators: number[] = [2, 4, 8, 16]): string {
  const whole = Math.floor(inches)
  const decimal = inches - whole

  // If no fractional part, return whole number
  if (decimal < 0.001) {
    return `${whole}"`
  }

  // Find the best fractional representation
  for (const denom of denominators) {
    const numerator = Math.round(decimal * denom)
    if (Math.abs(decimal - numerator / denom) < 0.01) {
      // Simplify fraction
      const gcd = findGCD(numerator, denom)
      const simplifiedNum = numerator / gcd
      const simplifiedDenom = denom / gcd

      if (simplifiedNum === 0) {
        return `${whole}"`
      }

      if (whole === 0) {
        return `${simplifiedNum}/${simplifiedDenom}"`
      }

      return `${whole} ${simplifiedNum}/${simplifiedDenom}"`
    }
  }

  // Fallback: use decimal
  return `${inches.toFixed(2)}"`
}

/**
 * Find Greatest Common Divisor (for fraction simplification)
 */
function findGCD(a: number, b: number): number {
  return b === 0 ? a : findGCD(b, a % b)
}

/**
 * Parse dimension string and extract width and height
 * Supports formats: "90cm × 210cm", "36\" × 84\"", "90 x 210", "3' × 7'"
 */
export function parseDimensionString(dimensionStr: string): DimensionPair | null {
  // Clean the string
  const clean = dimensionStr.trim().toLowerCase()

  // Try to match various patterns
  // Pattern 1: "90cm × 210cm" or "90cm x 210cm"
  const metricMatch = clean.match(/(\d+(?:\.\d+)?)\s*(mm|cm|m)\s*[×x]\s*(\d+(?:\.\d+)?)\s*(mm|cm|m)/)
  if (metricMatch) {
    const width = parseFloat(metricMatch[1])
    const widthUnit = metricMatch[2].toUpperCase()
    const height = parseFloat(metricMatch[3])
    const heightUnit = metricMatch[4].toUpperCase()

    // Normalize to cm
    let widthCm = width
    let heightCm = height

    if (widthUnit === 'MM') widthCm = mmToCm(width)
    else if (widthUnit === 'M') widthCm = metersToCm(width)

    if (heightUnit === 'MM') heightCm = mmToCm(height)
    else if (heightUnit === 'M') heightCm = metersToCm(height)

    // Convert to imperial
    const widthInches = cmToInches(widthCm)
    const heightInches = cmToInches(heightCm)

    return {
      metric: `${widthCm}cm × ${heightCm}cm`,
      imperial: `${decimalInchesToFractional(widthInches)} × ${decimalInchesToFractional(heightInches)}`,
      widthCm,
      heightCm,
      widthInches,
      heightInches
    }
  }

  // Pattern 2: "36\" × 84\"" or "36 × 84" (inches implied)
  const inchMatch = clean.match(/(\d+(?:\s+\d+\/\d+)?)\s*["'']?\s*[×x]\s*(\d+(?:\s+\d+\/\d+)?)\s*["'']?/)
  if (inchMatch) {
    try {
      const widthInches = fractionalInchesToDecimal(inchMatch[1])
      const heightInches = fractionalInchesToDecimal(inchMatch[2])

      // Convert to metric
      const widthCm = inchesToCm(widthInches)
      const heightCm = inchesToCm(heightInches)

      return {
        metric: `${widthCm}cm × ${heightCm}cm`,
        imperial: `${decimalInchesToFractional(widthInches)} × ${decimalInchesToFractional(heightInches)}`,
        widthCm,
        heightCm,
        widthInches,
        heightInches
      }
    } catch (e) {
      console.error('Error parsing fractional inches:', e)
      return null
    }
  }

  // Pattern 3: "3' × 7'" (feet)
  const feetMatch = clean.match(/(\d+(?:\.\d+)?)\s*'?\s*[×x]\s*(\d+(?:\.\d+)?)\s*'?/)
  if (feetMatch && clean.includes("'")) {
    const widthFeet = parseFloat(feetMatch[1])
    const heightFeet = parseFloat(feetMatch[2])

    const widthCm = feetToCm(widthFeet)
    const heightCm = feetToCm(heightFeet)
    const widthInches = widthFeet * 12
    const heightInches = heightFeet * 12

    return {
      metric: `${widthCm}cm × ${heightCm}cm`,
      imperial: `${decimalInchesToFractional(widthInches)} × ${decimalInchesToFractional(heightInches)}`,
      widthCm,
      heightCm,
      widthInches,
      heightInches
    }
  }

  return null
}

/**
 * Check if two dimensions match within tolerance
 *
 * @param dimension1 - First dimension in cm
 * @param dimension2 - Second dimension in cm
 * @param tolerancePercent - Tolerance as percentage (default: 2% for construction)
 * @returns true if dimensions match within tolerance
 */
export function dimensionsMatch(
  dimension1: number,
  dimension2: number,
  tolerancePercent: number = 2
): boolean {
  const tolerance = (dimension1 * tolerancePercent) / 100
  const diff = Math.abs(dimension1 - dimension2)
  return diff <= tolerance
}

/**
 * Find closest standard imperial size to a metric dimension
 * Common door sizes: 24", 28", 30", 32", 34", 36", 42" (width)
 *                    80", 84", 96" (height)
 */
export function findClosestStandardSize(
  dimensionCm: number,
  type: 'width' | 'height'
): { standard: number; standardInches: number; difference: number } {
  const standardWidths = [24, 28, 30, 32, 34, 36, 42] // inches
  const standardHeights = [80, 84, 96] // inches

  const standards = type === 'width' ? standardWidths : standardHeights
  const dimensionInches = cmToInches(dimensionCm)

  let closest = standards[0]
  let minDiff = Math.abs(dimensionInches - closest)

  for (const standard of standards) {
    const diff = Math.abs(dimensionInches - standard)
    if (diff < minDiff) {
      minDiff = diff
      closest = standard
    }
  }

  return {
    standard: inchesToCm(closest),
    standardInches: closest,
    difference: minDiff
  }
}

/**
 * Format dimension for display
 */
export function formatDimension(
  value: number,
  unit: 'CM' | 'INCH',
  includeFractional: boolean = false
): string {
  if (unit === 'CM') {
    return `${value.toFixed(1)}cm`
  } else {
    if (includeFractional) {
      return decimalInchesToFractional(value)
    }
    return `${value.toFixed(2)}"`
  }
}

/**
 * Convert full dimension pair (width × height)
 */
export function convertDimensionPair(
  width: number,
  height: number,
  fromUnit: 'CM' | 'INCH'
): DimensionPair {
  if (fromUnit === 'CM') {
    const widthInches = cmToInches(width)
    const heightInches = cmToInches(height)

    return {
      metric: `${width}cm × ${height}cm`,
      imperial: `${decimalInchesToFractional(widthInches)} × ${decimalInchesToFractional(heightInches)}`,
      widthCm: width,
      heightCm: height,
      widthInches,
      heightInches
    }
  } else {
    const widthCm = inchesToCm(width)
    const heightCm = inchesToCm(height)

    return {
      metric: `${widthCm}cm × ${heightCm}cm`,
      imperial: `${decimalInchesToFractional(width)} × ${decimalInchesToFractional(height)}`,
      widthCm,
      heightCm,
      widthInches: width,
      heightInches: height
    }
  }
}

/**
 * Extract scale from drawing annotations
 * Examples: "1:100", "1/4\" = 1'", "SCALE 1:50"
 */
export function parseScale(scaleString: string): number | null {
  const clean = scaleString.trim().toLowerCase()

  // Pattern: "1:100" or "1/100"
  const ratioMatch = clean.match(/1[:/](\d+)/)
  if (ratioMatch) {
    return parseInt(ratioMatch[1])
  }

  // Pattern: "1/4\" = 1'" (architectural scale)
  const archMatch = clean.match(/(\d+\/\d+)["'']\s*=\s*(\d+)['']/)
  if (archMatch) {
    const fraction = fractionalInchesToDecimal(archMatch[1])
    const feet = parseInt(archMatch[2])
    // Convert to ratio: (fraction inches) = (feet * 12 inches)
    return (feet * 12) / fraction
  }

  return null
}
