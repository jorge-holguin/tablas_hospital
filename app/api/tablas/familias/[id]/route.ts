import { NextRequest, NextResponse } from 'next/server'
import { FamiliaService } from '@/services/familia.service'
import { Prisma } from '@prisma/client'

const familiaService = new FamiliaService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const familia = await familiaService.findOne(params.id)
    if (!familia) {
      return NextResponse.json({ error: 'Familia no encontrada' }, { status: 404 })
    }
    return NextResponse.json(familia)
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
    const familia = await familiaService.update(params.id, data)
    return NextResponse.json(familia)
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
    await familiaService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
