import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/design/projects - List all projects for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const projects = await prisma.designProject.findMany({
      where: { userId },
      include: {
        areas: {
          include: {
            images: true,
            specifications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate summary stats for each project
    const projectsWithStats = projects.map(project => ({
      ...project,
      totalAreas: project.areas.length,
      completedAreas: project.areas.filter(a => a.status === 'SPECIFICATION_COMPLETE' || a.status === 'APPROVED').length,
      totalImages: project.areas.reduce((sum, a) => sum + a.images.length, 0),
      totalProducts: project.areas.reduce((sum, a) => sum + a.specifications.length, 0)
    }))

    return NextResponse.json({ projects: projectsWithStats })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/design/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, propertyType, location, budgetRange } = body

    if (!userId || !name || !propertyType || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, propertyType, location' },
        { status: 400 }
      )
    }

    const project = await prisma.designProject.create({
      data: {
        userId,
        name,
        propertyType,
        location,
        budgetRange: budgetRange || null,
        status: 'DRAFT',
        currency: 'CRC'
      }
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
