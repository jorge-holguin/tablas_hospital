import { NextRequest, NextResponse } from 'next/server'
import { PacienteService } from '@/services/paciente.service'

const pacienteService = new PacienteService()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    const count = await pacienteService.count({ 
      search
    })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error en GET /api/tablas/paciente/count:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al contar pacientes' },
      { status: 500 }
    )
  }
}
