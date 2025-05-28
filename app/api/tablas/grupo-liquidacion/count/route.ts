import { NextRequest, NextResponse } from 'next/server'
import { GrupoLiquidacionService } from '@/services/grupo-liquidacion.service'

const grupoLiquidacionService = new GrupoLiquidacionService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const activo = searchParams.get('activo') || undefined

    const count = await grupoLiquidacionService.count({ 
      search,
      activo
    })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/tablas/grupo-liquidacion/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar grupos de liquidación' },
      { status: 500 }
    )
  }
}
