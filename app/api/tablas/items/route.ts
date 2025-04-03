import { NextRequest, NextResponse } from 'next/server'
import { ItemService } from '@/services/item.service'
import { Prisma } from '@prisma/client'

const itemService = new ItemService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
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
    
    const items = await itemService.findAll({ take, skip, where })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const item = await itemService.create(data)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
