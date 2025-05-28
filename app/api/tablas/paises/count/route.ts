import { NextRequest, NextResponse } from 'next/server'
import { PaisService } from '@/services/pais.service'
import { Prisma } from '@prisma/client'

const paisService = new PaisService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    let where: Prisma.PAISWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { PAIS: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active === 'true' ? 1 : 0
      }
    }
    
    const count = await paisService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting paises:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
