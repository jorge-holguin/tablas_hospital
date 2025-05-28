import { NextRequest, NextResponse } from 'next/server'
import { IngresoService } from '@/services/ingreso.service'
import { Prisma } from '@prisma/client'

const ingresoService = new IngresoService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ingreso = await ingresoService.findOne(params.id)
    if (!ingreso) {
      return NextResponse.json({ error: 'Ingreso no encontrado' }, { status: 404 })
    }
    return NextResponse.json(ingreso)
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
    const ingreso = await ingresoService.update(params.id, data)
    return NextResponse.json(ingreso)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  { params }: { params: { id: string } }
) {
  try {
    await ingresoService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
