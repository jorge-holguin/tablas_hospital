import { NextRequest, NextResponse } from 'next/server'
import { GenericoService } from '@/services/generico.service'
import { Prisma } from '@prisma/client'

const genericoService = new GenericoService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const generico = await genericoService.findOne(params.id)
    if (!generico) {
      return NextResponse.json({ error: 'Generico not found' }, { status: 404 })
    }
    return NextResponse.json(generico)
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
    const generico = await genericoService.update(params.id, data)
    return NextResponse.json(generico)
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
    await genericoService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
