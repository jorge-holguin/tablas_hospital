import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const limit = parseInt(searchParams.get("limit") || "10")
    const activo = searchParams.get("activo") ? parseInt(searchParams.get("activo") || "1") : 1

    // Construir la condición de búsqueda
    const where: any = {
      ACTIVO: activo
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      where.OR = [
        { TIPO_DOCUMENTO: { contains: searchTerm } },
        { NOMBRE: { contains: searchTerm } }
      ]
    }
    
    // Obtener los tipos de documento
    const tiposDocumento = await prisma.tIPO_DOCUMENTO.findMany({
      where,
      select: {
        TIPO_DOCUMENTO: true,
        NOMBRE: true,
        ACTIVO: true
      },
      orderBy: {
        NOMBRE: 'asc'
      },
      take: limit
    })
    
    // Procesar los datos para asegurar que ACTIVO sea numérico
    const processedData = tiposDocumento.map(item => ({
      ...item,
      ACTIVO: Number(item.ACTIVO)
    }))
    
    return NextResponse.json({
      success: true,
      data: processedData
    })
  } catch (error) {
    console.error("Error en GET /api/selectores/tipos-documento:", error)
    return NextResponse.json(
      { success: false, message: "Error al obtener tipos de documento", error: String(error) },
      { status: 500 }
    )
  }
}
