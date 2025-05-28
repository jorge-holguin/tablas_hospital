import { NextRequest, NextResponse } from 'next/server'
import { EspecialidadService } from '@/services/especialidad.service'
import { Prisma } from '@prisma/client'

const especialidadService = new EspecialidadService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.ESPECIALIDADWhereInput = {}
    
    // Añadir filtro de búsqueda si se proporciona
    if (search) {
      where = {
        OR: [
          { ESPECIALIDAD: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Añadir filtro de activo si se proporciona
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true' ? new Prisma.Decimal(1) : new Prisma.Decimal(0)
      }
    }
    
    const especialidades = await especialidadService.findAll({ take, skip, where })
    return NextResponse.json(especialidades)
  } catch (error) {
    console.error('Error fetching especialidades:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Convertir ACTIVO a Decimal si es necesario
    if (data.ACTIVO !== undefined) {
      data.ACTIVO = new Prisma.Decimal(data.ACTIVO)
    }
    
    const especialidad = await especialidadService.create(data)
    return NextResponse.json(especialidad, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
