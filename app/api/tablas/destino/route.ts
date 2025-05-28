import { NextRequest, NextResponse } from 'next/server'
import { DestinoService } from '@/services/destino.service'

const destinoService = new DestinoService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'DESTINO'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'

    const destinos = await destinoService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection
    })

    return NextResponse.json(destinos)
  } catch (error) {
    console.error('Error en GET /api/tablas/destino:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener destinos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.DESTINO || !data.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos DESTINO y NOMBRE son obligatorios' },
        { status: 400 }
      )
    }

    const destino = await destinoService.create(data)
    return NextResponse.json(destino, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/tablas/destino:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear destino' },
      { status: 500 }
    )
  }
}
