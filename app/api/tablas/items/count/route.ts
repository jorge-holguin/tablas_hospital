import { NextRequest, NextResponse } from 'next/server'
import { ItemService } from '@/services/item.service'
import { Prisma } from '@prisma/client'

const itemService = new ItemService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const activeFilter = searchParams.get('activeFilter') !== null ? Number(searchParams.get('activeFilter')) : null
    
    let where: Prisma.ITEMWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { ITEM: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (activeFilter !== null) {
      where = {
        ...where,
        ACTIVO: activeFilter
      }
    }
    
    console.log('Count API where condition:', JSON.stringify(where))
    
    const count = await itemService.count({ where })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting items:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
