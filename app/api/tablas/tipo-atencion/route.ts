import { NextRequest, NextResponse } from 'next/server'
import { TipoAtencionService } from '@/services/tipo-atencion.service'

const tipoAtencionService = new TipoAtencionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const take = Number(searchParams.get('take') || '10')
    const skip = Number(searchParams.get('skip') || '0')
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

    const tiposAtencion = await tipoAtencionService.findAll({
      take,
      skip,
      where: whereClause,
      orderBy: { TIPO_ATENCION: 'asc' }
    })

    return NextResponse.json(tiposAtencion)
  } catch (error: any) {
    console.error('Error en GET /api/tablas/tipo-atencion:', error)
    return NextResponse.json(
      { error: 'Error al obtener los tipos de atención', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Asegurar que ACTIVO sea un número
    if (body.ACTIVO !== undefined) {
      body.ACTIVO = Number(body.ACTIVO)
    }
    
    const tipoAtencion = await tipoAtencionService.create(body)
    return NextResponse.json(tipoAtencion, { status: 201 })
  } catch (error: any) {
    console.error('Error en POST /api/tablas/tipo-atencion:', error)
    return NextResponse.json(
      { error: 'Error al crear el tipo de atención', details: error.message },
      { status: 500 }
    )
  }
}
