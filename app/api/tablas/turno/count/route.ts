import { NextRequest, NextResponse } from 'next/server'
import { TurnoService } from '@/services/turno.service'

const turnoService = new TurnoService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const activo = searchParams.get('activo') || undefined

    const count = await turnoService.count({ 
      search,
      activo
    })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/tablas/turno/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar turnos' },
      { status: 500 }
    )
  }
}
