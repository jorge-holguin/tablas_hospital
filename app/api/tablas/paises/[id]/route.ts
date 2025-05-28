import { NextRequest, NextResponse } from 'next/server'
import { PaisService } from '@/services/pais.service'
import { Prisma } from '@prisma/client'

const paisService = new PaisService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pais = await paisService.findOne(params.id)
    if (!pais) {
      return NextResponse.json({ error: 'Pais no encontrado' }, { status: 404 })
    }
    return NextResponse.json(pais)
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
    const pais = await paisService.update(params.id, data)
    return NextResponse.json(pais)
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
    await paisService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
