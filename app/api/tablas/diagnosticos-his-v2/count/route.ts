import { NextRequest, NextResponse } from 'next/server'
import { CiexhisV2Service } from '@/services/ciexhis-v2.service'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const estado = searchParams.get("estado")
    const clase = searchParams.get("clase")
    const tipo = searchParams.get("tipo")
    
    const ciexhisV2Service = new CiexhisV2Service()
    
    let where: Prisma.CIEXHIS_V2WhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { CODIGO: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } }
        ]
      }
    }
    
    // Add estado filter if provided
    if (estado !== null && estado !== undefined) {
      where = {
        ...where,
        EST: estado
      }
    }
    
    // Add clase filter if provided
    if (clase !== null && clase !== undefined) {
      where = {
        ...where,
        CLASE: clase
      }
    }
    
    // Add tipo filter if provided
    if (tipo !== null && tipo !== undefined) {
      where = {
        ...where,
        TIPO: tipo
      }
    }
    
    const count = await ciexhisV2Service.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error en GET /api/tablas/diagnosticos-his-v2/count:", error)
    return NextResponse.json(
      { success: false, message: "Error al contar diagnósticos", error: String(error) },
      { status: 500 }
    )
  }
}
