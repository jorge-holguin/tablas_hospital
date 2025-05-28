import { NextRequest, NextResponse } from 'next/server'
import { LocalidadService } from '@/services/localidad.service'
import { Prisma } from '@prisma/client'

const localidadService = new LocalidadService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const localidad = await localidadService.findOne(params.id)
    if (!localidad) {
      return NextResponse.json({ error: 'Localidad no encontrada' }, { status: 404 })
    }
    return NextResponse.json(localidad)
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
    const localidad = await localidadService.update(params.id, data)
    return NextResponse.json(localidad)
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
    await localidadService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
