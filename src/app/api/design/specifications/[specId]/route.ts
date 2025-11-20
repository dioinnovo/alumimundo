import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/design/specifications/[specId] - Update a specification
export async function PATCH(
  request: NextRequest,
  { params }: { params: { specId: string } }
) {
  try {
    const body = await request.json()
    const { quantity, unitPrice, totalPrice } = body

    const updateData: any = {}
    if (quantity !== undefined) {
      updateData.quantity = quantity
      // Recalculate total if quantity changes
      if (unitPrice !== undefined) {
        updateData.unitPrice = unitPrice
        updateData.totalPrice = quantity * unitPrice
      } else {
        // Get current unit price to recalculate
        const current = await prisma.areaSpecification.findUnique({
          where: { id: params.specId }
        })
        if (current) {
          updateData.totalPrice = quantity * current.unitPrice
        }
      }
    } else if (unitPrice !== undefined) {
      updateData.unitPrice = unitPrice
      // Get current quantity to recalculate
      const current = await prisma.areaSpecification.findUnique({
        where: { id: params.specId }
      })
      if (current) {
        updateData.totalPrice = current.quantity * unitPrice
      }
    }

    if (totalPrice !== undefined) {
      updateData.totalPrice = totalPrice
    }

    const specification = await prisma.areaSpecification.update({
      where: { id: params.specId },
      data: updateData
    })

    return NextResponse.json({ specification })
  } catch (error) {
    console.error('Error updating specification:', error)
    return NextResponse.json(
      { error: 'Failed to update specification' },
      { status: 500 }
    )
  }
}

// DELETE /api/design/specifications/[specId] - Delete a specification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { specId: string } }
) {
  try {
    await prisma.areaSpecification.delete({
      where: { id: params.specId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting specification:', error)
    return NextResponse.json(
      { error: 'Failed to delete specification' },
      { status: 500 }
    )
  }
}
