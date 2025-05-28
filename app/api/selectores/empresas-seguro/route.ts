import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const seguro = searchParams.get('seguro') || ''
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 100
    
    console.log('API GET /selectores/empresas-seguro con parámetros:', { search, seguro, limit })
    
    // Consulta SQL para obtener empresas de seguro con búsqueda
    const query = `
      SELECT TOP ${limit}
        EMPRESASEGURO,
        NOMBRE,
        SEGURO
      FROM [EMPRESASEGURO]
      WHERE 
        ACTIVO = 1
        ${seguro ? `AND SEGURO = '${seguro}'` : ''}
        ${search ? `AND (EMPRESASEGURO LIKE '%${search}%' OR NOMBRE LIKE '%${search}%')` : ''}
      ORDER BY NOMBRE
    `
    
    const empresasSeguro = await prisma.$queryRawUnsafe(query)
    
    return NextResponse.json(empresasSeguro)
  } catch (error) {
    console.error('Error en GET /selectores/empresas-seguro:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
