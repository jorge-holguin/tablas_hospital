import { NextRequest, NextResponse } from 'next/server'
import { AlmacenService } from '@/services/almacen.service'
import { Prisma } from '@prisma/client'

const almacenService = new AlmacenService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.ALMACENWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { ALMACEN: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === '1' ? 1 : 0
      }
    }
    
    const count = await almacenService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting almacenes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
