import { NextRequest, NextResponse } from 'next/server'
import { PersonalService } from '@/services/personal.service'
import { Prisma } from '@prisma/client'

const personalService = new PersonalService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.PERSONAL_BORRARWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { NOMBRE: { contains: search } },
          { PERSONAL: { contains: search } }
        ]
      }
    }
    
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const count = await personalService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting medicos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

