import { NextRequest, NextResponse } from 'next/server'
import { PresentacionService } from '@/services/presentacion.service'
import { Prisma } from '@prisma/client'

const presentacionService = new PresentacionService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const presentacion = await presentacionService.findOne(id)

    if (!presentacion) {
      return NextResponse.json(
        { error: 'Presentación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(presentacion)
  } catch (error) {
    console.error('Error fetching presentacion:', error)
    return NextResponse.json(
      { error: 'Error al obtener la presentación' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    // Verificar si la presentación existe
    const existingPresentacion = await presentacionService.findOne(id)
    if (!existingPresentacion) {
      return NextResponse.json(
        { error: 'Presentación no encontrada' },
        { status: 404 }
      )
    }

    // Convertir ACTIVO a Decimal si es necesario
    if (body.ACTIVO !== undefined) {
      body.ACTIVO = new Prisma.Decimal(body.ACTIVO)
    }

    const updatedPresentacion = await presentacionService.update(id, body)
    
    return NextResponse.json(updatedPresentacion)
  } catch (error) {
    console.error('Error updating presentacion:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la presentación' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Verificar si la presentación existe
    const existingPresentacion = await presentacionService.findOne(id)
    if (!existingPresentacion) {
      return NextResponse.json(
        { error: 'Presentación no encontrada' },
        { status: 404 }
      )
    }

    await presentacionService.delete(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting presentacion:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la presentación' },
      { status: 500 }
    )
  }
}
