import { NextRequest, NextResponse } from 'next/server'
import { ItemService } from '@/services/item.service'
import { Prisma } from '@prisma/client'

const itemService = new ItemService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || searchParams.get('searchTerm') || ''
    const activeFilter = searchParams.get('activeFilter') !== null ? Number(searchParams.get('activeFilter')) : null
    const orderByParam = searchParams.get('orderBy') || 'ACTIVO:desc,NOMBRE:asc'
    
    console.log('API Request params:', { take, skip, search, activeFilter, orderByParam })
    
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
    
    // Parse orderBy parameter
    let orderByArray: any[] = []
    
    if (orderByParam) {
      const orderByFields = orderByParam.split(',')
      
      for (const field of orderByFields) {
        const [key, direction] = field.split(':')
        if (key && (direction === 'asc' || direction === 'desc')) {
          orderByArray.push({ [key]: direction })
        }
      }
    }
    
    // If no valid orderBy fields were provided, use default ordering
    if (orderByArray.length === 0) {
      orderByArray.push({ ACTIVO: 'desc' }, { NOMBRE: 'asc' })
    }
    
    console.log('Query where condition:', JSON.stringify(where))
    console.log('Query orderBy:', JSON.stringify(orderByArray))
    
    const items = await itemService.findAll({ 
      take, 
      skip, 
      where,
      orderBy: orderByArray as Prisma.Enumerable<Prisma.ITEMOrderByWithRelationInput>
    })
    console.log(`Found ${items ? items.length : 0} items`)
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error in items API:', error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : ''
    
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const item = await itemService.create(data)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: errorMessage 
    }, { status: 500 })
  }
}
