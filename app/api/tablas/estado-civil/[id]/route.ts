import { NextRequest, NextResponse } from 'next/server'
import { EstadoCivilService } from '@/services/estado-civil.service'
import { Prisma } from '@prisma/client'

const estadoCivilService = new EstadoCivilService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const estadoCivil = await estadoCivilService.findOne(params.id)
    if (!estadoCivil) {
      return NextResponse.json({ error: 'Estado Civil no encontrado' }, { status: 404 })
    }
    return NextResponse.json(estadoCivil)
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
    const estadoCivil = await estadoCivilService.update(params.id, data)
    return NextResponse.json(estadoCivil)
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
    await estadoCivilService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
