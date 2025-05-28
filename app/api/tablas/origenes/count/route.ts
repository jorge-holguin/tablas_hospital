import { NextRequest, NextResponse } from 'next/server'
import { OrigenService } from '@/services/origen.service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    
    const origenService = new OrigenService()
    const count = await origenService.count({ search: searchTerm })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error en GET /api/tablas/origenes/count:", error)
    return NextResponse.json(
      { success: false, message: "Error al contar orígenes", error: String(error) },
      { status: 500 }
    )
  }
}
