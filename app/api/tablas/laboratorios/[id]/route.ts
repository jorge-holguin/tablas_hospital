import { NextRequest, NextResponse } from 'next/server'
import { LaboratorioService } from '@/services/laboratorio.service'
import { Prisma } from '@prisma/client'

const laboratorioService = new LaboratorioService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const laboratorio = await laboratorioService.findOne(params.id)
    if (!laboratorio) {
      return NextResponse.json({ error: 'Laboratorio not found' }, { status: 404 })
    }
    return NextResponse.json(laboratorio)
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
    const laboratorio = await laboratorioService.update(params.id, data)
    return NextResponse.json(laboratorio)
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
    await laboratorioService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
