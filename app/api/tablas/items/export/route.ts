import { NextRequest, NextResponse } from 'next/server'
import { ItemService } from '@/services/item.service'
import { Prisma } from '@prisma/client'
import * as XLSX from 'xlsx'

const itemService = new ItemService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || searchParams.get('searchTerm') || ''
    const activeFilter = searchParams.get('activeFilter') !== null ? Number(searchParams.get('activeFilter')) : null
    const orderByParam = searchParams.get('orderBy') || 'ACTIVO:desc,NOMBRE:asc'
    
    let where: Prisma.ITEMWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { ITEM: { contains: search } },
          { NOMBRE: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (activeFilter !== null) {
      where = {
        ...where,
        ACTIVO: activeFilter
      }
    }
    
    // Parse orderBy parameter
    let orderByArray: any[] = []
    
    if (orderByParam) {
      const orderByFields = orderByParam.split(',')
      
      for (const field of orderByFields) {
        const [key, direction] = field.split(':')
        if (key && (direction === 'asc' || direction === 'desc')) {
          orderByArray.push({ [key]: direction })
        }
      }
    }
    
    // If no valid orderBy fields were provided, use default ordering
    if (orderByArray.length === 0) {
      orderByArray.push({ ACTIVO: 'desc' }, { NOMBRE: 'asc' })
    }
    
    console.log('Export API where condition:', JSON.stringify(where))
    console.log('Export API orderBy:', JSON.stringify(orderByArray))
    
    // Get all items without pagination
    const items = await itemService.findAll({ 
      where,
      orderBy: orderByArray as Prisma.Enumerable<Prisma.ITEMOrderByWithRelationInput>
    })
    
    // Format data for Excel export
    interface FormattedItem {
      'Código': string;
      'Nombre': string;
      'Presentación': string;
      'Tipo Producto': string;
      'Concentración': string;
      'COD_SISMED': string;
      'NOM_SISMED': string;
      'Fracción': number;
      'Variable': number;
      'Activo': string;
      'Módulo': string;
    }
    
    let formattedItems: FormattedItem[] = [];
    
    if (items && items.length > 0) {
      formattedItems = items.map(item => ({
        'Código': item.ITEM,
        'Nombre': item.NOMBRE || '',
        'Presentación': item.PRESENTACION || '',
        'Tipo Producto': item.TIPO_PRODUCTO_DESC || '',
        'Concentración': item.CONCENTRACION || '',
        'COD_SISMED': item.COD_SISMED || '',
        'NOM_SISMED': item.NOM_SISMED || '',
        'Fracción': item.FRACCION || 1,
        'Variable': item.VARIABLE || 0,
        'Activo': Number(item.ACTIVO) === 1 ? 'Sí' : 'No',
        'Módulo': item.MODULO || ''
      }))
    }
    
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(formattedItems)
    
    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Código
      { wch: 40 }, // Nombre
      { wch: 15 }, // Presentación
      { wch: 20 }, // Tipo Producto
      { wch: 15 }, // Concentración
      { wch: 15 }, // COD_SISMED
      { wch: 40 }, // NOM_SISMED
      { wch: 10 }, // Fracción
      { wch: 10 }, // Variable
      { wch: 10 }, // Activo
      { wch: 10 }  // Módulo
    ]
    worksheet['!cols'] = columnWidths
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Items')
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    
    // Return the Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=items.xlsx'
      }
    })
  } catch (error) {
    console.error('Error exporting items to Excel:', error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : ''
    
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 })
  }
}
