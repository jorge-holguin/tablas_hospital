import { NextRequest, NextResponse } from 'next/server'
import { MedicoService } from '@/services/medico.service'
import { Prisma } from '@prisma/client'

const medicoService = new MedicoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    console.log('API request params:', { take, skip, search, active })
    
    let where: Prisma.MEDICOWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { MEDICO: { contains: search } },
          { NOMBRE: { contains: search } },
          { COLEGIO: { contains: search } }
        ]
      }
      console.log('Search filter added:', search)
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true' ? 1 : 0
      }
      console.log('Active filter added:', active)
    }
    
    console.log('Final where condition:', JSON.stringify(where, null, 2))
    
    // Obtener los datos y el conteo total
    const [medicos, totalCount] = await Promise.all([
      medicoService.findAll({ take, skip, where }),
      medicoService.count({ where })
    ])

    // Devolver los datos junto con metadatos de paginación
    return NextResponse.json({
      data: medicos,
      meta: {
        total: totalCount,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        pageCount: Math.ceil(totalCount / take)
      }
    })
  } catch (error) {
    // Capturar información detallada del error
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Error fetching medicos:', { 
      message: errorMessage,
      stack: errorStack,
      url: req.url
    })
    
    // Devolver un mensaje de error más informativo
    return NextResponse.json({ 
      error: 'Error al obtener datos de médicos', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const medico = await medicoService.create(data)
    return NextResponse.json(medico, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
