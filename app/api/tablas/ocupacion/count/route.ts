import { NextRequest, NextResponse } from 'next/server'
import { OcupacionService } from '@/services/ocupacion.service'
import { Prisma } from '@prisma/client'

const ocupacionService = new OcupacionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    let where: Prisma.OCUPACIONWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { OCUPACION: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } },
        ]
      }
    }
    
    const count = await ocupacionService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting etnias:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
