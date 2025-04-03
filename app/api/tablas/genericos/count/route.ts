import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    // Construir la consulta de búsqueda
    let whereClause: Prisma.GENERICOWhereInput = {}
    
    if (search) {
      whereClause = {
        OR: [
          { GENERICO: { contains: search } },
          { NOMBRE: { contains: search } },
        ],
      }
    }

    const count = await prisma.gENERICO.count({
      where: whereClause,
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting genericos:', error)
    return NextResponse.json(
      { error: 'Error al contar los genéricos' },
      { status: 500 }
    )
  }
}
