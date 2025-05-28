import { NextRequest, NextResponse } from 'next/server'
import { CuentaService } from '@/services/cuenta.service'

const cuentaService = new CuentaService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API GET /cuentas/${params.id}`)
    
    const cuenta = await cuentaService.findOne(params.id)
    if (!cuenta) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json(cuenta)
  } catch (error) {
    console.error(`Error en GET /cuentas/${params.id}:`, error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    console.log(`API PUT /cuentas/${params.id} con datos:`, data)
    
    const cuenta = await cuentaService.update(params.id, data)
    
    return NextResponse.json(cuenta)
  } catch (error) {
    console.error(`Error en PUT /cuentas/${params.id}:`, error instanceof Error ? error.message : 'Error desconocido')
    
    if (error instanceof Error && error.message.includes('No existe')) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API DELETE /cuentas/${params.id}`)
    
    await cuentaService.delete(params.id)
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error en DELETE /cuentas/${params.id}:`, error instanceof Error ? error.message : 'Error desconocido')
    
    if (error instanceof Error) {
      if (error.message.includes('No existe')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      if (error.message.includes('No se puede eliminar')) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
