import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 100
    
    console.log('API GET /selectores/pacientes con parámetros:', { search, limit })
    
    // Consulta SQL para obtener pacientes con búsqueda
    const query = `
      SELECT TOP ${limit}
        PACIENTE,
        NOMBRE,
        DNI
      FROM [PACIENTE]
      WHERE 
        ACTIVO = 1
        ${search ? `AND (PACIENTE LIKE '%${search}%' OR NOMBRE LIKE '%${search}%' OR DNI LIKE '%${search}%')` : ''}
      ORDER BY NOMBRE
    `
    
    const pacientes = await prisma.$queryRawUnsafe(query)
    
    return NextResponse.json(pacientes)
  } catch (error) {
    console.error('Error en GET /selectores/pacientes:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
