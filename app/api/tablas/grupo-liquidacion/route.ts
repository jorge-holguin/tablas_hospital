import { NextRequest, NextResponse } from 'next/server'
import { GrupoLiquidacionService } from '@/services/grupo-liquidacion.service'

const grupoLiquidacionService = new GrupoLiquidacionService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'GRUPO_LIQUIDACION'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'
    const activo = searchParams.get('activo') || undefined

    const grupos = await grupoLiquidacionService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection,
      activo
    })

    return NextResponse.json(grupos)
  } catch (error) {
    console.error('Error en GET /api/tablas/grupo-liquidacion:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener grupos de liquidación' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.GRUPO_LIQUIDACION || !data.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos GRUPO_LIQUIDACION y NOMBRE son obligatorios' },
        { status: 400 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    data.ACTIVO = data.ACTIVO !== undefined ? Number(data.ACTIVO) : 1

    const grupo = await grupoLiquidacionService.create(data)
    return NextResponse.json(grupo, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/tablas/grupo-liquidacion:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear grupo de liquidación' },
      { status: 500 }
    )
  }
}
