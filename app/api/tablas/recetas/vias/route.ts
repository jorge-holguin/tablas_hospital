import { NextRequest, NextResponse } from 'next/server'
import { RecetaService } from '@/services/receta.service'

const recetaService = new RecetaService()

export async function GET(req: NextRequest) {
  try {
    const vias = await recetaService.getVias()
    return NextResponse.json(vias)
  } catch (error) {
    console.error('Error en GET /api/farmacia/recetas/vias:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener vías de administración' },
      { status: 500 }
    )
  }
}
