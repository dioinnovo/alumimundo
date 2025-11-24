import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/design/projects/[projectId] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const project = await prisma.designProject.findUnique({
      where: { id: projectId },
      include: {
        areas: {
          include: {
            images: true,
            specifications: true
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH /api/design/projects/[projectId] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { name, status, totalEstimate, budgetRange } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (status !== undefined) updateData.status = status
    if (totalEstimate !== undefined) updateData.totalEstimate = totalEstimate
    if (budgetRange !== undefined) updateData.budgetRange = budgetRange

    const project = await prisma.designProject.update({
      where: { id: projectId },
      data: updateData
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/design/projects/[projectId] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    await prisma.designProject.delete({
      where: { id: projectId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
