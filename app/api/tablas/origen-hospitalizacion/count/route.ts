import { NextRequest, NextResponse } from 'next/server'
import { OrigenHospitalizacionService } from '@/services/origen-hospitalizacion.service'

const origenHospitalizacionService = new OrigenHospitalizacionService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    
    const count = await origenHospitalizacionService.count({ search })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting origenes de hospitalización:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
