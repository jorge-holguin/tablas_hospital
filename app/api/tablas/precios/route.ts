import { NextRequest, NextResponse } from 'next/server'
import { PrecioService } from '@/services/precio.service'
import { Prisma } from '@prisma/client'

const precioService = new PrecioService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const item = searchParams.get('item')
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const orderBy = searchParams.get('orderBy') || 'FECHA'
    const order = searchParams.get('order') || 'desc'
    
    let where: Prisma.PRECIOWhereInput = {}
    if (item) {
      where = { ITEM: item }
    }
    
    const precios = await precioService.findAll({ 
      skip, 
      take, 
      where,
      orderBy: { [orderBy]: order } as Prisma.PRECIOOrderByWithRelationInput
    })
    
    return NextResponse.json(precios)
  } catch (error) {
    console.error('Error fetching precios:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const precio = await precioService.create(data)
    return NextResponse.json(precio)
  } catch (error) {
    console.error('Error creating precio:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
