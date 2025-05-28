import { NextRequest, NextResponse } from 'next/server'
import { TipoAtencionService } from '@/services/tipo-atencion.service'
import { Prisma } from '@prisma/client'

const tipoAtencionService = new TipoAtencionService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.TIPO_ATENCIONWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { TIPO_ATENCION: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const tipoAtenciones = await tipoAtencionService.findAll({ take, skip, where })
    return NextResponse.json(tipoAtenciones)
  } catch (error) {
    console.error('Error fetching tipo de atenciones:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const tipoAtencion = await tipoAtencionService.create(data)
    return NextResponse.json(tipoAtencion, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
