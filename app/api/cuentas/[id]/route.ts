import { NextRequest, NextResponse } from 'next/server'
import { CuentaService } from '@/services/cuenta.service'
import { Prisma } from '@prisma/client'

const cuentaService = new CuentaService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cuenta = await cuentaService.findOne(params.id)
    if (!cuenta) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }
    return NextResponse.json(cuenta)
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
    const cuenta = await cuentaService.update(params.id, data)
    return NextResponse.json(cuenta)
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
    await cuentaService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
