import { NextRequest, NextResponse } from 'next/server'
import { TipoDocumentoService } from '@/services/tipo-documento.service'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    const tipoDocumentoService = new TipoDocumentoService()
    
    let where: Prisma.TIPO_DOCUMENTOWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { TIPO_DOCUMENTO: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const count = await tipoDocumentoService.count({ where })
    return NextResponse.json(count)
  } catch (error) {
    console.error("Error en GET /api/tipos-documento/count:", error)
    return NextResponse.json(
      { success: false, message: "Error al contar tipos de documento", error: String(error) },
      { status: 500 }
    )
  }
}
