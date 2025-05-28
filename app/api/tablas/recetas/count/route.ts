import { NextRequest, NextResponse } from 'next/server'
import { RecetaService } from '@/services/receta.service'

const recetaService = new RecetaService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const fechaInicio = searchParams.get('fechaInicio') || ''
    const fechaFin = searchParams.get('fechaFin') || ''

    const count = await recetaService.count({ 
      search,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined
    })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/farmacia/recetas/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar recetas' },
      { status: 500 }
    )
  }
}
