import { NextRequest, NextResponse } from 'next/server'
import { OrigenService } from '@/services/origen.service'

const origenService = new OrigenService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const origen = await origenService.findOne(id)

    if (!origen) {
      return NextResponse.json(
        { error: `No se encontró el origen con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(origen)
  } catch (error) {
    console.error(`Error en GET /api/tablas/origen/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener el origen' },
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

    // Verificar que el origen existe
    const existingOrigen = await origenService.findOne(id)
    if (!existingOrigen) {
      return NextResponse.json(
        { error: `No se encontró el origen con ID: ${id}` },
        { status: 404 }
      )
    }

    const updatedOrigen = await origenService.update(id, data)
    return NextResponse.json(updatedOrigen)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/origen/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el origen' },
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

    // Verificar que el origen existe
    const existingOrigen = await origenService.findOne(id)
    if (!existingOrigen) {
      return NextResponse.json(
        { error: `No se encontró el origen con ID: ${id}` },
        { status: 404 }
      )
    }

    await origenService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/origen/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar el origen' },
      { status: 500 }
    )
  }
}
