import { NextRequest, NextResponse } from 'next/server'
import { ClaseService } from '@/services/clase.service'
import { Prisma } from '@prisma/client'

const claseService = new ClaseService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clase = await claseService.findOne(params.id)
    if (!clase) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 })
    }
    return NextResponse.json(clase)
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
    const clase = await claseService.update(params.id, data)
    return NextResponse.json(clase)
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
    await claseService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
