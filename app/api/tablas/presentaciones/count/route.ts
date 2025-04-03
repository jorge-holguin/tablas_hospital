import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    // Construir la consulta de búsqueda
    let whereClause: Prisma.PRESENTACIONWhereInput = {}
    
    if (search) {
      whereClause = {
        OR: [
          { PRESENTACION: { contains: search } },
          { NOMBRE: { contains: search } },
        ],
      }
    }

    const count = await prisma.pRESENTACION.count({
      where: whereClause,
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting presentaciones:', error)
    return NextResponse.json(
      { error: 'Error al contar las presentaciones' },
      { status: 500 }
    )
  }
}
