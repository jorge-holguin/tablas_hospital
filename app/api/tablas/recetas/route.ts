import { NextRequest, NextResponse } from 'next/server'
import { RecetaService } from '@/services/receta.service'

const recetaService = new RecetaService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'FECHA'
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc'
    const fechaInicio = searchParams.get('fechaInicio') || ''
    const fechaFin = searchParams.get('fechaFin') || ''

    const recetas = await recetaService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined
    })

    return NextResponse.json(recetas)
  } catch (error) {
    console.error('Error en GET /api/farmacia/recetas:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener recetas' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.ATENCION_ID || !data.ITEM) {
      return NextResponse.json(
        { error: 'Los campos ATENCION_ID e ITEM son obligatorios' },
        { status: 400 }
      )
    }

    // Establecer la fecha actual si no se proporciona
    if (!data.FECHA) {
      data.FECHA = new Date()
    }

    const receta = await recetaService.create(data)
    return NextResponse.json(receta, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/farmacia/recetas:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear receta' },
      { status: 500 }
    )
  }
}
