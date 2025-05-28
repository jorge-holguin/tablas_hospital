import { NextRequest, NextResponse } from 'next/server'
import { CiexhisV2Service } from '@/services/ciexhis-v2.service'
import { Prisma } from '@prisma/client'

const ciexhisV2Service = new CiexhisV2Service()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const estado = searchParams.get('estado')
    const clase = searchParams.get('clase')
    const tipo = searchParams.get('tipo')
    
    let where: Prisma.CIEXHIS_V2WhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { CODIGO: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Add estado filter if provided
    if (estado !== null && estado !== undefined) {
      where = {
        ...where,
        EST: estado
      }
    }
    
    // Add clase filter if provided
    if (clase !== null && clase !== undefined) {
      where = {
        ...where,
        CLASE: clase
      }
    }
    
    // Add tipo filter if provided
    if (tipo !== null && tipo !== undefined) {
      where = {
        ...where,
        TIPO: tipo
      }
    }
    
    const diagnosticos = await ciexhisV2Service.findAll({ take, skip, where })
    return NextResponse.json(diagnosticos)
  } catch (error) {
    console.error('Error fetching diagnósticos HIS V2:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const diagnostico = await ciexhisV2Service.create(data)
    return NextResponse.json(diagnostico, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
