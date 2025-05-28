import { NextRequest, NextResponse } from 'next/server'
import { GradoInstruccionService } from '@/services/grado-instruccion.service'
import { Prisma } from '@prisma/client'

const gradoInstruccionService = new GradoInstruccionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    let where: Prisma.GRADO_INSTRUCCIONWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { CODIGO: { contains: searchTerm } },
          { NOMBRE: { contains: searchTerm } },
        ]
      }
    }
    
    const count = await gradoInstruccionService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting etnias:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
