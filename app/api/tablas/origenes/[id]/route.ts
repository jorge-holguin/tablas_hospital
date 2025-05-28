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
      return NextResponse.json({ error: 'Origen no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(origen)
  } catch (error) {
    console.error(`Error en GET /api/tablas/origenes/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al obtener origen", error: String(error) },
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
    const origen = await origenService.update(id, data)
    
    return NextResponse.json(origen)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/origenes/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al actualizar origen", error: String(error) },
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
    await origenService.delete(id)
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/origenes/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al eliminar origen", error: String(error) },
      { status: 500 }
    )
  }
}
