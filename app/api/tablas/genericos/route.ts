import { NextRequest, NextResponse } from 'next/server'
import { GenericoService } from '@/services/generico.service'
import { Prisma } from '@prisma/client'

const genericoService = new GenericoService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    
    // Construir la consulta de búsqueda
    let whereClause: Prisma.GENERICOWhereInput = {}
    
    if (search) {
      whereClause = {
        OR: [
          { GENERICO: { contains: search } },
          { NOMBRE: { contains: search } },
        ],
      }
    }
    
    const genericos = await genericoService.findAll({ 
      take, 
      skip,
      where: whereClause,
      orderBy: { GENERICO: 'asc' }
    })
    return NextResponse.json(genericos)
  } catch (error) {
    console.error('Error fetching genericos:', error)
    return NextResponse.json({ error: 'Error al obtener los genéricos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const generico = await genericoService.create(data)
    return NextResponse.json(generico, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
