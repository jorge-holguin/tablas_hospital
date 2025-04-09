import { NextRequest, NextResponse } from "next/server"
import { IngresoService } from "@/services/ingreso.service"

const ingresoService = new IngresoService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const ingreso = await ingresoService.findOne(id)
    
    if (!ingreso) {
      return NextResponse.json({ error: "Ingreso no encontrado" }, { status: 404 })
    }
    
    return NextResponse.json(ingreso)
  } catch (error) {
    console.error("Error fetching ingreso:", error)
    return NextResponse.json({ error: "Error al obtener el ingreso" }, { status: 500 })
  }
}
