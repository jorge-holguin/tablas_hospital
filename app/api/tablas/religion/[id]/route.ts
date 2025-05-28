import { NextRequest, NextResponse } from 'next/server'
import { OcupacionService } from '@/services/ocupacion.service'
import { Prisma } from '@prisma/client'

const ocupacionService = new OcupacionService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ocupacion = await ocupacionService.findOne(params.id)
    if (!ocupacion) {
      return NextResponse.json({ error: 'Ocupación no encontrada' }, { status: 404 })
    }
    return NextResponse.json(ocupacion)
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
    const ocupacion = await ocupacionService.update(params.id, data)
    return NextResponse.json(ocupacion)
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
    await ocupacionService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
