import { NextRequest, NextResponse } from 'next/server'
import { ClaseService } from '@/services/clase.service'
import { Prisma } from '@prisma/client'

const claseService = new ClaseService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.CLASEWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { CLASE: { contains: search } },
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
    
    const count = await claseService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting clases:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
