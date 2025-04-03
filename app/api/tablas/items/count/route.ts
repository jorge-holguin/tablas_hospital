import { NextRequest, NextResponse } from 'next/server'
import { ItemService } from '@/services/item.service'
import { Prisma } from '@prisma/client'

const itemService = new ItemService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    
    let where = {}
    if (search) {
      where = {
        OR: [
          { ITEM: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    const count = await itemService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting items:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
