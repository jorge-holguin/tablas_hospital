import { NextRequest, NextResponse } from 'next/server'
import { ConsultorioService } from '@/services/consultorio.service'
import { Prisma } from '@prisma/client'

const consultorioService = new ConsultorioService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultorio = await consultorioService.findOne(params.id)
    if (!consultorio) {
      return NextResponse.json({ error: 'Consultorio no encontrado' }, { status: 404 })
    }
    return NextResponse.json(consultorio)
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
    const consultorio = await consultorioService.update(params.id, data)
    return NextResponse.json(consultorio)
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
    await consultorioService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
