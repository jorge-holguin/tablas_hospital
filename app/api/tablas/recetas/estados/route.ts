import { NextRequest, NextResponse } from 'next/server'
import { RecetaService } from '@/services/receta.service'

const recetaService = new RecetaService()

export async function GET(req: NextRequest) {
  try {
    const estados = await recetaService.getEstados()
    return NextResponse.json(estados)
  } catch (error) {
    console.error('Error en GET /api/farmacia/recetas/estados:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener estados de recetas' },
      { status: 500 }
    )
  }
}
