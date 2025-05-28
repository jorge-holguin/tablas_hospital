import { NextRequest, NextResponse } from 'next/server'
import { GrupoRecaudacionService } from '@/services/grupo-recaudacion.service'

const grupoRecaudacionService = new GrupoRecaudacionService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const grupo = await grupoRecaudacionService.findOne(id)

    if (!grupo) {
      return NextResponse.json(
        { error: `No se encontró el grupo de recaudación con ID: ${id}` },
        { status: 404 }
      )
    }

    return NextResponse.json(grupo)
  } catch (error) {
    console.error(`Error en GET /api/tablas/grupo-recaudacion/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener el grupo de recaudación' },
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
    const existingGrupo = await grupoRecaudacionService.findOne(id)
    if (!existingGrupo) {
      return NextResponse.json(
        { error: `No se encontró el grupo de recaudación con ID: ${id}` },
        { status: 404 }
      )
    }

    // Asegurarse de que los campos numéricos sean números
    if (data.ACTIVO !== undefined) data.ACTIVO = Number(data.ACTIVO)
    if (data.GENERAORDEN !== undefined) data.GENERAORDEN = Number(data.GENERAORDEN)
    if (data.CONTROLASTOCK !== undefined) data.CONTROLASTOCK = Number(data.CONTROLASTOCK)
    if (data.CONTROLPACIENTE !== undefined) data.CONTROLPACIENTE = Number(data.CONTROLPACIENTE)

    const updatedGrupo = await grupoRecaudacionService.update(id, data)
    return NextResponse.json(updatedGrupo)
  } catch (error) {
    console.error(`Error en PUT /api/tablas/grupo-recaudacion/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el grupo de recaudación' },
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
    const existingGrupo = await grupoRecaudacionService.findOne(id)
    if (!existingGrupo) {
      return NextResponse.json(
        { error: `No se encontró el grupo de recaudación con ID: ${id}` },
        { status: 404 }
      )
    }

    await grupoRecaudacionService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error en DELETE /api/tablas/grupo-recaudacion/${params.id}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar el grupo de recaudación' },
      { status: 500 }
    )
  }
}
