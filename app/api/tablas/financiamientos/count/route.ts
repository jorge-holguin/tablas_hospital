import { NextRequest, NextResponse } from 'next/server'
import { FinanciaService } from '@/services/financia.service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    
    const financiaService = new FinanciaService()
    
    let where: any = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { FINANCIA: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } }
        ]
      }
    }
    
    const count = await financiaService.count({ where })
    return NextResponse.json(count)
  } catch (error) {
    console.error("Error en GET /api/tablas/financiamientos/count:", error)
    return NextResponse.json(
      { success: false, message: "Error al contar financiamientos", error: String(error) },
      { status: 500 }
    )
  }
}
