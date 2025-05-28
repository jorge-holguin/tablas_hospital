import { NextRequest, NextResponse } from 'next/server'
import { GrupoRecaudacionService } from '@/services/grupo-recaudacion.service'

const grupoRecaudacionService = new GrupoRecaudacionService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const activo = searchParams.get('activo') || undefined

    const count = await grupoRecaudacionService.count({ 
      search,
      activo
    })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/tablas/grupo-recaudacion/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar grupos de recaudación' },
      { status: 500 }
    )
  }
}
