import { NextRequest, NextResponse } from 'next/server'
import { PresentacionService } from '@/services/presentacion.service'
import { Prisma } from '@prisma/client'

const presentacionService = new PresentacionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const take = Number(searchParams.get('take')) || 10
    const skip = Number(searchParams.get('skip')) || 0

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

    const presentaciones = await presentacionService.findAll({
      skip,
      take,
      where: whereClause,
      orderBy: { PRESENTACION: 'asc' },
    })

    return NextResponse.json(presentaciones)
  } catch (error) {
    console.error('Error fetching presentaciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener las presentaciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.PRESENTACION || !body.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos PRESENTACION y NOMBRE son requeridos' },
        { status: 400 }
      )
    }

    // Convertir ACTIVO a Decimal si es necesario
    if (body.ACTIVO !== undefined) {
      body.ACTIVO = new Prisma.Decimal(body.ACTIVO)
    }

    const newPresentacion = await presentacionService.create(body)
    
    return NextResponse.json(newPresentacion, { status: 201 })
  } catch (error) {
    console.error('Error creating presentacion:', error)
    
    // Manejar error de clave duplicada
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una presentación con ese código' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear la presentación' },
      { status: 500 }
    )
  }
}
