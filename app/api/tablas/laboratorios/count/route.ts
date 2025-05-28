import { NextRequest, NextResponse } from 'next/server'
import { LaboratorioService } from '@/services/laboratorio.service'
import { Prisma } from '@prisma/client'

const laboratorioService = new LaboratorioService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.LABORATORIOWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { LABORATORIO: { contains: search } },
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
    
    const count = await laboratorioService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting laboratorios:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
