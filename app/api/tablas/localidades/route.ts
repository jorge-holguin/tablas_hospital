import { NextRequest, NextResponse } from 'next/server'
import { LocalidadService } from '@/services/localidad.service'
import { Prisma } from '@prisma/client'

const localidadService = new LocalidadService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.LOCALIDADWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { Localidad: { contains: search } },
          { Nombre: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        Activo: active === 'true' ? 1 : 0
      }
    }
    
    const localidades = await localidadService.findAll({ take, skip, where })
    return NextResponse.json(localidades)
  } catch (error) {
    console.error('Error fetching localidades:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const localidad = await localidadService.create(data)
    return NextResponse.json(localidad, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
