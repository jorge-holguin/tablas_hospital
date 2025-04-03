import { NextRequest, NextResponse } from 'next/server'
import { AlmacenService } from '@/services/almacen.service'
import { Prisma } from '@prisma/client'

const almacenService = new AlmacenService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    
    const almacenes = await almacenService.findAll({ take, skip })
    return NextResponse.json(almacenes)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const almacen = await almacenService.create(data)
    return NextResponse.json(almacen, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
