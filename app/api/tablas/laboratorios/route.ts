import { NextRequest, NextResponse } from 'next/server'
import { LaboratorioService } from '@/services/laboratorio.service'
import { Prisma } from '@prisma/client'

const laboratorioService = new LaboratorioService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    console.log('API request params:', { take, skip, search, active })
    
    let where: Prisma.LABORATORIOWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { LABORATORIO: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
      console.log('Search filter added:', search)
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
      console.log('Active filter added:', active)
    }
    
    console.log('Final where condition:', JSON.stringify(where, null, 2))
    
    // Obtener los datos y el conteo total
    const [laboratorios, totalCount] = await Promise.all([
      laboratorioService.findAll({ take, skip, where }),
      laboratorioService.count({ where })
    ])

    // Devolver los datos junto con metadatos de paginación
    return NextResponse.json({
      data: laboratorios,
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
    
    console.error('Error fetching laboratorios:', { 
      message: errorMessage,
      stack: errorStack,
      url: req.url
    })
    
    // Devolver un mensaje de error más informativo
    return NextResponse.json({ 
      error: 'Error al obtener datos de laboratorios', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const laboratorio = await laboratorioService.create(data)
    return NextResponse.json(laboratorio, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
