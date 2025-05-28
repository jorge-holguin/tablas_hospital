import { NextRequest, NextResponse } from 'next/server'
import { OrigenService } from '@/services/origen.service'

const origenService = new OrigenService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    const count = await origenService.count({ search })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/tablas/origen/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar orígenes' },
      { status: 500 }
    )
  }
}
