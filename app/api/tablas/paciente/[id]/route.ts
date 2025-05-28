import { NextRequest, NextResponse } from 'next/server'
import { PacienteService } from '@/services/paciente.service'

const pacienteService = new PacienteService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const paciente = await pacienteService.findOne(id)

    if (!paciente) {
      return NextResponse.json(
        { error: `No se encontró el paciente con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(paciente)
  } catch (error) {
    console.error(`Error en GET /api/tablas/paciente/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener el paciente' },
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

    // Verificar que el paciente existe
    const existingPaciente = await pacienteService.findOne(id)
    if (!existingPaciente) {
      return NextResponse.json(
        { error: `No se encontró el paciente con ID: ${id}` },
        { status: 404 }
      )
    }

    // Formatear la fecha de nacimiento si existe
    if (data.FECHA_NACIMIENTO) {
      data.FECHA_NACIMIENTO = new Date(data.FECHA_NACIMIENTO)
    }

    const updatedPaciente = await pacienteService.update(id, data)
    return NextResponse.json(updatedPaciente)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/paciente/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el paciente' },
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

    // Verificar que el paciente existe
    const existingPaciente = await pacienteService.findOne(id)
    if (!existingPaciente) {
      return NextResponse.json(
        { error: `No se encontró el paciente con ID: ${id}` },
        { status: 404 }
      )
    }

    await pacienteService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/paciente/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar el paciente' },
      { status: 500 }
    )
  }
}
