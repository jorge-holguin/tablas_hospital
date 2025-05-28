import { NextRequest, NextResponse } from "next/server"
import { getAlmacenById, updateAlmacen, deleteAlmacen } from "@/services/almacen.service"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const response = await getAlmacenById(id)
    
    if (!response.success) {
      return NextResponse.json(response, { status: 404 })
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error(`Error en GET /api/almacenes/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al obtener almacén", error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    // Validar que al menos un campo para actualizar esté presente
    const updateableFields = ["NOMBRE", "ACTIVO"]
    const hasUpdateableField = updateableFields.some(field => body[field] !== undefined)
    
    if (!hasUpdateableField) {
      return NextResponse.json(
        { success: false, message: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      )
    }
    
    // Asegurarse de que ACTIVO sea un número si está presente
    if (body.ACTIVO !== undefined) {
      body.ACTIVO = Number(body.ACTIVO)
    }
    
    const response = await updateAlmacen(id, body)
    
    if (!response.success) {
      return NextResponse.json(response, { status: 404 })
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error(`Error en PUT /api/almacenes/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al actualizar almacén", error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const response = await deleteAlmacen(id)
    
    if (!response.success) {
      return NextResponse.json(response, { status: 404 })
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error(`Error en DELETE /api/almacenes/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al eliminar almacén", error: String(error) },
      { status: 500 }
    )
  }
}
