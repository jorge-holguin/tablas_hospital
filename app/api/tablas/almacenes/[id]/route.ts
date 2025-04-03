import { NextRequest, NextResponse } from 'next/server'
import { AlmacenService } from '@/services/almacen.service'
import { Prisma } from '@prisma/client'

const almacenService = new AlmacenService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const almacen = await almacenService.findOne(params.id)
    if (!almacen) {
      return NextResponse.json({ error: 'Almacén no encontrado' }, { status: 404 })
    }
    return NextResponse.json(almacen)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    const almacen = await almacenService.update(params.id, data)
    return NextResponse.json(almacen)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await almacenService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
