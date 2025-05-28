import { NextRequest, NextResponse } from 'next/server'
import { EspecialidadService } from '@/services/especialidad.service'
import { Prisma } from '@prisma/client'

const especialidadService = new EspecialidadService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.ESPECIALIDADWhereInput = {}
    
    // Añadir filtro de búsqueda si se proporciona
    if (search) {
      where = {
        OR: [
          { ESPECIALIDAD: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Añadir filtro de activo si se proporciona
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true' ? new Prisma.Decimal(1) : new Prisma.Decimal(0)
      }
    }
    
    const count = await especialidadService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting especialidades:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
