import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 100
    
    console.log('API GET /selectores/seguros con parámetros:', { search, limit })
    
    // Consulta SQL para obtener seguros con búsqueda
    const query = `
      SELECT TOP ${limit}
        SEGURO,
        NOMBRE
      FROM [SEGURO]
      WHERE 
        ACTIVO = 1
        ${search ? `AND (SEGURO LIKE '%${search}%' OR NOMBRE LIKE '%${search}%')` : ''}
      ORDER BY NOMBRE
    `
    
    const seguros = await prisma.$queryRawUnsafe(query)
    
    return NextResponse.json(seguros)
  } catch (error) {
    console.error('Error en GET /selectores/seguros:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
