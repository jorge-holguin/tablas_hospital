import { NextRequest, NextResponse } from 'next/server'
import { ConsultorioService } from '@/services/consultorio.service'
import { Prisma } from '@prisma/client'

const consultorioService = new ConsultorioService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    const tipo = searchParams.get('tipo')
    
    let where: Prisma.CONSULTORIOWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { CONSULTORIO: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    if (tipo !== null && tipo !== undefined) {
      where = {
        ...where,
        TIPO: tipo
      }
    }
    
    const count = await consultorioService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting consultorios:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
    