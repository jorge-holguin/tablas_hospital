import { NextRequest, NextResponse } from 'next/server'
import { EstadoCivilService } from '@/services/estado-civil.service'
import { Prisma } from '@prisma/client'

const estadoCivilService = new EstadoCivilService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    let where: Prisma.ESTADO_CIVILWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { ESTADO_CIVIL: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } },
          { RENIEC: { contains: searchTerm } }
        ]
      }
    }
    
    const count = await estadoCivilService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting estado civiles:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
