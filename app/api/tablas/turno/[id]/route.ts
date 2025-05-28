import { NextRequest, NextResponse } from 'next/server'
import { TurnoService } from '@/services/turno.service'

const turnoService = new TurnoService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const turno = await turnoService.findOne(id)

    if (!turno) {
      return NextResponse.json(
        { error: `No se encontró el turno con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(turno)
  } catch (error) {
    console.error(`Error en GET /api/tablas/turno/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener el turno' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await req.json()

    // Verificar que el turno existe
    const existingTurno = await turnoService.findOne(id)
    if (!existingTurno) {
      return NextResponse.json(
        { error: `No se encontró el turno con ID: ${id}` },
        { status: 404 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    if (data.ACTIVO !== undefined) data.ACTIVO = Number(data.ACTIVO)

    const updatedTurno = await turnoService.update(id, data)
    return NextResponse.json(updatedTurno)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/turno/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el turno' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Verificar que el turno existe
    const existingTurno = await turnoService.findOne(id)
    if (!existingTurno) {
      return NextResponse.json(
        { error: `No se encontró el turno con ID: ${id}` },
        { status: 404 }
      )
    }

    await turnoService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/turno/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar el turno' },
      { status: 500 }
    )
  }
}
