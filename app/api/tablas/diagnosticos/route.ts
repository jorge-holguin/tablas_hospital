import { NextRequest, NextResponse } from 'next/server'
import { DiagnosticoService } from '@/services/diagnostico.service'
import { Prisma } from '@prisma/client'

const diagnosticoService = new DiagnosticoService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    
    let where: Prisma.oeiDiagnosticoDetalleWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { Codigo: { contains: search } },
          { Descripcion: { contains: search } },
          { CodigoCIE9: { contains: search } }
        ]
      }
    }
    
    console.log('Filtros aplicados:', where)
    
    const diagnosticos = await diagnosticoService.findAll({ take, skip, where })
    console.log('Diagnósticos recuperados:', diagnosticos.length)
    
    return NextResponse.json(diagnosticos)
  } catch (error) {
    console.error('Error fetching diagnosticos:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const diagnostico = await diagnosticoService.create(data)
    return NextResponse.json(diagnostico, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
