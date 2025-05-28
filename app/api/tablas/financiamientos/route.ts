import { NextRequest, NextResponse } from 'next/server'
import { FinanciaService } from '@/services/financia.service'

const financiaService = new FinanciaService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    
    let where: any = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { FINANCIA: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    const financiamientos = await financiaService.findAll({ take, skip, where })
    return NextResponse.json(financiamientos)
  } catch (error) {
    console.error('Error fetching financiamientos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const financiamiento = await financiaService.create(data)
    return NextResponse.json(financiamiento, { status: 201 })
  } catch (error) {
    console.error('Error creating financiamiento:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}
