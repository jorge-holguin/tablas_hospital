import { NextRequest, NextResponse } from 'next/server'
import { TurnoService } from '@/services/turno.service'

const turnoService = new TurnoService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'TURNO'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'
    const activo = searchParams.get('activo') || undefined

    const turnos = await turnoService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection,
      activo
    })

    return NextResponse.json(turnos)
  } catch (error) {
    console.error('Error en GET /api/tablas/turno:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener turnos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.TURNO || !data.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos TURNO y NOMBRE son obligatorios' },
        { status: 400 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    data.ACTIVO = data.ACTIVO !== undefined ? Number(data.ACTIVO) : 1

    const turno = await turnoService.create(data)
    return NextResponse.json(turno, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/tablas/turno:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear turno' },
      { status: 500 }
    )
  }
}
