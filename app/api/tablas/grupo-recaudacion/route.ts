import { NextRequest, NextResponse } from 'next/server'
import { GrupoRecaudacionService } from '@/services/grupo-recaudacion.service'

const grupoRecaudacionService = new GrupoRecaudacionService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'GRUPO_RECAUDACION'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'
    const activo = searchParams.get('activo') || undefined

    const grupos = await grupoRecaudacionService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection,
      activo
    })

    return NextResponse.json(grupos)
  } catch (error) {
    console.error('Error en GET /api/tablas/grupo-recaudacion:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener grupos de recaudación' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.GRUPO_RECAUDACION || !data.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos GRUPO_RECAUDACION y NOMBRE son obligatorios' },
        { status: 400 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    data.ACTIVO = data.ACTIVO !== undefined ? Number(data.ACTIVO) : 1
    data.GENERAORDEN = data.GENERAORDEN !== undefined ? Number(data.GENERAORDEN) : 0
    data.CONTROLASTOCK = data.CONTROLASTOCK !== undefined ? Number(data.CONTROLASTOCK) : 0
    data.CONTROLPACIENTE = data.CONTROLPACIENTE !== undefined ? Number(data.CONTROLPACIENTE) : 0

    const grupo = await grupoRecaudacionService.create(data)
    return NextResponse.json(grupo, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/tablas/grupo-recaudacion:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear grupo de recaudación' },
      { status: 500 }
    )
  }
}
