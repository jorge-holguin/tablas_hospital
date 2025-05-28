import { NextRequest, NextResponse } from 'next/server'
import { TipoTransaccionService } from '@/services/tipo-transaccion.service'
import { Prisma } from '@prisma/client'

const tipoTransaccionService = new TipoTransaccionService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.TIPO_TRANSACCIONWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { TIPO_TRANSACCION: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true' ? new Prisma.Decimal(1) : new Prisma.Decimal(0)
      }
    }
    
    const count = await tipoTransaccionService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting tipos de transacción:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
