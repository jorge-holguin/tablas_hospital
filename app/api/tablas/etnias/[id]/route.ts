import { NextRequest, NextResponse } from 'next/server'
import { EtniaService } from '@/services/etnia.service'
import { Prisma } from '@prisma/client'

const etniaService = new EtniaService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const etnia = await etniaService.findOne(params.id)
    if (!etnia) {
      return NextResponse.json({ error: 'Etnia no encontrada' }, { status: 404 })
    }
    return NextResponse.json(etnia)
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
    const etnia = await etniaService.update(params.id, data)
    return NextResponse.json(etnia)
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
    await etniaService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
