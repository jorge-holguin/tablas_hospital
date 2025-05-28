import { NextRequest, NextResponse } from 'next/server'
import { ProveedorService } from '@/services/proveedor.service'
import { Prisma } from '@prisma/client'

const proveedorService = new ProveedorService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.PROVEEDORWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { PROVEEDOR: { contains: search } },
          { NOMBRE: { contains: search } },
          { RUC: { contains: search } }
        ]
      }
    }
    
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const count = await proveedorService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting proveedores:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
