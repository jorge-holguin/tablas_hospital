import { NextRequest, NextResponse } from 'next/server'
import { PacienteService } from '@/services/paciente.service'

const pacienteService = new PacienteService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'PACIENTE'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'

    const pacientes = await pacienteService.findAll({
      skip,
      take,
      search,
      orderBy,
      orderDirection
    })

    return NextResponse.json(pacientes)
  } catch (error) {
    console.error('Error en GET /api/tablas/paciente:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener pacientes' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validar los datos requeridos
    if (!data.PACIENTE || !data.HISTORIA || !data.NOMBRES) {
      return NextResponse.json(
        { error: 'Los campos PACIENTE, HISTORIA y NOMBRES son obligatorios' },
        { status: 400 }
      )
    }

    // Formatear la fecha de nacimiento si existe
    if (data.FECHA_NACIMIENTO) {
      data.FECHA_NACIMIENTO = new Date(data.FECHA_NACIMIENTO)
    }

    const paciente = await pacienteService.create(data)
    return NextResponse.json(paciente, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/tablas/paciente:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear paciente' },
      { status: 500 }
    )
  }
}
