import { NextRequest, NextResponse } from 'next/server'
import { DiagnosticoService } from '@/services/diagnostico.service'
import { Prisma } from '@prisma/client'

const diagnosticoService = new DiagnosticoService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diagnostico = await diagnosticoService.findOne(params.id)
    if (!diagnostico) {
      return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 })
    }
    return NextResponse.json(diagnostico)
  } catch (error) {
    console.error('Error fetching diagnostico:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    const diagnostico = await diagnosticoService.update(params.id, data)
    return NextResponse.json(diagnostico)
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
    await diagnosticoService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
