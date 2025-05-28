import { NextRequest, NextResponse } from 'next/server'
import { DestinoService } from '@/services/destino.service'

const destinoService = new DestinoService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const destino = await destinoService.findOne(id)

    if (!destino) {
      return NextResponse.json(
        { error: `No se encontró el destino con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(destino)
  } catch (error) {
    console.error(`Error en GET /api/tablas/destino/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener el destino' },
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

    // Verificar que el destino existe
    const existingDestino = await destinoService.findOne(id)
    if (!existingDestino) {
      return NextResponse.json(
        { error: `No se encontró el destino con ID: ${id}` },
        { status: 404 }
      )
    }

    const updatedDestino = await destinoService.update(id, data)
    return NextResponse.json(updatedDestino)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/destino/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el destino' },
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

    // Verificar que el destino existe
    const existingDestino = await destinoService.findOne(id)
    if (!existingDestino) {
      return NextResponse.json(
        { error: `No se encontró el destino con ID: ${id}` },
        { status: 404 }
      )
    }

    await destinoService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/destino/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar el destino' },
      { status: 500 }
    )
  }
}
