import { NextRequest, NextResponse } from 'next/server'
import { TipoAtencionService } from '@/services/tipo-atencion.service'

const tipoAtencionService = new TipoAtencionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const active = searchParams.get('active')

    // Construir el filtro de búsqueda
    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { TIPO_ATENCION: { contains: search, mode: 'insensitive' } },
        { NOMBRE: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (active !== null && active !== undefined) {
      whereClause.ACTIVO = Number(active)
    }

    const count = await tipoAtencionService.count({
      where: whereClause
    })

    return NextResponse.json({ count })
  } catch (error: any) {
    console.error('Error en GET /api/tablas/tipo-atencion/count:', error)
    return NextResponse.json(
      { error: 'Error al contar los tipos de atención', details: error.message },
      { status: 500 }
    )
  }
}
