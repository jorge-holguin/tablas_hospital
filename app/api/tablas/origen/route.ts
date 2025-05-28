import { NextRequest, NextResponse } from 'next/server'
import { OrigenService } from '@/services/origen.service'

const origenService = new OrigenService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'ORIGEN'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'

    const origenes = await origenService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection
    })

    return NextResponse.json(origenes)
  } catch (error) {
    console.error('Error en GET /api/tablas/origen:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener orígenes' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.ORIGEN || !data.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos ORIGEN y NOMBRE son obligatorios' },
        { status: 400 }
      )
    }

    const origen = await origenService.create(data)
    return NextResponse.json(origen, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/tablas/origen:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear origen' },
      { status: 500 }
    )
  }
}
