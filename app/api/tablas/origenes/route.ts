import { NextRequest, NextResponse } from 'next/server'
import { OrigenService } from '@/services/origen.service'

const origenService = new OrigenService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'ORIGEN'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'
    
    const origenes = await origenService.findAll({ 
      take, 
      skip, 
      search,
      orderBy,
      orderDirection
    })
    
    return NextResponse.json(origenes)
  } catch (error) {
    console.error('Error fetching origenes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const origen = await origenService.create(data)
    return NextResponse.json(origen, { status: 201 })
  } catch (error) {
    console.error('Error creating origen:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
