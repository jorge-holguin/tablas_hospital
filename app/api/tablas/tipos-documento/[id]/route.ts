import { NextRequest, NextResponse } from 'next/server'
import { TipoDocumentoService } from '@/services/tipo-documento.service'
import { Prisma } from '@prisma/client'

const tipoDocumentoService = new TipoDocumentoService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tipoDocumento = await tipoDocumentoService.findOne(params.id)
    if (!tipoDocumento) {
      return NextResponse.json({ error: 'Tipo de documento no encontrado' }, { status: 404 })
    }
    return NextResponse.json(tipoDocumento)
  } catch (error) {
    console.error(`Error en GET /api/tipos-documento/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al obtener tipo de documento", error: String(error) },
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
    const tipoDocumento = await tipoDocumentoService.update(params.id, data)
    return NextResponse.json(tipoDocumento)
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
    await tipoDocumentoService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
