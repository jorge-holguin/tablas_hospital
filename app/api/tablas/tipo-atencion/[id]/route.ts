import { NextRequest, NextResponse } from 'next/server'
import { TipoAtencionService } from '@/services/tipo-atencion.service'

const tipoAtencionService = new TipoAtencionService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tipoAtencion = await tipoAtencionService.findOne(params.id)
    
    if (!tipoAtencion) {
      return NextResponse.json(
        { error: 'Tipo de atención no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(tipoAtencion)
  } catch (error: any) {
    console.error(`Error en GET /api/tablas/tipo-atencion/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Error al obtener el tipo de atención', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Asegurar que ACTIVO sea un número
    if (body.ACTIVO !== undefined) {
      body.ACTIVO = Number(body.ACTIVO)
    }
    
    const tipoAtencion = await tipoAtencionService.update(params.id, body)
    return NextResponse.json(tipoAtencion)
  } catch (error: any) {
    console.error(`Error en PUT /api/tablas/tipo-atencion/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Error al actualizar el tipo de atención', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await tipoAtencionService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error en DELETE /api/tablas/tipo-atencion/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Error al eliminar el tipo de atención', details: error.message },
      { status: 500 }
    )
  }
}
