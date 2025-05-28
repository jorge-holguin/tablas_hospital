import { NextRequest, NextResponse } from 'next/server'
import { SeguroService } from '@/services/seguro.service'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    const seguroService = new SeguroService()
    
    let where: Prisma.SEGUROWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { SEGURO: { contains: searchTerm } },
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
    
    const count = await seguroService.count({ where })
    return NextResponse.json(count)
  } catch (error) {
    console.error("Error en GET /api/tablas/seguros/count:", error)
    return NextResponse.json(
      { success: false, message: "Error al contar seguros", error: String(error) },
      { status: 500 }
    )
  }
}
