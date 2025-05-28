import { NextRequest, NextResponse } from 'next/server'
import { TipoAtencionService } from '@/services/tipo-atencion.service'
import { Prisma } from '@prisma/client'

const tipoAtencionService = new TipoAtencionService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.TIPO_ATENCIONWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { TIPO_ATENCION: { contains: search } },
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
    
    const count = await tipoAtencionService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting tipo de atenciones:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
