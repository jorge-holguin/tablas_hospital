import { NextRequest, NextResponse } from 'next/server'
import { EntidadService } from '@/services/entidad.service'
import { Prisma } from '@prisma/client'

const entidadService = new EntidadService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const Entidad = await entidadService.findOne(id)
    
    if (!Entidad) {
      return NextResponse.json(
        { error: 'Entidad no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(Entidad)
  } catch (error) {
    console.error('Error fetching Entidad:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await req.json()
    
    // Convertir ACTIVO a Decimal si es necesario
    if (data.ACTIVO !== undefined) {
      data.ACTIVO = new Prisma.Decimal(data.ACTIVO)
    }
    
    const Entidad = await entidadService.update(id, data)
    return NextResponse.json(Entidad)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Entidad no encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    await entidadService.delete(id)
    return NextResponse.json({ message: 'Entidad eliminada correctamente' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Entidad no encontrada' },
          { status: 404 }
        )
      }
      // Error de restricción de clave foránea
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'No se puede eliminar esta Entidad porque está siendo utilizada en otras partes del sistema' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
