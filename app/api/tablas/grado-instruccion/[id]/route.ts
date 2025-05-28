import { NextRequest, NextResponse } from 'next/server'
import { GradoInstruccionService } from '@/services/grado-instruccion.service'
import { Prisma } from '@prisma/client'

const gradoInstruccionService = new GradoInstruccionService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gradoInstruccion = await gradoInstruccionService.findOne(params.id)
    if (!gradoInstruccion) {
      return NextResponse.json({ error: 'Grado de Instrucción no encontrado' }, { status: 404 })
    }
    return NextResponse.json(gradoInstruccion)
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
    const gradoInstruccion = await gradoInstruccionService.update(params.id, data)
    return NextResponse.json(gradoInstruccion)
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
    await estadoCivilService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
