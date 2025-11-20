/**
 * Dimension Extraction Utilities
 * Extracts dimensional information from PDF blueprints using OCR and text parsing
 *
 * Key Features:
 * - PDF text extraction (native and OCR-based)
 * - Dimension annotation detection
 * - Scale notation parsing
 * - Coordinate-based dimension mapping
 * - Multi-format support (AutoCAD, Revit, SketchUp exports)
 */

import pdf from 'pdf-parse'
import * as fs from 'fs/promises'
import { parseDimensionString, parseScale, type DimensionPair } from './unit-converter'

export interface ExtractedDimension {
  // Raw extracted data
  rawText: string // "90cm × 210cm" or "36\" × 84\""

  // Parsed dimensions
  dimensions: DimensionPair | null

  // Location in document
  page?: number
  approximateX?: number
  approximateY?: number

  // Context clues
  nearbyText?: string[] // Text found nearby (room names, door marks, etc.)
  annotationType?: 'dimension_line' | 'text_annotation' | 'table_cell'

  // Confidence
  confidence: number // 0-1 score based on extraction method
}

export interface DoorAnnotation {
  // Door identification
  mark?: string // "P-1-F1", "Door-1-F2", "D-101"
  doorType?: string // Extracted from annotations

  // Dimensions
  width?: DimensionPair
  height?: DimensionPair

  // Location context
  floor?: string // "F1", "F2", "Planta Baja"
  area?: string // "Cocina", "Habitación 1", extracted from nearby text

  // Metadata
  page: number
  confidence: number
}

export interface BlueprintMetadata {
  // Document info
  totalPages: number
  createdWith?: string // "AutoCAD", "Revit", "SketchUp"

  // Scale information
  drawingScale?: string // "1:100", "1/4\" = 1'"
  scaleRatio?: number

  // Project info (if available)
  projectName?: string
  projectNumber?: string
  architect?: string
  date?: string

  // Units detected
  primaryUnit?: 'metric' | 'imperial'
  unitSystem?: string // "cm", "mm", "inches", "feet"
}

/**
 * Main dimension extractor class
 */
export class DimensionExtractor {
  /**
   * Extract all metadata from a blueprint PDF
   */
  async extractMetadata(pdfPath: string): Promise<BlueprintMetadata> {
    const dataBuffer = await fs.readFile(pdfPath)
    const pdfData = await pdf(dataBuffer)

    const metadata: BlueprintMetadata = {
      totalPages: pdfData.numpages
    }

    // Extract text for analysis
    const text = pdfData.text

    // Detect CAD software
    metadata.createdWith = this.detectCADSoftware(text, pdfData.info)

    // Extract scale notation
    const scaleInfo = this.extractScale(text)
    if (scaleInfo) {
      metadata.drawingScale = scaleInfo.scaleNotation
      metadata.scaleRatio = scaleInfo.ratio
    }

    // Detect unit system
    metadata.primaryUnit = this.detectUnitSystem(text)

    // Extract project information
    const projectInfo = this.extractProjectInfo(text)
    Object.assign(metadata, projectInfo)

    return metadata
  }

  /**
   * Extract all dimensions from a PDF page
   */
  async extractDimensions(pdfPath: string, page?: number): Promise<ExtractedDimension[]> {
    const dataBuffer = await fs.readFile(pdfPath)
    const pdfData = await pdf(dataBuffer)

    const extractedText = pdfData.text
    const dimensions: ExtractedDimension[] = []

    // Strategy 1: Parse dimension annotations from text
    const dimensionPatterns = [
      // Metric patterns
      /(\d+(?:\.\d+)?)\s*(mm|cm|m)\s*[×x]\s*(\d+(?:\.\d+)?)\s*(mm|cm|m)/gi,

      // Imperial patterns with fractions
      /(\d+(?:\s*\d+\/\d+)?)\s*["']\s*[×x]\s*(\d+(?:\s*\d+\/\d+)?)\s*["']/gi,

      // AutoCAD dimension format (with parentheses)
      /\((\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\)/gi,

      // Simple numeric dimensions
      /(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)/gi
    ]

    for (const pattern of dimensionPatterns) {
      let match
      while ((match = pattern.exec(extractedText)) !== null) {
        const rawText = match[0]
        const dimensions_parsed = parseDimensionString(rawText)

        if (dimensions_parsed) {
          dimensions.push({
            rawText,
            dimensions: dimensions_parsed,
            confidence: this.calculateConfidence(rawText, 'text_extraction'),
            annotationType: 'text_annotation'
          })
        }
      }
    }

    // Strategy 2: Extract from dimension tables (common in architectural plans)
    const tableDimensions = this.extractFromTables(extractedText)
    dimensions.push(...tableDimensions)

    return dimensions
  }

  /**
   * Extract door annotations with dimensions and locations
   */
  async extractDoorAnnotations(pdfPath: string): Promise<DoorAnnotation[]> {
    const dataBuffer = await fs.readFile(pdfPath)
    const pdfData = await pdf(dataBuffer)
    const text = pdfData.text

    const doorAnnotations: DoorAnnotation[] = []

    // Common door mark patterns in Spanish/English
    const doorMarkPatterns = [
      /P-(\d+)-F(\d+)/gi, // P-1-F1 (Puerta 1, Floor 1)
      /DOOR-(\d+)-F(\d+)/gi, // Door-1-F2
      /D-(\d+)/gi, // D-101
      /PUERTA\s*(\d+)/gi, // PUERTA 1
      /PT-(\d+)/gi // PT-1
    ]

    // Extract door marks with context
    const lines = text.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      for (const pattern of doorMarkPatterns) {
        const match = pattern.exec(line)

        if (match) {
          const mark = match[0]

          // Look for dimensions in the same line or nearby lines
          const contextLines = [
            lines[i - 1] || '',
            line,
            lines[i + 1] || '',
            lines[i + 2] || ''
          ].join(' ')

          // Try to extract dimensions from context
          const dimensionMatch = parseDimensionString(contextLines)

          // Extract floor if in mark (P-1-F2 → F2)
          let floor: string | undefined
          const floorMatch = mark.match(/F(\d+)/i)
          if (floorMatch) {
            floor = `F${floorMatch[1]}`
          }

          // Try to extract door type from context
          let doorType: string | undefined
          if (contextLines.match(/exterior|entrance|entrada/i)) {
            doorType = 'EXTERIOR_SINGLE'
          } else if (contextLines.match(/interior/i)) {
            doorType = 'INTERIOR_SINGLE'
          } else if (contextLines.match(/fire|fuego|cortafuego/i)) {
            doorType = 'FIRE_RATED_60MIN'
          } else if (contextLines.match(/sliding|corredera/i)) {
            doorType = 'SLIDING'
          }

          doorAnnotations.push({
            mark,
            floor,
            doorType,
            width: dimensionMatch || undefined,
            confidence: 0.7,
            page: 1 // Simplified for now
          })
        }
      }
    }

    return doorAnnotations
  }

  /**
   * Extract dimensions from table format (common in door schedules)
   * Example:
   * | Mark  | Type     | Width  | Height | Qty |
   * | P-1-F1| Interior | 90cm   | 210cm  | 1   |
   */
  private extractFromTables(text: string): ExtractedDimension[] {
    const dimensions: ExtractedDimension[] = []
    const lines = text.split('\n')

    // Detect table headers
    const headerPatterns = /mark|type|width|height|ancho|alto|puerta|door/i

    let inTable = false
    let headerLine = -1

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Detect table start
      if (!inTable && headerPatterns.test(line)) {
        inTable = true
        headerLine = i
        continue
      }

      // Detect table end (empty line or non-table content)
      if (inTable && (!line.trim() || !/[\d×x]/.test(line))) {
        inTable = false
        continue
      }

      // Extract dimensions from table rows
      if (inTable && i > headerLine) {
        const cells = line.split(/\s{2,}|\||,/) // Split by whitespace, pipes, or commas

        for (const cell of cells) {
          const dimensionParsed = parseDimensionString(cell.trim())

          if (dimensionParsed) {
            dimensions.push({
              rawText: cell.trim(),
              dimensions: dimensionParsed,
              confidence: 0.9, // High confidence for table data
              annotationType: 'table_cell'
            })
          }
        }
      }
    }

    return dimensions
  }

  /**
   * Detect which CAD software created the PDF
   */
  private detectCADSoftware(text: string, pdfInfo: any): string | undefined {
    // Check PDF metadata
    if (pdfInfo?.Creator) {
      if (/autocad/i.test(pdfInfo.Creator)) return 'AutoCAD'
      if (/revit/i.test(pdfInfo.Creator)) return 'Revit'
      if (/sketchup/i.test(pdfInfo.Creator)) return 'SketchUp'
      if (/archicad/i.test(pdfInfo.Creator)) return 'ArchiCAD'
    }

    // Check text content for software signatures
    if (/autocad/i.test(text)) return 'AutoCAD'
    if (/revit/i.test(text)) return 'Revit'
    if (/sketchup/i.test(text)) return 'SketchUp'

    return undefined
  }

  /**
   * Extract scale notation from drawing
   */
  private extractScale(text: string): { scaleNotation: string; ratio: number } | null {
    const scalePatterns = [
      /SCALE[:\s]+1:(\d+)/i, // "SCALE: 1:100"
      /ESCALA[:\s]+1:(\d+)/i, // "ESCALA: 1:100"
      /1:(\d+)/g, // "1:100"
      /(\d+\/\d+)"\s*=\s*1'/i // "1/4\" = 1'"
    ]

    for (const pattern of scalePatterns) {
      const match = pattern.exec(text)
      if (match) {
        const scaleNotation = match[0]
        const ratio = parseScale(scaleNotation)

        if (ratio) {
          return { scaleNotation, ratio }
        }
      }
    }

    return null
  }

  /**
   * Detect primary unit system
   */
  private detectUnitSystem(text: string): 'metric' | 'imperial' {
    // Count metric vs imperial units
    const metricCount = (text.match(/\d+\s*(mm|cm|m)\b/gi) || []).length
    const imperialCount = (text.match(/\d+\s*["']/g) || []).length

    return metricCount > imperialCount ? 'metric' : 'imperial'
  }

  /**
   * Extract project information from title block
   */
  private extractProjectInfo(text: string): Partial<BlueprintMetadata> {
    const info: Partial<BlueprintMetadata> = {}

    // Project name patterns
    const projectNameMatch = text.match(/PROJECT[:\s]+([^\n]+)/i) ||
                             text.match(/PROYECTO[:\s]+([^\n]+)/i)
    if (projectNameMatch) {
      info.projectName = projectNameMatch[1].trim()
    }

    // Project number
    const projectNumberMatch = text.match(/PROJECT\s*#[:\s]+([A-Z0-9-]+)/i) ||
                               text.match(/PROYECTO\s*#[:\s]+([A-Z0-9-]+)/i)
    if (projectNumberMatch) {
      info.projectNumber = projectNumberMatch[1].trim()
    }

    // Architect
    const architectMatch = text.match(/ARCHITECT[:\s]+([^\n]+)/i) ||
                          text.match(/ARQUITECTO[:\s]+([^\n]+)/i)
    if (architectMatch) {
      info.architect = architectMatch[1].trim()
    }

    // Date
    const dateMatch = text.match(/DATE[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i) ||
                     text.match(/FECHA[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i)
    if (dateMatch) {
      info.date = dateMatch[1]
    }

    return info
  }

  /**
   * Calculate confidence score for extracted dimension
   */
  private calculateConfidence(rawText: string, method: string): number {
    let confidence = 0.5 // Base confidence

    // Boost for clear unit notation
    if (/\d+\s*(mm|cm|m|"|')/.test(rawText)) {
      confidence += 0.2
    }

    // Boost for explicit dimension symbols
    if (/×/.test(rawText)) {
      confidence += 0.15
    }

    // Boost for table extraction (more structured)
    if (method === 'table_extraction') {
      confidence += 0.2
    }

    // Cap at 1.0
    return Math.min(confidence, 1.0)
  }
}

/**
 * Helper function to batch extract from multiple PDFs
 */
export async function extractDimensionsFromMultiplePDFs(
  pdfPaths: string[]
): Promise<Map<string, ExtractedDimension[]>> {
  const extractor = new DimensionExtractor()
  const results = new Map<string, ExtractedDimension[]>()

  for (const pdfPath of pdfPaths) {
    const dimensions = await extractor.extractDimensions(pdfPath)
    results.set(pdfPath, dimensions)
  }

  return results
}

/**
 * Helper to extract door schedule from PDF
 */
export async function extractDoorSchedule(pdfPath: string): Promise<DoorAnnotation[]> {
  const extractor = new DimensionExtractor()
  return await extractor.extractDoorAnnotations(pdfPath)
}

/**
 * Helper to validate extracted dimensions against tolerances
 */
export function validateDimensions(
  extracted: ExtractedDimension[],
  minimumConfidence: number = 0.6
): ExtractedDimension[] {
  return extracted.filter(dim => dim.confidence >= minimumConfidence)
}
