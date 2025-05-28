import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 100
    
    console.log('API GET /selectores/origenes con parámetros:', { search, limit })
    
    // Consulta SQL para obtener orígenes con búsqueda
    const query = `
      SELECT TOP ${limit}
        ORIGEN,
        NOMBRE
      FROM [ORIGEN]
      WHERE 
        ACTIVO = 1
        ${search ? `AND (ORIGEN LIKE '%${search}%' OR NOMBRE LIKE '%${search}%')` : ''}
      ORDER BY NOMBRE
    `
    
    const origenes = await prisma.$queryRawUnsafe(query)
    
    return NextResponse.json(origenes)
  } catch (error) {
    console.error('Error en GET /selectores/origenes:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
