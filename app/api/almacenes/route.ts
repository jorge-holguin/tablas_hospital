import { NextRequest, NextResponse } from "next/server"
import { getAlmacenes, createAlmacen } from "@/services/almacen.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const sortBy = searchParams.get("sortBy") || "ALMACEN"
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc"
    const activo = searchParams.get("activo") ? parseInt(searchParams.get("activo") || "1") : undefined

    const response = await getAlmacenes(searchTerm, page, pageSize, sortBy, sortOrder, activo)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error en GET /api/almacenes:", error)
    return NextResponse.json(
      { success: false, message: "Error al obtener almacenes", error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar campos requeridos
    const requiredFields = ["ALMACEN", "NOMBRE", "ACTIVO"]
    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { success: false, message: `El campo ${field} es requerido` },
          { status: 400 }
        )
      }
    }

    // Validar longitud del código de almacén
    if (body.ALMACEN.length !== 2) {
      return NextResponse.json(
        { success: false, message: "El código de almacén debe tener exactamente 2 caracteres" },
        { status: 400 }
      )
    }

    // Asegurarse de que ACTIVO sea un número
    body.ACTIVO = Number(body.ACTIVO)

    const response = await createAlmacen(body)
    
    if (!response.success) {
      return NextResponse.json(response, { status: 400 })
    }
    
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error en POST /api/almacenes:", error)
    return NextResponse.json(
      { success: false, message: "Error al crear almacén", error: String(error) },
      { status: 500 }
    )
  }
}
