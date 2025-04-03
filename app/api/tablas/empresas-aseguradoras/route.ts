import { NextRequest, NextResponse } from 'next/server'
import { EmpresaSeguroService } from '@/services/empresaSeguro.service'
import { Prisma } from '@prisma/client'

const empresaSeguroService = new EmpresaSeguroService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    
    const empresasAseguradoras = await empresaSeguroService.findAll({ take, skip })
    return NextResponse.json(empresasAseguradoras)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const empresaAseguradora = await empresaSeguroService.create(data)
    return NextResponse.json(empresaAseguradora, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
