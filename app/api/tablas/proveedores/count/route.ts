import { NextRequest, NextResponse } from 'next/server'
import { ProveedorService } from '@/services/proveedor.service'

const proveedorService = new ProveedorService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
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

    const count = await proveedorService.count({
      where: whereClause
    })

    return NextResponse.json({ count })
  } catch (error: any) {
    console.error('Error en GET /api/tablas/proveedores/count:', error)
    return NextResponse.json(
      { error: 'Error al contar los proveedores', details: error.message },
      { status: 500 }
    )
  }
}
