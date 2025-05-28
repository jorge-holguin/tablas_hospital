import { PrismaClient } from '@prisma/client'
import { formatResponse } from '@/lib/utils'

const prisma = new PrismaClient()

export interface Almacen {
  ALMACEN: string
  NOMBRE: string
  ACTIVO: number
}

/**
 * Obtiene la lista de almacenes con paginación y filtros
 */
export async function getAlmacenes(
  searchTerm: string = "",
  page: number = 1,
  pageSize: number = 10,
  sortBy: string = "ALMACEN",
  sortOrder: "asc" | "desc" = "asc",
  activo?: number
) {
  try {
    // Construir la condición de búsqueda para SQL
    let whereCondition = "1=1"
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      whereCondition += ` AND (ALMACEN LIKE '%${searchTerm}%' OR NOMBRE LIKE '%${searchTerm}%')`
    }
    
    // Filtrar por estado activo
    if (activo !== undefined) {
      whereCondition += ` AND ACTIVO = ${activo}`
    }
    
    // Validar el campo de ordenamiento para evitar inyección SQL
    const validSortFields = ["ALMACEN", "NOMBRE", "ACTIVO"]
    if (!validSortFields.includes(sortBy)) {
      sortBy = "ALMACEN"
    }
    
    // Construir la cláusula ORDER BY
    const orderByClause = `${sortBy} ${sortOrder.toUpperCase()}`
    
    // Consulta para obtener el total de registros
    const countQuery = `
      SELECT COUNT(*) as total FROM ALMACEN
      WHERE ${whereCondition}
    `
    const countResult: any[] = await prisma.$queryRawUnsafe(countQuery)
    const total = Number(countResult[0].total || 0)
    
    // Consulta paginada con SQL Server 2008
    const query = `
      SELECT TOP ${pageSize} * FROM ALMACEN 
      WHERE ${whereCondition} AND ALMACEN NOT IN (
        SELECT TOP ${(page - 1) * pageSize} ALMACEN FROM ALMACEN 
        WHERE ${whereCondition} 
        ORDER BY ${orderByClause}
      )
      ORDER BY ${orderByClause}
    `
    
    const data: any[] = await prisma.$queryRawUnsafe(query)
    
    // Procesar los datos para asegurar que ACTIVO sea numérico
    const processedData = data.map(item => ({
      ...item,
      ACTIVO: Number(item.ACTIVO || 0)
    }))
    
    return formatResponse(true, "Almacenes obtenidos correctamente", {
      data: processedData,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error("Error al obtener almacenes:", error)
    return formatResponse(false, "Error al obtener almacenes: " + (error instanceof Error ? error.message : String(error)), null)
  }
}

/**
 * Obtiene un almacén por su ID
 */
export async function getAlmacenById(id: string) {
  try {
    // Consulta SQL directa para obtener un almacén por ID
    const query = `
      SELECT * FROM ALMACEN
      WHERE ALMACEN = '${id}'
    `
    
    const result: any[] = await prisma.$queryRawUnsafe(query)
    
    if (!result || result.length === 0) {
      return formatResponse(false, "Almacén no encontrado", null)
    }
    
    const almacen = result[0]
    
    // Procesar los datos para asegurar que ACTIVO sea numérico
    const processedAlmacen = {
      ...almacen,
      ACTIVO: Number(almacen.ACTIVO || 0)
    }
    
    return formatResponse(true, "Almacén obtenido correctamente", processedAlmacen)
  } catch (error) {
    console.error("Error al obtener almacén:", error)
    return formatResponse(false, "Error al obtener almacén: " + (error instanceof Error ? error.message : String(error)), null)
  }
}

/**
 * Crea un nuevo almacén
 */
export async function createAlmacen(data: {
  ALMACEN: string
  NOMBRE: string
  ACTIVO: number
}) {
  try {
    // Verificar si ya existe un almacén con el mismo código
    const checkQuery = `
      SELECT COUNT(*) as count FROM ALMACEN
      WHERE ALMACEN = '${data.ALMACEN}'
    `
    
    const checkResult: any[] = await prisma.$queryRawUnsafe(checkQuery)
    
    if (checkResult[0].count > 0) {
      return formatResponse(false, "Ya existe un almacén con este código", null)
    }
    
    // Crear el nuevo almacén con SQL directo
    const insertQuery = `
      INSERT INTO ALMACEN (ALMACEN, NOMBRE, ACTIVO)
      VALUES ('${data.ALMACEN}', '${data.NOMBRE}', ${data.ACTIVO})
    `
    
    await prisma.$executeRawUnsafe(insertQuery)
    
    // Obtener el almacén recién creado
    const getQuery = `
      SELECT * FROM ALMACEN
      WHERE ALMACEN = '${data.ALMACEN}'
    `
    
    const result: any[] = await prisma.$queryRawUnsafe(getQuery)
    const newAlmacen = result[0]
    
    return formatResponse(true, "Almacén creado correctamente", {
      ...newAlmacen,
      ACTIVO: Number(newAlmacen.ACTIVO || 0)
    })
  } catch (error) {
    console.error("Error al crear almacén:", error)
    return formatResponse(false, "Error al crear almacén: " + (error instanceof Error ? error.message : String(error)), null)
  }
}

/**
 * Actualiza un almacén existente
 */
export async function updateAlmacen(
  id: string,
  data: {
    NOMBRE?: string
    ACTIVO?: number
  }
) {
  try {
    // Verificar si el almacén existe
    const checkQuery = `
      SELECT COUNT(*) as count FROM ALMACEN
      WHERE ALMACEN = '${id}'
    `
    
    const checkResult: any[] = await prisma.$queryRawUnsafe(checkQuery)
    
    if (checkResult[0].count === 0) {
      return formatResponse(false, "Almacén no encontrado", null)
    }
    
    // Construir la consulta de actualización
    let updateFields = []
    
    if (data.NOMBRE !== undefined) {
      updateFields.push(`NOMBRE = '${data.NOMBRE}'`)
    }
    
    if (data.ACTIVO !== undefined) {
      updateFields.push(`ACTIVO = ${data.ACTIVO}`)
    }
    
    if (updateFields.length === 0) {
      return formatResponse(false, "No se proporcionaron campos para actualizar", null)
    }
    
    // Actualizar el almacén con SQL directo
    const updateQuery = `
      UPDATE ALMACEN
      SET ${updateFields.join(', ')}
      WHERE ALMACEN = '${id}'
    `
    
    await prisma.$executeRawUnsafe(updateQuery)
    
    // Obtener el almacén actualizado
    const getQuery = `
      SELECT * FROM ALMACEN
      WHERE ALMACEN = '${id}'
    `
    
    const result: any[] = await prisma.$queryRawUnsafe(getQuery)
    const updatedAlmacen = result[0]
    
    return formatResponse(true, "Almacén actualizado correctamente", {
      ...updatedAlmacen,
      ACTIVO: Number(updatedAlmacen.ACTIVO || 0)
    })
  } catch (error) {
    console.error("Error al actualizar almacén:", error)
    return formatResponse(false, "Error al actualizar almacén: " + (error instanceof Error ? error.message : String(error)), null)
  }
}

/**
 * Elimina un almacén existente
 */
export async function deleteAlmacen(id: string) {
  try {
    // Verificar si el almacén existe
    const checkQuery = `
      SELECT COUNT(*) as count FROM ALMACEN
      WHERE ALMACEN = '${id}'
    `
    
    const checkResult: any[] = await prisma.$queryRawUnsafe(checkQuery)
    
    if (checkResult[0].count === 0) {
      return formatResponse(false, "Almacén no encontrado", null)
    }
    
    // Verificar si el almacén está siendo utilizado en INGRESOC
    const ingresoQuery = `
      SELECT COUNT(*) as count FROM INGRESOC
      WHERE ALMACEN = '${id}'
    `
    const ingresoResult: any[] = await prisma.$queryRawUnsafe(ingresoQuery)
    const ingresoCount = Number(ingresoResult[0].count || 0)
    
    // Verificar si el almacén está siendo utilizado en KARDEX
    const kardexQuery = `
      SELECT COUNT(*) as count FROM KARDEX
      WHERE ALMACEN = '${id}'
    `
    const kardexResult: any[] = await prisma.$queryRawUnsafe(kardexQuery)
    const kardexCount = Number(kardexResult[0].count || 0)
    
    // Verificar si el almacén está siendo utilizado en SALIDAC
    const salidaQuery = `
      SELECT COUNT(*) as count FROM SALIDAC
      WHERE ALMACEN = '${id}'
    `
    const salidaResult: any[] = await prisma.$queryRawUnsafe(salidaQuery)
    const salidaCount = Number(salidaResult[0].count || 0)
    
    // Verificar si el almacén está siendo utilizado en TRANSFERENCIAC
    const transferenciaQuery = `
      SELECT COUNT(*) as count FROM TRANSFERENCIAC
      WHERE ALMACEN = '${id}'
    `
    const transferenciaResult: any[] = await prisma.$queryRawUnsafe(transferenciaQuery)
    const transferenciaCount = Number(transferenciaResult[0].count || 0)
    
    if (ingresoCount > 0 || kardexCount > 0 || salidaCount > 0 || transferenciaCount > 0) {
      return formatResponse(
        false,
        `No se puede eliminar el almacén porque está siendo utilizado en: ${ingresoCount} ingresos, ${kardexCount} registros de kardex, ${salidaCount} salidas, ${transferenciaCount} transferencias`,
        null
      )
    }
    
    // Eliminar el almacén con SQL directo
    const deleteQuery = `
      DELETE FROM ALMACEN
      WHERE ALMACEN = '${id}'
    `
    
    await prisma.$executeRawUnsafe(deleteQuery)
    
    return formatResponse(true, "Almacén eliminado correctamente", null)
  } catch (error) {
    console.error("Error al eliminar almacén:", error)
    return formatResponse(false, "Error al eliminar almacén: " + (error instanceof Error ? error.message : String(error)), null)
  }
}

/**
 * Cuenta el número de almacenes según los filtros
 */
export async function countAlmacenes(searchTerm: string = "", activo?: number) {
  try {
    // Construir la condición de búsqueda para SQL
    let whereCondition = "1=1"
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      whereCondition += ` AND (ALMACEN LIKE '%${searchTerm}%' OR NOMBRE LIKE '%${searchTerm}%')`
    }
    
    // Filtrar por estado activo
    if (activo !== undefined) {
      whereCondition += ` AND ACTIVO = ${activo}`
    }
    
    // Consulta para obtener el total de registros
    const countQuery = `
      SELECT COUNT(*) as total FROM ALMACEN
      WHERE ${whereCondition}
    `
    
    const result: any[] = await prisma.$queryRawUnsafe(countQuery)
    const total = Number(result[0].total || 0)
    
    return formatResponse(true, "Conteo de almacenes obtenido correctamente", { total })
  } catch (error) {
    console.error("Error al contar almacenes:", error)
    return formatResponse(false, "Error al contar almacenes: " + (error instanceof Error ? error.message : String(error)), null)
  }
}
