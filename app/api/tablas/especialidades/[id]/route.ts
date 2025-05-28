import { NextRequest, NextResponse } from 'next/server'
import { EspecialidadService } from '@/services/especialidad.service'
import { Prisma } from '@prisma/client'

const especialidadService = new EspecialidadService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const especialidad = await especialidadService.findOne(id)
    
    if (!especialidad) {
      return NextResponse.json(
        { error: 'Especialidad no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(especialidad)
  } catch (error) {
    console.error('Error fetching especialidad:', error instanceof Error ? error.message : 'Unknown error')
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
    
    const especialidad = await especialidadService.update(id, data)
    return NextResponse.json(especialidad)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Especialidad no encontrada' },
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
    await especialidadService.delete(id)
    return NextResponse.json({ message: 'Especialidad eliminada correctamente' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Especialidad no encontrada' },
          { status: 404 }
        )
      }
      // Error de restricción de clave foránea
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'No se puede eliminar esta especialidad porque está siendo utilizada en otras partes del sistema' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
