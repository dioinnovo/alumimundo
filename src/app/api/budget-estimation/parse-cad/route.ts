import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { existsSync } from 'fs'

const execAsync = promisify(exec)

export interface CADParseResult {
  metadata: {
    filename: string
    units: string
    scale?: number
    createdWith: string
    layers: string[]
    blocks: string[]
  }
  doors: Array<{
    mark?: string
    doorType?: string
    floor?: string
    area?: string
    fullLocation: string
    width?: string
    height?: string
    drawingX?: number
    drawingY?: number
    rotation?: number
    layer?: string
    blockName?: string
    confidence: number
  }>
  totalDoors: number
}

/**
 * Parse CAD (DXF) files using Python ezdxf library
 *
 * POST /api/budget-estimation/parse-cad
 * Body: { filePath: string }
 *
 * Returns: CADParseResult
 */
export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Verify file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Verify file is DXF (or convert DWG to DXF if needed)
    if (!filePath.toLowerCase().endsWith('.dxf')) {
      return NextResponse.json(
        { error: 'Only DXF files are supported. Please convert DWG to DXF first.' },
        { status: 400 }
      )
    }

    // Path to Python CAD parser script
    const parserScript = join(process.cwd(), 'src', 'lib', 'blueprint-parser', 'cad-parser.py')

    if (!existsSync(parserScript)) {
      return NextResponse.json(
        { error: 'CAD parser script not found' },
        { status: 500 }
      )
    }

    // Execute Python parser
    console.log(`Parsing CAD file: ${filePath}`)

    const { stdout, stderr } = await execAsync(
      `python3 "${parserScript}" "${filePath}" --output json`,
      {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
        timeout: 60000 // 60 second timeout
      }
    )

    if (stderr) {
      console.warn('CAD parser warnings:', stderr)
    }

    // Parse JSON output
    const result: CADParseResult = JSON.parse(stdout)

    console.log(`Successfully parsed CAD file: ${result.totalDoors} doors detected`)

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Error parsing CAD file:', error)

    // Check if it's a Python/ezdxf installation issue
    if (error instanceof Error && error.message.includes('ezdxf not installed')) {
      return NextResponse.json(
        {
          error: 'CAD parser not properly configured',
          details: 'Python ezdxf library not installed. Run: pip install ezdxf',
          installInstructions: [
            '1. Install Python 3.8+',
            '2. Run: pip install ezdxf',
            '3. Restart the server'
          ]
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to parse CAD file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Health check endpoint to verify CAD parser is working
 *
 * GET /api/budget-estimation/parse-cad
 */
export async function GET() {
  try {
    const parserScript = join(process.cwd(), 'src', 'lib', 'blueprint-parser', 'cad-parser.py')

    if (!existsSync(parserScript)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'CAD parser script not found'
        },
        { status: 500 }
      )
    }

    // Test Python availability
    const { stdout } = await execAsync('python3 --version')

    // Test ezdxf availability
    try {
      await execAsync('python3 -c "import ezdxf; print(ezdxf.__version__)"')

      return NextResponse.json({
        status: 'ok',
        pythonVersion: stdout.trim(),
        parserAvailable: true,
        message: 'CAD parser ready'
      })
    } catch (ezdxfError) {
      return NextResponse.json(
        {
          status: 'warning',
          pythonVersion: stdout.trim(),
          parserAvailable: false,
          message: 'Python installed but ezdxf library missing',
          installCommand: 'pip install ezdxf'
        },
        { status: 200 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Python not installed or not available',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
