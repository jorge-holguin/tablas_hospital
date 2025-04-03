import { NextRequest, NextResponse } from 'next/server'
import { PrecioService } from '@/services/precio.service'
import { Prisma } from '@prisma/client'

const precioService = new PrecioService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const item = searchParams.get('item')
    
    let where = {}
    if (item) {
      where = { ITEM: item }
    }
    
    const count = await precioService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting precios:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
