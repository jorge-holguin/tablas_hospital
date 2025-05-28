import { NextRequest, NextResponse } from 'next/server'
import { UbigeoService } from '@/services/ubigeo.service'
import { Prisma } from '@prisma/client'

const ubigeoService = new UbigeoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.UBIGEOWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { UBIGEO: { contains: search } },
          { DISTRITO: { contains: search } },
          { PROVINCIA: { contains: search } },
          { DEPARTAMENTO: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: Number(active)
      }
    }
    
    const ubigeos = await ubigeoService.findAll({ take, skip, where })
    return NextResponse.json(ubigeos)
  } catch (error) {
    console.error('Error fetching ubigeos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const ubigeo = await ubigeoService.create(data)
    return NextResponse.json(ubigeo, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
