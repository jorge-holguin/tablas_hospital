import { NextRequest, NextResponse } from 'next/server'
import { FamiliaService } from '@/services/familia.service'
import { Prisma } from '@prisma/client'

const familiaService = new FamiliaService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    
    let where: Prisma.FAMILIAWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { FAMILIA: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    const count = await familiaService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting familias:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
