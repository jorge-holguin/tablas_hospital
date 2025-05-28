import { NextRequest, NextResponse } from 'next/server'
import { MedicoService } from '@/services/medico.service'
import { Prisma } from '@prisma/client'

const medicoService = new MedicoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.MEDICOWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { COLEGIO: { contains: search } },
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
    
    const count = await medicoService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting medicos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
