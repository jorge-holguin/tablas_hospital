import { NextRequest, NextResponse } from 'next/server'
import { TarifarioService } from '@/services/tarifario.service'
import { Prisma } from '@prisma/client'

const tarifarioService = new TarifarioService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tarifario = await tarifarioService.findOne(params.id)
    if (!tarifario) {
      return NextResponse.json({ error: 'Tarifario no encontrado' }, { status: 404 })
    }
    return NextResponse.json(tarifario)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error fetching tarifario ${params.id}:`, errorMessage)
    return NextResponse.json({ 
      error: 'Error al obtener datos del tarifario',
      details: errorMessage
    }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    // Note: The tarifario service doesn't have an update method yet
    // This would need to be implemented in the service
    // const tarifario = await tarifarioService.update(params.id, data)
    return NextResponse.json({ message: "Método no implementado" }, { status: 501 })
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
    // Note: The tarifario service doesn't have a delete method yet
    // This would need to be implemented in the service
    // await tarifarioService.delete(params.id)
    return NextResponse.json({ message: "Método no implementado" }, { status: 501 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
