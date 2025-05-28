import { NextRequest, NextResponse } from 'next/server'
import { RecetaService } from '@/services/receta.service'

const recetaService = new RecetaService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de receta inválido' },
        { status: 400 }
      )
    }

    const receta = await recetaService.findOne(id)

    if (!receta) {
      return NextResponse.json(
        { error: `No se encontró la receta con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(receta)
  } catch (error) {
    console.error(`Error en GET /api/farmacia/recetas/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener la receta' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de receta inválido' },
        { status: 400 }
      )
    }

    const data = await req.json()

    // Verificar que la receta existe
    const existingReceta = await recetaService.findOne(id)
    if (!existingReceta) {
      return NextResponse.json(
        { error: `No se encontró la receta con ID: ${id}` },
        { status: 404 }
      )
    }

    // Actualizar la fecha de actualización
    if (!data.FECHA_UPDATE) {
      data.FECHA_UPDATE = new Date()
    }

    const updatedReceta = await recetaService.update(id, data)
    return NextResponse.json(updatedReceta)
  } catch (error) {
    console.error(`Error en PUT /api/farmacia/recetas/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar la receta' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de receta inválido' },
        { status: 400 }
      )
    }

    // Verificar que la receta existe
    const existingReceta = await recetaService.findOne(id)
    if (!existingReceta) {
      return NextResponse.json(
        { error: `No se encontró la receta con ID: ${id}` },
        { status: 404 }
      )
    }

    await recetaService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/farmacia/recetas/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar la receta' },
      { status: 500 }
    )
  }
}
