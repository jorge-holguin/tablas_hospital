import { NextRequest, NextResponse } from 'next/server'
import { ClasificadorService } from '@/services/clasificador.service'

const clasificadorService = new ClasificadorService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const activo = searchParams.get('activo') || undefined

    const count = await clasificadorService.count({ 
      search,
      activo
    })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/tablas/clasificador/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar clasificadores' },
      { status: 500 }
    )
  }
}
