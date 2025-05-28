import { NextRequest, NextResponse } from 'next/server'
import { ClasificadorService } from '@/services/clasificador.service'

const clasificadorService = new ClasificadorService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const clasificador = await clasificadorService.findOne(id)

    if (!clasificador) {
      return NextResponse.json(
        { error: `No se encontró el clasificador con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(clasificador)
  } catch (error) {
    console.error(`Error en GET /api/tablas/clasificador/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener el clasificador' },
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

    // Verificar que el clasificador existe
    const existingClasificador = await clasificadorService.findOne(id)
    if (!existingClasificador) {
      return NextResponse.json(
        { error: `No se encontró el clasificador con ID: ${id}` },
        { status: 404 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    if (data.ACTIVO !== undefined) data.ACTIVO = Number(data.ACTIVO)

    const updatedClasificador = await clasificadorService.update(id, data)
    return NextResponse.json(updatedClasificador)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/clasificador/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el clasificador' },
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

    // Verificar que el clasificador existe
    const existingClasificador = await clasificadorService.findOne(id)
    if (!existingClasificador) {
      return NextResponse.json(
        { error: `No se encontró el clasificador con ID: ${id}` },
        { status: 404 }
      )
    }

    await clasificadorService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/clasificador/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar el clasificador' },
      { status: 500 }
    )
  }
}
