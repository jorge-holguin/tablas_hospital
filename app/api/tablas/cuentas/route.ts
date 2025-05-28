import { NextRequest, NextResponse } from 'next/server'
import { CuentaService } from '@/services/cuenta.service'

const cuentaService = new CuentaService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'CUENTAID'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'
    
    console.log('API GET /cuentas con parámetros:', { take, skip, search, orderBy, orderDirection })
    
    const cuentas = await cuentaService.findAll({ 
      take, 
      skip, 
      search, 
      orderBy, 
      orderDirection 
    })
    
    return NextResponse.json(cuentas)
  } catch (error) {
    console.error('Error en GET /cuentas:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log('API POST /cuentas con datos:', data)
    
    // Validar campos requeridos
    if (!data.CUENTAID || !data.PACIENTE || !data.SEGURO || !data.EMPRESASEGURO || !data.NOMBRE || !data.ORIGEN) {
      return NextResponse.json({ 
        error: 'Faltan campos requeridos: CUENTAID, PACIENTE, SEGURO, EMPRESASEGURO, NOMBRE y ORIGEN son obligatorios' 
      }, { status: 400 })
    }
    
    const cuenta = await cuentaService.create(data)
    return NextResponse.json(cuenta, { status: 201 })
  } catch (error) {
    console.error('Error en POST /cuentas:', error instanceof Error ? error.message : 'Error desconocido')
    
    if (error instanceof Error && error.message.includes('Ya existe')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
