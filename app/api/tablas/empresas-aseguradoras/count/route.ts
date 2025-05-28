import { NextRequest, NextResponse } from 'next/server'
import { EmpresaSeguroService } from '@/services/empresaSeguro.service'
import { Prisma } from '@prisma/client'

const empresaSeguroService = new EmpresaSeguroService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.EMPRESASEGUROWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { EMPRESASEGURO: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const count = await empresaSeguroService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting empresas aseguradoras:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
