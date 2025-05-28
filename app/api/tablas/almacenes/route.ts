import { NextRequest, NextResponse } from 'next/server'
import { getAlmacenes, countAlmacenes, createAlmacen } from '@/services/almacen.service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const orderBy = searchParams.get('orderBy') || 'ALMACEN'
    const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc'
    const activo = searchParams.get('active')
    
    console.log('API request params:', { take, skip, search, orderBy, orderDirection, activo })
    
    // Convertir parámetros al formato esperado por las nuevas funciones
    const page = Math.floor(skip / take) + 1
    const pageSize = take
    const searchTerm = search || ''
    const sortBy = orderBy || 'ALMACEN'
    const sortOrder = (orderDirection || 'asc') as 'asc' | 'desc'
    const activoNum = activo ? parseInt(activo) : undefined
    
    // Obtener los datos y el conteo total
    const [almacenesResponse, countResponse] = await Promise.all([
      getAlmacenes(searchTerm, page, pageSize, sortBy, sortOrder, activoNum),
      countAlmacenes(searchTerm, activoNum)
    ])
    
    // Extraer los datos de las respuestas
    const almacenes = almacenesResponse.success ? almacenesResponse.data.data : []
    const totalCount = countResponse.success ? countResponse.data.total : 0

    // Devolver los datos junto con metadatos de paginación
    return NextResponse.json({
      data: almacenes,
      meta: {
        total: totalCount,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        pageCount: Math.ceil(totalCount / take)
      }
    })
  } catch (error) {
    // Capturar información detallada del error
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Error fetching almacenes:', { 
      message: errorMessage,
      stack: errorStack,
      url: req.url
    })
    
    // Devolver un mensaje de error más informativo
    return NextResponse.json({ 
      error: 'Error al obtener datos de almacenes', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validar campos requeridos
    if (!body.ALMACEN || !body.NOMBRE) {
      return NextResponse.json(
        { error: 'Los campos ALMACEN y NOMBRE son obligatorios' },
        { status: 400 }
      )
    }
    
    // Asegurar que ACTIVO sea un número
    body.ACTIVO = body.ACTIVO !== undefined ? Number(body.ACTIVO) : 1
    
    // Crear el almacén
    const result = await createAlmacen({
      ALMACEN: body.ALMACEN,
      NOMBRE: body.NOMBRE,
      ACTIVO: body.ACTIVO
    })
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    // Capturar información detallada del error
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Error creating almacen:', { 
      message: errorMessage,
      stack: errorStack,
      body: req.body
    })
    
    return NextResponse.json(
      { error: 'Error al crear el almacén', details: errorMessage },
      { status: 500 }
    )
  }
}
