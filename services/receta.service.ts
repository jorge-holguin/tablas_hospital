import { prisma } from '@/lib/prisma/client'

export interface Receta {
  ID_RECETAS: number
  ATENCION_ID: string
  MODULO: string
  SEGURO: string
  ITEM: string
  CIEX: string
  PRECIO: number
  CANTIDAD: number
  DOSIS: number
  FRECUENCIA: number
  DIAS: number
  VIA: number
  ORD: number
  ESTADO: number
  FECHA: Date
  CANTIDAD_ENTREG: number
  TIEMPO?: number
  EDAD?: number
  INDICACIONES?: string
  COD_MEDICO?: string
  NUM_REC?: string
  CONSULTORIO?: string
  FECHA_UPDATE?: Date
  METODO?: string
  INDIC_GENERALES?: string
  NUEVO: number
}

export class RecetaService {
  async findAll(params: {
    skip?: number
    take?: number
    search?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    fechaInicio?: string
    fechaFin?: string
  }) {
    try {
      const { 
        skip = 0, 
        take = 10, 
        search = '',
        orderBy = 'FECHA',
        orderDirection = 'desc',
        fechaInicio,
        fechaFin
      } = params
      
      console.log('Buscando recetas con parámetros:', { skip, take, search, orderBy, orderDirection, fechaInicio, fechaFin })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por rango de fechas si se proporciona
      if (fechaInicio && fechaFin) {
        whereCondition += ` AND FECHA BETWEEN '${fechaInicio}' AND '${fechaFin} 23:59:59'`
      } else if (fechaInicio) {
        whereCondition += ` AND FECHA >= '${fechaInicio}'`
      } else if (fechaFin) {
        whereCondition += ` AND FECHA <= '${fechaFin} 23:59:59'`
      }
      
      // Filtrar por término de búsqueda
      if (search) {
        whereCondition += ` AND (
          ATENCION_ID LIKE '%${search}%' OR 
          ITEM LIKE '%${search}%' OR 
          CIEX LIKE '%${search}%' OR 
          ISNULL(INDICACIONES, '') LIKE '%${search}%' OR 
          ISNULL(COD_MEDICO, '') LIKE '%${search}%' OR 
          ISNULL(NUM_REC, '') LIKE '%${search}%'
        )`
      }
      
      // Construir la cláusula ORDER BY
      const orderByClause = `${orderBy} ${orderDirection}`
      
      // Consulta SQL para obtener los resultados paginados
      const query = `
        SELECT TOP ${take} * FROM [FARMACIA].[RECETAS] 
        WHERE ${whereCondition} AND ID_RECETAS NOT IN (
          SELECT TOP ${skip} ID_RECETAS FROM [FARMACIA].[RECETAS] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<Receta[]>(query)
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = result.map(item => ({
        ...item,
        PRECIO: Number(item.PRECIO),
        CANTIDAD: Number(item.CANTIDAD),
        DOSIS: Number(item.DOSIS),
        FRECUENCIA: Number(item.FRECUENCIA),
        DIAS: Number(item.DIAS),
        VIA: Number(item.VIA),
        ORD: Number(item.ORD),
        ESTADO: Number(item.ESTADO),
        CANTIDAD_ENTREG: Number(item.CANTIDAD_ENTREG),
        TIEMPO: item.TIEMPO ? Number(item.TIEMPO) : null,
        EDAD: item.EDAD ? Number(item.EDAD) : null,
        NUEVO: Number(item.NUEVO)
      }))
      
      console.log(`Encontradas ${processedResult.length} recetas`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: number) {
    try {
      console.log(`Buscando receta con ID: ${id}`)
      
      const query = `
        SELECT * FROM [FARMACIA].[RECETAS]
        WHERE ID_RECETAS = ${id}
      `
      
      const result = await prisma.$queryRawUnsafe<Receta[]>(query)
      
      if (!result || result.length === 0) {
        console.log(`No se encontró receta con ID: ${id}`)
        return null
      }
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = {
        ...result[0],
        PRECIO: Number(result[0].PRECIO),
        CANTIDAD: Number(result[0].CANTIDAD),
        DOSIS: Number(result[0].DOSIS),
        FRECUENCIA: Number(result[0].FRECUENCIA),
        DIAS: Number(result[0].DIAS),
        VIA: Number(result[0].VIA),
        ORD: Number(result[0].ORD),
        ESTADO: Number(result[0].ESTADO),
        CANTIDAD_ENTREG: Number(result[0].CANTIDAD_ENTREG),
        TIEMPO: result[0].TIEMPO ? Number(result[0].TIEMPO) : null,
        EDAD: result[0].EDAD ? Number(result[0].EDAD) : null,
        NUEVO: Number(result[0].NUEVO)
      }
      
      console.log(`Receta encontrada:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: Omit<Receta, 'ID_RECETAS'>) {
    try {
      console.log('Creando nueva receta:', data)
      
      // Construir los campos y valores para la inserción
      const fields = Object.keys(data).filter(key => data[key] !== undefined && data[key] !== null)
      const values = fields.map(field => {
        const value = data[field]
        if (value === null || value === undefined) return 'NULL'
        if (field === 'FECHA' || field === 'FECHA_UPDATE') return `'${value}'`
        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
        return value
      })
      
      const query = `
        INSERT INTO [FARMACIA].[RECETAS] (${fields.join(', ')})
        OUTPUT INSERTED.*
        VALUES (${values.join(', ')})
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<Receta[]>(query)
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = {
        ...result[0],
        PRECIO: Number(result[0].PRECIO),
        CANTIDAD: Number(result[0].CANTIDAD),
        DOSIS: Number(result[0].DOSIS),
        FRECUENCIA: Number(result[0].FRECUENCIA),
        DIAS: Number(result[0].DIAS),
        VIA: Number(result[0].VIA),
        ORD: Number(result[0].ORD),
        ESTADO: Number(result[0].ESTADO),
        CANTIDAD_ENTREG: Number(result[0].CANTIDAD_ENTREG),
        TIEMPO: result[0].TIEMPO ? Number(result[0].TIEMPO) : null,
        EDAD: result[0].EDAD ? Number(result[0].EDAD) : null,
        NUEVO: Number(result[0].NUEVO)
      }
      
      console.log('Receta creada:', processedResult)
      return processedResult
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: number, data: Partial<Receta>) {
    try {
      console.log(`Actualizando receta ${id}:`, data)
      
      // Construir los campos y valores para la actualización
      const setClause = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => {
          if (value === null) return `${key} = NULL`
          if (key === 'FECHA' || key === 'FECHA_UPDATE') return `${key} = '${value}'`
          if (typeof value === 'string') return `${key} = '${value.replace(/'/g, "''")}'`
          return `${key} = ${value}`
        })
        .join(', ')
      
      const query = `
        UPDATE [FARMACIA].[RECETAS]
        SET ${setClause}
        OUTPUT INSERTED.*
        WHERE ID_RECETAS = ${id}
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<Receta[]>(query)
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = {
        ...result[0],
        PRECIO: Number(result[0].PRECIO),
        CANTIDAD: Number(result[0].CANTIDAD),
        DOSIS: Number(result[0].DOSIS),
        FRECUENCIA: Number(result[0].FRECUENCIA),
        DIAS: Number(result[0].DIAS),
        VIA: Number(result[0].VIA),
        ORD: Number(result[0].ORD),
        ESTADO: Number(result[0].ESTADO),
        CANTIDAD_ENTREG: Number(result[0].CANTIDAD_ENTREG),
        TIEMPO: result[0].TIEMPO ? Number(result[0].TIEMPO) : null,
        EDAD: result[0].EDAD ? Number(result[0].EDAD) : null,
        NUEVO: Number(result[0].NUEVO)
      }
      
      console.log('Receta actualizada:', processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en update(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async delete(id: number) {
    try {
      console.log(`Eliminando receta con ID: ${id}`)
      
      const query = `
        DELETE FROM [FARMACIA].[RECETAS]
        WHERE ID_RECETAS = ${id}
      `
      
      await prisma.$executeRawUnsafe(query)
      
      console.log(`Receta ${id} eliminada con éxito`)
      return { success: true }
    } catch (error) {
      console.error(`Error en delete(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async count(params: {
    search?: string
    fechaInicio?: string
    fechaFin?: string
  }) {
    try {
      const { search = '', fechaInicio, fechaFin } = params
      console.log('Contando recetas con filtros:', { search, fechaInicio, fechaFin })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por rango de fechas si se proporciona
      if (fechaInicio && fechaFin) {
        whereCondition += ` AND FECHA BETWEEN '${fechaInicio}' AND '${fechaFin} 23:59:59'`
      } else if (fechaInicio) {
        whereCondition += ` AND FECHA >= '${fechaInicio}'`
      } else if (fechaFin) {
        whereCondition += ` AND FECHA <= '${fechaFin} 23:59:59'`
      }
      
      // Filtrar por término de búsqueda
      if (search) {
        whereCondition += ` AND (
          ATENCION_ID LIKE '%${search}%' OR 
          ITEM LIKE '%${search}%' OR 
          CIEX LIKE '%${search}%' OR 
          ISNULL(INDICACIONES, '') LIKE '%${search}%' OR 
          ISNULL(COD_MEDICO, '') LIKE '%${search}%' OR 
          ISNULL(NUM_REC, '') LIKE '%${search}%'
        )`
      }
      
      // Consulta SQL para contar registros
      const query = `
        SELECT COUNT(*) as count
        FROM [FARMACIA].[RECETAS]
        WHERE ${whereCondition}
      `
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      const count = Number(result[0]?.count || 0)
      console.log(`Total de recetas: ${count}`)
      return count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
  
  // Método para obtener las vías de administración
  async getVias() {
    try {
      return [
        { id: 1, nombre: 'Oral' },
        { id: 2, nombre: 'Intravenosa' },
        { id: 3, nombre: 'Intramuscular' },
        { id: 4, nombre: 'Subcutánea' },
        { id: 5, nombre: 'Tópica' },
        { id: 6, nombre: 'Oftálmica' },
        { id: 7, nombre: 'Ótica' },
        { id: 8, nombre: 'Nasal' },
        { id: 9, nombre: 'Rectal' },
        { id: 10, nombre: 'Vaginal' }
      ]
    } catch (error) {
      console.error('Error en getVias:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
  
  // Método para obtener los estados de recetas
  async getEstados() {
    try {
      return [
        { id: 0, nombre: 'Anulada' },
        { id: 1, nombre: 'Activa' },
        { id: 2, nombre: 'Dispensada' }
      ]
    } catch (error) {
      console.error('Error en getEstados:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
