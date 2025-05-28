import { NextRequest, NextResponse } from 'next/server'
import { TipoTransaccionService } from '@/services/tipo-transaccion.service'
import { Prisma } from '@prisma/client'

const tipoTransaccionService = new TipoTransaccionService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tipoTransaccion = await tipoTransaccionService.findOne(params.id)
    if (!tipoTransaccion) {
      return NextResponse.json({ error: 'Tipo de transacción no encontrado' }, { status: 404 })
    }
    return NextResponse.json(tipoTransaccion)
  } catch (error) {
    console.error('Error fetching tipo de transacción:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
