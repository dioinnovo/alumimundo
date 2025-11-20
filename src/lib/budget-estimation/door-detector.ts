/**
 * Door Detection Library
 * Uses GPT-4 Vision to analyze architectural drawings and detect doors
 *
 * Key Features:
 * - Detect door symbols in PDF/AutoCAD drawings
 * - Identify door types (interior, exterior, fire-rated, etc.)
 * - Extract location information (floor, area, mark)
 * - Generate confidence scores for AI detections
 */

import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'
import * as fs from 'fs/promises'
import * as path from 'path'
import pdf from 'pdf-parse'

export interface DetectedDoor {
  // Location
  floor: string // "F1", "F2", "Planta Baja"
  area: string // "Habitación 1", "Cocina", "Entrance"
  mark: string // "P-1-F1", "Door-1-F2", "D-101"
  fullLocation: string // "F2 - Habitación Principal - P-1-F2"

  // Door Type
  doorType: string // INTERIOR_SINGLE, EXTERIOR_SINGLE, etc.

  // Drawing Metadata
  drawingPage?: number
  drawingX?: number
  drawingY?: number

  // AI Confidence
  confidence: number // 0-1 score

  // Additional Info
  notes?: string
  width?: string
  height?: string
}

export interface HardwareRequirement {
  itemType: string // HINGE, LOCK, DEADBOLT, etc.
  quantity: number
  productName: string
  productSku?: string
  brand?: string
  specifications?: string
}

export interface DoorAnalysisResult {
  doors: DetectedDoor[]
  totalDoors: number
  averageConfidence: number
  errors?: string[]
}

/**
 * Main door detector using GPT-4 Vision
 */
export class DoorDetector {
  private model: ChatOpenAI

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4o', // GPT-4 with vision capabilities
      temperature: 0.1, // Low temperature for consistent results
      maxTokens: 4000
    })
  }

  /**
   * Analyze a PDF architectural drawing to detect doors
   */
  async analyzePDF(pdfPath: string): Promise<DoorAnalysisResult> {
    try {
      // Read PDF file
      const dataBuffer = await fs.readFile(pdfPath)

      // Parse PDF to extract text and page count
      const pdfData = await pdf(dataBuffer)
      const pageCount = pdfData.numpages
      const extractedText = pdfData.text

      console.log(`Analyzing PDF: ${pageCount} pages, ${extractedText.length} chars of text`)

      // Convert PDF to base64 for vision analysis
      const base64PDF = dataBuffer.toString('base64')

      // Create prompt for GPT-4 Vision
      const prompt = this.createDoorDetectionPrompt(extractedText)

      // Call GPT-4 Vision with the PDF
      const message = new HumanMessage({
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:application/pdf;base64,${base64PDF}`,
              detail: 'high' // High detail for better door detection
            }
          }
        ]
      })

      const response = await this.model.invoke([message])

      // Parse the response
      const doors = this.parseGPTResponse(response.content as string)

      // Calculate statistics
      const totalDoors = doors.length
      const averageConfidence = doors.length > 0
        ? doors.reduce((sum, d) => sum + d.confidence, 0) / doors.length
        : 0

      return {
        doors,
        totalDoors,
        averageConfidence
      }
    } catch (error) {
      console.error('Error analyzing PDF:', error)
      return {
        doors: [],
        totalDoors: 0,
        averageConfidence: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Create a detailed prompt for door detection
   */
  private createDoorDetectionPrompt(extractedText: string): string {
    return `You are an expert architectural plan analyzer for Alumimundo, Costa Rica's leading construction finishes distributor.

Analyze this architectural drawing (PDF/AutoCAD layout) and detect ALL doors shown in the plans.

**Context from extracted text:**
${extractedText.substring(0, 2000)}

**Instructions:**
1. Identify EVERY door symbol in the drawing (standard door symbols like arcs, rectangles with swings, etc.)
2. For EACH door detected, provide:
   - Floor: Which floor/level (F1, F2, Planta Baja, etc.) - extract from drawing labels
   - Area: Room/space name (Cocina, Habitación 1, Baño, Entrance, etc.)
   - Mark: Door identification mark (P-1-F1, Door-1-F2, D-101, etc.) - CREATE if not shown
   - Door Type: Classify as one of:
     * INTERIOR_SINGLE (single interior door)
     * INTERIOR_DOUBLE (double interior doors)
     * EXTERIOR_SINGLE (single exterior/entrance door)
     * EXTERIOR_DOUBLE (double exterior doors)
     * SLIDING (sliding door)
     * BIFOLD (bifold/folding door)
     * FIRE_RATED_60MIN, FIRE_RATED_90MIN, FIRE_RATED_120MIN (if marked as fire-rated)
     * GLASS, ALUMINUM, WOOD (if material is specified)
   - Width & Height: If dimensions are visible (e.g., "0.90m x 2.10m")
   - Confidence: Your confidence level (0.0 to 1.0) in this detection
   - Notes: Any special observations (e.g., "marked as acoustic door", "double swing", etc.)

3. Create systematic door marks if not shown:
   - Format: P-{sequential}-{floor} (e.g., P-1-F1, P-2-F1, P-1-F2)
   - Or use existing marks from drawing if present

**Output Format (JSON):**
Return ONLY a valid JSON array, no other text. Example:

[
  {
    "floor": "F1",
    "area": "Cocina Principal",
    "mark": "P-1-F1",
    "fullLocation": "F1 - Cocina Principal - P-1-F1",
    "doorType": "INTERIOR_SINGLE",
    "width": "0.80m",
    "height": "2.10m",
    "confidence": 0.95,
    "drawingPage": 1,
    "notes": "Standard interior door"
  },
  {
    "floor": "F1",
    "area": "Entrada Principal",
    "mark": "P-2-F1",
    "fullLocation": "F1 - Entrada Principal - P-2-F1",
    "doorType": "EXTERIOR_DOUBLE",
    "width": "1.80m",
    "height": "2.40m",
    "confidence": 0.98,
    "drawingPage": 1,
    "notes": "Main entrance, appears to be glass/aluminum"
  }
]

**Important:**
- Be thorough - detect ALL doors, even small ones
- If text is in Spanish, preserve Spanish labels
- If floor/area labels are unclear, use reasonable assumptions (F1, F2, etc.)
- Confidence < 0.7 means uncertain detection (flag for manual review)

Return ONLY the JSON array, nothing else.`
  }

  /**
   * Parse GPT-4 Vision response into structured door data
   */
  private parseGPTResponse(responseText: string): DetectedDoor[] {
    try {
      // Extract JSON from response (GPT sometimes adds markdown code blocks)
      let jsonText = responseText.trim()

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '')
      }

      // Parse JSON
      const doors = JSON.parse(jsonText) as DetectedDoor[]

      // Validate and normalize data
      return doors.map((door) => ({
        ...door,
        fullLocation: door.fullLocation || `${door.floor} - ${door.area} - ${door.mark}`,
        confidence: Math.max(0, Math.min(1, door.confidence)) // Clamp 0-1
      }))
    } catch (error) {
      console.error('Error parsing GPT response:', error)
      console.error('Response text:', responseText)
      return []
    }
  }

  /**
   * Calculate required hardware for a door type
   * Based on Alumimundo's product catalog and Costa Rican building codes
   */
  static calculateHardware(doorType: string): HardwareRequirement[] {
    const hardware: HardwareRequirement[] = []

    switch (doorType) {
      case 'INTERIOR_SINGLE':
        hardware.push(
          { itemType: 'HINGE', quantity: 3, productName: 'Bisagra Estándar 3.5"' },
          { itemType: 'KNOB', quantity: 1, productName: 'Pomo Interior' },
          { itemType: 'DOOR_STOP', quantity: 1, productName: 'Tope de Puerta' }
        )
        break

      case 'INTERIOR_DOUBLE':
        hardware.push(
          { itemType: 'HINGE', quantity: 6, productName: 'Bisagra Estándar 3.5"' },
          { itemType: 'KNOB', quantity: 2, productName: 'Pomo Interior' },
          { itemType: 'ASTRAGAL', quantity: 1, productName: 'Astragal para Puerta Doble' },
          { itemType: 'DOOR_STOP', quantity: 2, productName: 'Tope de Puerta' }
        )
        break

      case 'EXTERIOR_SINGLE':
        hardware.push(
          { itemType: 'HINGE', quantity: 3, productName: 'Bisagra Exterior Reforzada 4"', brand: 'Schlage' },
          { itemType: 'DEADBOLT', quantity: 1, productName: 'Cerrojo de Alta Seguridad', brand: 'Schlage' },
          { itemType: 'LEVER', quantity: 1, productName: 'Manija Exterior', brand: 'Schlage' },
          { itemType: 'THRESHOLD', quantity: 1, productName: 'Umbral de Aluminio' },
          { itemType: 'WEATHERSTRIP', quantity: 1, productName: 'Burlete Completo' },
          { itemType: 'DOOR_STOP', quantity: 1, productName: 'Tope de Puerta' }
        )
        break

      case 'EXTERIOR_DOUBLE':
        hardware.push(
          { itemType: 'HINGE', quantity: 6, productName: 'Bisagra Exterior Reforzada 4"', brand: 'Schlage' },
          { itemType: 'DEADBOLT', quantity: 2, productName: 'Cerrojo de Alta Seguridad', brand: 'Schlage' },
          { itemType: 'LEVER', quantity: 2, productName: 'Manija Exterior', brand: 'Schlage' },
          { itemType: 'ASTRAGAL', quantity: 1, productName: 'Astragal Exterior con Sello' },
          { itemType: 'THRESHOLD', quantity: 1, productName: 'Umbral de Aluminio' },
          { itemType: 'WEATHERSTRIP', quantity: 2, productName: 'Burlete Completo' },
          { itemType: 'DOOR_STOP', quantity: 2, productName: 'Tope de Puerta' }
        )
        break

      case 'FIRE_RATED_60MIN':
      case 'FIRE_RATED_90MIN':
      case 'FIRE_RATED_120MIN':
        hardware.push(
          { itemType: 'HINGE', quantity: 3, productName: 'Bisagra Cortafuego Certificada', brand: 'Steelcraft' },
          { itemType: 'LOCK', quantity: 1, productName: 'Cerradura Cortafuego', brand: 'Schlage' },
          { itemType: 'CLOSER', quantity: 1, productName: 'Cierra-puertas Hidráulico' },
          { itemType: 'PANIC_BAR', quantity: 1, productName: 'Barra Anti-pánico', brand: 'Schlage' },
          { itemType: 'THRESHOLD', quantity: 1, productName: 'Umbral Intumescente' },
          { itemType: 'WEATHERSTRIP', quantity: 1, productName: 'Sello Intumescente' }
        )
        break

      case 'SLIDING':
        hardware.push(
          { itemType: 'HANDLE', quantity: 2, productName: 'Manija para Corredera' },
          { itemType: 'LOCK', quantity: 1, productName: 'Cerradura para Corredera' },
          { itemType: 'OTHER', quantity: 1, productName: 'Riel y Rodamientos', specifications: 'Sistema completo de corredera' }
        )
        break

      default:
        // Generic hardware for unknown types
        hardware.push(
          { itemType: 'HINGE', quantity: 3, productName: 'Bisagra Estándar' },
          { itemType: 'LOCK', quantity: 1, productName: 'Cerradura Estándar' },
          { itemType: 'DOOR_STOP', quantity: 1, productName: 'Tope de Puerta' }
        )
    }

    return hardware
  }
}

/**
 * Helper function to batch process multiple PDFs
 */
export async function analyzeMultiplePDFs(pdfPaths: string[]): Promise<Map<string, DoorAnalysisResult>> {
  const detector = new DoorDetector()
  const results = new Map<string, DoorAnalysisResult>()

  for (const pdfPath of pdfPaths) {
    const filename = path.basename(pdfPath)
    console.log(`Analyzing ${filename}...`)

    const result = await detector.analyzePDF(pdfPath)
    results.set(filename, result)
  }

  return results
}
