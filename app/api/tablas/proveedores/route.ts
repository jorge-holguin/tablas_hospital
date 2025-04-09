import { NextRequest, NextResponse } from 'next/server'
import { ProveedorService } from '@/services/proveedor.service'

const proveedorService = new ProveedorService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const take = Number(searchParams.get('take') || '10')
    const skip = Number(searchParams.get('skip') || '0')
    const search = searchParams.get('search')
    const active = searchParams.get('active')

    // Construir el filtro de búsqueda
    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { PROVEEDOR: { contains: search, mode: 'insensitive' } },
        { NOMBRE: { contains: search, mode: 'insensitive' } },
        { RUC: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (active !== null && active !== undefined) {
      // Ensure ACTIVO is properly compared as a Decimal type
      whereClause.ACTIVO = active === '1' ? 1 : 0
    }

    const proveedores = await proveedorService.findAll({
      take,
      skip,
      where: whereClause,
      orderBy: { PROVEEDOR: 'asc' }
    })

    return NextResponse.json(proveedores)
  } catch (error: any) {
    console.error('Error en GET /api/tablas/proveedores:', error)
    return NextResponse.json(
      { error: 'Error al obtener los proveedores', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Asegurar que ACTIVO sea un número
    if (body.ACTIVO !== undefined) {
      body.ACTIVO = Number(body.ACTIVO)
    }
    
    const proveedor = await proveedorService.create(body)
    return NextResponse.json(proveedor, { status: 201 })
  } catch (error: any) {
    console.error('Error en POST /api/tablas/proveedores:', error)
    return NextResponse.json(
      { error: 'Error al crear el proveedor', details: error.message },
      { status: 500 }
    )
  }
}
