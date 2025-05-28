import { NextRequest, NextResponse } from 'next/server'
import { getAlmacenById, updateAlmacen, deleteAlmacen } from '@/services/almacen.service'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const response = await getAlmacenById(id)
    
    if (!response.success) {
      return NextResponse.json(
        { error: response.message || `No se encontró el almacén con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error en GET /api/tablas/almacenes/${params.id}:`, error)
    return NextResponse.json(
      { error: errorMessage },
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

    // Asegurarse de que ACTIVO sea un número si está presente
    if (data.ACTIVO !== undefined) {
      data.ACTIVO = Number(data.ACTIVO)
    }

    // Actualizar el almacén
    const response = await updateAlmacen(id, {
      NOMBRE: data.NOMBRE,
      ACTIVO: data.ACTIVO
    })

    if (!response.success) {
      return NextResponse.json(
        { error: response.message || `No se pudo actualizar el almacén con ID: ${id}` },
        { status: response.message.includes('no encontrado') ? 404 : 400 }
      )
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error en PUT /api/tablas/almacenes/${params.id}:`, error)
    return NextResponse.json(
      { error: errorMessage },
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

    // Eliminar el almacén
    const response = await deleteAlmacen(id)

    if (!response.success) {
      // Si el mensaje contiene información sobre dependencias, es un error 400
      // Si el mensaje indica que no se encontró, es un 404
      const statusCode = response.message.includes('no encontrado') ? 404 : 400
      
      return NextResponse.json(
        { error: response.message || `Error al eliminar el almacén con ID: ${id}` },
        { status: statusCode }
      )
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error en DELETE /api/tablas/almacenes/${params.id}:`, error)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
