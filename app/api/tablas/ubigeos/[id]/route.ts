import { NextRequest, NextResponse } from 'next/server'
import { UbigeoService } from '@/services/ubigeo.service'
import { Prisma } from '@prisma/client'

const ubigeoService = new UbigeoService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ubigeo = await ubigeoService.findOne(params.id)
    if (!ubigeo) {
      return NextResponse.json({ error: 'Ubigeo no encontrado' }, { status: 404 })
    }
    return NextResponse.json(ubigeo)
  } catch (error) {
    console.error(`Error en GET /api/tablas/ubigeos/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al obtener ubigeo", error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    const ubigeo = await ubigeoService.update(params.id, data)
    return NextResponse.json(ubigeo)
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
    await ubigeoService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
