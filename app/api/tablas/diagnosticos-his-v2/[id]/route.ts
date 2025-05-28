import { NextRequest, NextResponse } from 'next/server'
import { CiexhisV2Service } from '@/services/ciexhis-v2.service'
import { Prisma } from '@prisma/client'

const ciexhisV2Service = new CiexhisV2Service()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    const diagnostico = await ciexhisV2Service.findOne(id)
    if (!diagnostico) {
      return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 })
    }
    return NextResponse.json(diagnostico)
  } catch (error) {
    console.error(`Error en GET /api/tablas/diagnosticos-his-v2/${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Error al obtener diagnóstico", error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    const data = await req.json()
    const diagnostico = await ciexhisV2Service.update(id, data)
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
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    await ciexhisV2Service.delete(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
