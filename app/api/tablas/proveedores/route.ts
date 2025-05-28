import { NextRequest, NextResponse } from 'next/server'
import { ProveedorService } from '@/services/proveedor.service'
import { Prisma } from '@prisma/client'

const proveedorService = new ProveedorService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.PROVEEDORWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { PROVEEDOR: { contains: search } },
          { NOMBRE: { contains: search } },
          { RUC: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const proveedores = await proveedorService.findAll({ take, skip, where })
    return NextResponse.json(proveedores)
  } catch (error) {
    console.error('Error fetching proveedores:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const proveedor = await proveedorService.create(data)
    return NextResponse.json(proveedor, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
