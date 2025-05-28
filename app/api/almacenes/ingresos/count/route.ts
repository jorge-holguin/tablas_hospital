import { NextRequest, NextResponse } from 'next/server'
import { IngresoService } from '@/services/ingreso.service'
import { Prisma } from '@prisma/client'

const ingresoService = new IngresoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.INGRESOCWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { INGRESOID: { contains: search } },
          { ALMACEN: { contains: search } }
        ]
      }
    }
    
    const count = await ingresoService.count(where)
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting almacenes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
