import { NextRequest, NextResponse } from 'next/server'
import { FinanciaService } from '@/services/financia.service'

const financiaService = new FinanciaService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const financiamiento = await financiaService.findOne(params.id)
    if (!financiamiento) {
      return NextResponse.json({ error: 'Financiamiento no encontrado' }, { status: 404 })
    }
    return NextResponse.json(financiamiento)
  } catch (error) {
    console.error(`Error en GET /api/tablas/financiamientos/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al obtener financiamiento", error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    const financiamiento = await financiaService.update(params.id, data)
    return NextResponse.json(financiamiento)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/financiamientos/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al actualizar financiamiento", error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await financiaService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/financiamientos/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al eliminar financiamiento", error: String(error) },
      { status: 500 }
    )
  }
}
