import { NextRequest, NextResponse } from 'next/server'
import { EntidadService } from '@/services/entidad.service'
import { Prisma } from '@prisma/client'

const entidadService = new EntidadService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: any = {}
    
    // Añadir filtro de búsqueda si se proporciona
    if (search) {
      where = {
        OR: [
          { ENTIDADSIS: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Añadir filtro de estado si se proporciona
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ESTADO: active === 'true' ? '1' : '0'
      }
    }
    
    const count = await entidadService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting Entidades:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
