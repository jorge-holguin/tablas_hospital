import { NextRequest, NextResponse } from 'next/server'
import { TipoAtencionService } from '@/services/tipo-atencion.service'
import { Prisma } from '@prisma/client'

const tipoAtencionService = new TipoAtencionService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tipoAtencion = await tipoAtencionService.findOne(params.id)
    if (!tipoAtencion) {
      return NextResponse.json({ error: 'Tipo de atención no encontrado' }, { status: 404 })
    }
    return NextResponse.json(tipoAtencion)
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
    const tipoAtencion = await tipoAtencionService.update(params.id, data)
    return NextResponse.json(tipoAtencion)
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
    await tipoAtencionService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
