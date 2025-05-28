import { NextRequest, NextResponse } from 'next/server'
import { DestinoService } from '@/services/destino.service'

const destinoService = new DestinoService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    const count = await destinoService.count({ search })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/tablas/destino/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar destinos' },
      { status: 500 }
    )
  }
}
