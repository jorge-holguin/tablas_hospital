import { NextRequest, NextResponse } from 'next/server'
import { DiagnosticoService } from '@/services/diagnostico.service'
import { Prisma } from '@prisma/client'

const diagnosticoService = new DiagnosticoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.oeiDiagnosticoDetalleWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { Codigo: { contains: search } },
          { Descripcion: { contains: search } },
          { CodigoCIE9: { contains: search } }
        ]
      }
    }
    
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true'
      }
    }
    
    const count = await diagnosticoService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting diagnosticos:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
    