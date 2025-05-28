import { NextRequest, NextResponse } from 'next/server'
import { CuentaService } from '@/services/cuenta.service'

const cuentaService = new CuentaService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    
    console.log('API GET /cuentas/count con parámetros:', { search })
    
    const count = await cuentaService.count({ search })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /cuentas/count:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
