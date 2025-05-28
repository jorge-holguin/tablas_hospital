import { NextRequest, NextResponse } from 'next/server'
import { IngresoService } from '@/services/ingreso.service'
import { Prisma } from '@prisma/client'

const ingresoService = new IngresoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.INGRESOCWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { INGRESOID: { contains: search } },
          { ALMACEN: { contains: search } }
        ]
      }
    }
    
    const ingresos = await ingresoService.findAll({ take, skip, where })
    return NextResponse.json(ingresos)
  } catch (error) {
    console.error('Error fetching ingresos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const ingreso = await ingresoService.create(data)
    return NextResponse.json(ingreso, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
