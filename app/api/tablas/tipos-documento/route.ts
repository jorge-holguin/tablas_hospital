import { NextRequest, NextResponse } from 'next/server'
import { TipoDocumentoService } from '@/services/tipo-documento.service'
import { Prisma } from '@prisma/client'

const tipoDocumentoService = new TipoDocumentoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.TIPO_DOCUMENTOWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { TIPO_DOCUMENTO: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const tiposDocumento = await tipoDocumentoService.findAll({ take, skip, where })
    return NextResponse.json(tiposDocumento)
  } catch (error) {
    console.error("Error en GET /api/tipos-documento:", error)
    return NextResponse.json(
      { success: false, message: "Error al obtener tipos de documento", error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const tipoDocumento = await tipoDocumentoService.create(data)
    return NextResponse.json(tipoDocumento, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
