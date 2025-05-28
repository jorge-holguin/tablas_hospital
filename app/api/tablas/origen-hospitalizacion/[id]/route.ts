import { NextRequest, NextResponse } from 'next/server'
import { OrigenHospitalizacionService } from '@/services/origen-hospitalizacion.service'

const origenHospitalizacionService = new OrigenHospitalizacionService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const origen = await origenHospitalizacionService.findOne(params.id)
    if (!origen) {
      return NextResponse.json({ error: 'Origen de hospitalización no encontrado' }, { status: 404 })
    }
    return NextResponse.json(origen)
  } catch (error) {
    console.error('Error fetching origen de hospitalización:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
