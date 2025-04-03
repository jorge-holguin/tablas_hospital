import { NextRequest, NextResponse } from 'next/server'
import { CuentaService } from '@/services/cuenta.service'
import { Prisma } from '@prisma/client'

const cuentaService = new CuentaService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    
    const cuentas = await cuentaService.findAll({ take, skip })
    return NextResponse.json(cuentas)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const cuenta = await cuentaService.create(data)
    return NextResponse.json(cuenta, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Nota: Para PUT y DELETE necesitarás crear rutas dinámicas en app/api/cuentas/[id]/route.ts
