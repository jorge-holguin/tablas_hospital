import { NextRequest, NextResponse } from 'next/server'
import { OrigenHospitalizacionService } from '@/services/origen-hospitalizacion.service'

const origenHospitalizacionService = new OrigenHospitalizacionService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    
    const origenes = await origenHospitalizacionService.findAll({ take, skip, search })
    return NextResponse.json(origenes)
  } catch (error) {
    console.error('Error fetching origenes de hospitalización:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
