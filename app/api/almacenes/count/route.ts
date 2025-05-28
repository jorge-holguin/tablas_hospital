import { NextRequest, NextResponse } from "next/server"
import { countAlmacenes } from "@/services/almacen.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const activo = searchParams.get("activo") ? parseInt(searchParams.get("activo") || "1") : undefined

    const response = await countAlmacenes(searchTerm, activo)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error en GET /api/almacenes/count:", error)
    return NextResponse.json(
      { success: false, message: "Error al contar almacenes", error: String(error) },
      { status: 500 }
    )
  }
}
