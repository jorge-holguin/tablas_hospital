import { NextRequest, NextResponse } from 'next/server'
import { GrupoLiquidacionService } from '@/services/grupo-liquidacion.service'

const grupoLiquidacionService = new GrupoLiquidacionService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const grupo = await grupoLiquidacionService.findOne(id)

    if (!grupo) {
      return NextResponse.json(
        { error: `No se encontró el grupo de liquidación con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(grupo)
  } catch (error) {
    console.error(`Error en GET /api/tablas/grupo-liquidacion/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener el grupo de liquidación' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await req.json()

    // Verificar que el grupo existe
    const existingGrupo = await grupoLiquidacionService.findOne(id)
    if (!existingGrupo) {
      return NextResponse.json(
        { error: `No se encontró el grupo de liquidación con ID: ${id}` },
        { status: 404 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    if (data.ACTIVO !== undefined) data.ACTIVO = Number(data.ACTIVO)

    const updatedGrupo = await grupoLiquidacionService.update(id, data)
    return NextResponse.json(updatedGrupo)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/grupo-liquidacion/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el grupo de liquidación' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Verificar que el grupo existe
    const existingGrupo = await grupoLiquidacionService.findOne(id)
    if (!existingGrupo) {
      return NextResponse.json(
        { error: `No se encontró el grupo de liquidación con ID: ${id}` },
        { status: 404 }
      )
    }

    await grupoLiquidacionService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/grupo-liquidacion/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar el grupo de liquidación' },
      { status: 500 }
    )
  }
}
