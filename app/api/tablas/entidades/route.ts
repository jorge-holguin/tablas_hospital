import { NextRequest, NextResponse } from 'next/server'
import { EntidadService } from '@/services/entidad.service'
import { Prisma } from '@prisma/client'

const entidadService = new EntidadService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: any = {}
    
    // Añadir filtro de búsqueda si se proporciona
    if (search) {
      where = {
        OR: [
          { ENTIDADSIS: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Añadir filtro de estado si se proporciona
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ESTADO: active === 'true' ? '1' : '0'
      }
    }
    
    const entidades = await entidadService.findAll({ take, skip, where })
    
    // Obtener el conteo total para la paginación
    const count = await entidadService.count({ where })
    
    // Devolver datos con metadatos
    return NextResponse.json({
      data: entidades,
      meta: {
        total: count,
        page: Math.floor(skip / take) + 1,
        pageSize: take
      }
    })
  } catch (error) {
    console.error('Error fetching Entidades:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const Entidad = await entidadService.create(data)
    return NextResponse.json(Entidad, { status: 201 })
  } catch (error) {
    console.error('Error creating Entidad:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const { id, ...updateData } = data
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const updatedEntidad = await entidadService.update(id, updateData)
    return NextResponse.json(updatedEntidad)
  } catch (error) {
    console.error('Error updating Entidad:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    await entidadService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting Entidad:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
