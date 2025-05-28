import { NextRequest, NextResponse } from 'next/server'
import { TipoTransaccionService } from '@/services/tipo-transaccion.service'
import { Prisma } from '@prisma/client'

const tipoTransaccionService = new TipoTransaccionService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.TIPO_TRANSACCIONWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { TIPO_TRANSACCION: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true' ? new Prisma.Decimal(1) : new Prisma.Decimal(0)
      }
    }
    
    const tiposTransaccion = await tipoTransaccionService.findAll({ take, skip, where })
    return NextResponse.json(tiposTransaccion)
  } catch (error) {
    console.error('Error fetching tipos de transacción:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
