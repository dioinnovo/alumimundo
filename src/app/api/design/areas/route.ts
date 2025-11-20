import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/design/areas - Create a new area for a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, areaType, areaName } = body

    if (!projectId || !areaType || !areaName) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, areaType, areaName' },
        { status: 400 }
      )
    }

    const area = await prisma.designArea.create({
      data: {
        projectId,
        areaType,
        areaName,
        status: 'NOT_STARTED'
      }
    })

    return NextResponse.json({ area }, { status: 201 })
  } catch (error) {
    console.error('Error creating area:', error)
    return NextResponse.json(
      { error: 'Failed to create area' },
      { status: 500 }
    )
  }
}
