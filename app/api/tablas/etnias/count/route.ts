import { NextRequest, NextResponse } from 'next/server'
import { EtniaService } from '@/services/etnia.service'
import { Prisma } from '@prisma/client'

const etniaService = new EtniaService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    let where: Prisma.EtniaWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { CODIGO: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } },
        ]
      }
    }
    
    const count = await etniaService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting etnias:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
