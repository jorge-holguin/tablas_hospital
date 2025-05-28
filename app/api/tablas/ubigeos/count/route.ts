import { NextRequest, NextResponse } from 'next/server'
import { UbigeoService } from '@/services/ubigeo.service'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    const ubigeoService = new UbigeoService()
    
    let where: Prisma.UBIGEOWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { UBIGEO: { contains: searchTerm } },
          { DISTRITO: { contains: searchTerm } },
          { PROVINCIA: { contains: searchTerm } },
          { DEPARTAMENTO: { contains: searchTerm } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: Number(active)
      }
    }
    
    const count = await ubigeoService.count({ where })
    return NextResponse.json(count)
  } catch (error) {
    console.error("Error en GET /api/tablas/ubigeos/count:", error)
    return NextResponse.json(
      { success: false, message: "Error al contar ubigeos", error: String(error) },
      { status: 500 }
    )
  }
}
