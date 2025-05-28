import { NextRequest, NextResponse } from 'next/server'
import { ClasificadorService } from '@/services/clasificador.service'

const clasificadorService = new ClasificadorService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'CLASIFICADOR'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'
    const activo = searchParams.get('activo') || undefined

    const clasificadores = await clasificadorService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection,
      activo
    })

    return NextResponse.json(clasificadores)
  } catch (error) {
    console.error('Error en GET /api/tablas/clasificador:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener clasificadores' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.CLASIFICADOR || !data.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos CLASIFICADOR y NOMBRE son obligatorios' },
        { status: 400 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    data.ACTIVO = data.ACTIVO !== undefined ? Number(data.ACTIVO) : 1

    const clasificador = await clasificadorService.create(data)
    return NextResponse.json(clasificador, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/tablas/clasificador:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear clasificador' },
      { status: 500 }
    )
  }
}
