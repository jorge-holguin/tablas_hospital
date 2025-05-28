import { NextRequest, NextResponse } from 'next/server'
import { SeguroService } from '@/services/seguro.service'
import { Prisma } from '@prisma/client'

const seguroService = new SeguroService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seguro = await seguroService.findOne(params.id)
    if (!seguro) {
      return NextResponse.json({ error: 'Seguro no encontrado' }, { status: 404 })
    }
    return NextResponse.json(seguro)
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
    const seguro = await seguroService.update(params.id, data)
    return NextResponse.json(seguro)
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
    await seguroService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
