import { NextRequest, NextResponse } from 'next/server'
import { ProveedorService } from '@/services/proveedor.service'

const proveedorService = new ProveedorService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proveedor = await proveedorService.findOne(params.id)
    
    if (!proveedor) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(proveedor)
  } catch (error: any) {
    console.error(`Error en GET /api/tablas/proveedores/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Error al obtener el proveedor', details: error.message },
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
    
    const proveedor = await proveedorService.update(params.id, body)
    return NextResponse.json(proveedor)
  } catch (error: any) {
    console.error(`Error en PUT /api/tablas/proveedores/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Error al actualizar el proveedor', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await proveedorService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error en DELETE /api/tablas/proveedores/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Error al eliminar el proveedor', details: error.message },
      { status: 500 }
    )
  }
}
