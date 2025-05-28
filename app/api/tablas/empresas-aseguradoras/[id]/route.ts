import { NextRequest, NextResponse } from 'next/server'
import { EmpresaSeguroService } from '@/services/empresaSeguro.service'
import { Prisma } from '@prisma/client'

const empresaSeguroService = new EmpresaSeguroService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const empresaSeguro = await empresaSeguroService.findOne(params.id)
    if (!empresaSeguro) {
      return NextResponse.json({ error: 'Empresa aseguradora no encontrada' }, { status: 404 })
    }
    return NextResponse.json(empresaSeguro)
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
    const empresaSeguro = await empresaSeguroService.update(params.id, data)
    return NextResponse.json(empresaSeguro)
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
    await empresaSeguroService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
