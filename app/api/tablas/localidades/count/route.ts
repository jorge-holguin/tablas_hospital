import { NextRequest, NextResponse } from 'next/server'
import { LocalidadService } from '@/services/localidad.service'
import { Prisma } from '@prisma/client'

const localidadService = new LocalidadService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    let where: Prisma.LOCALIDADWhereInput = {}
    
    // Add search filter if provided
    if (searchTerm) {
      where = {
        OR: [
          { Localidad: { contains: searchTerm } },
          { Nombre: { contains: searchTerm } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        Activo: active === 'true' ? 1 : 0
      }
    }
    
    const count = await localidadService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting localidades:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
