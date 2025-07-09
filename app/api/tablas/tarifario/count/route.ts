import { NextRequest, NextResponse } from 'next/server'
import { TarifarioService } from '@/services/tarifario.service'
import { Prisma } from '@prisma/client'

const tarifarioService = new TarifarioService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    
    let where: any = {}
    
    if (search) {
      where = {
        ITEM: { contains: search },
        NOMBRE: { contains: search },
        CPMS: { contains: search }
      }
    }
    
    const count = await tarifarioService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting tarifarios:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      error: 'Error al contar tarifarios',
      details: errorMessage
    }, { status: 500 })
  }
}
