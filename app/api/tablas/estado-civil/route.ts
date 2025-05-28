import { NextRequest, NextResponse } from 'next/server'
import { EstadoCivilService } from '@/services/estado-civil.service'
import { Prisma } from '@prisma/client'

const estadoCivilService = new EstadoCivilService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.ESTADO_CIVILWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { ESTADO_CIVIL: { contains: search } },
          { NOMBRE: { contains: search } },
          { RENIEC: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true' ? 1 : 0
      }
    }
    
    const estadoCivil = await estadoCivilService.findAll({ take, skip, where })
    return NextResponse.json(estadoCivil)
  } catch (error) {
    console.error('Error fetching estado civiles:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const estadoCivil = await estadoCivilService.create(data)
    return NextResponse.json(estadoCivil, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
