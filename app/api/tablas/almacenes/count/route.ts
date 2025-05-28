import { NextRequest, NextResponse } from 'next/server'
import { countAlmacenes } from '@/services/almacen.service'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const searchTerm = searchParams.get('search') || ''
    const activo = searchParams.get('active') ? parseInt(searchParams.get('active') || '1') : undefined

    const response = await countAlmacenes(searchTerm, activo)
    
    if (!response.success) {
      return NextResponse.json(
        { error: response.message || 'Error al contar almacenes' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ count: response.data.total })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error en GET /api/tablas/almacenes/count:', error)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
