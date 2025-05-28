import { prisma } from '@/lib/prisma/client'

export interface Clasificador {
  CLASIFICADOR: string
  NOMBRE: string
  CONTABLEC: string
  CONTABLEA: string
  ABREVIATURA: string
  ACTIVO: number
}

export class ClasificadorService {
  async findAll(params: {
    skip?: number
    take?: number
    search?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    activo?: string
  }) {
    try {
      const { 
        skip = 0, 
        take = 10, 
        search = '',
        orderBy = 'CLASIFICADOR',
        orderDirection = 'asc',
        activo
      } = params
      
      console.log('Buscando clasificadores con parámetros:', { skip, take, search, orderBy, orderDirection, activo })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda
      if (search) {
        whereCondition += ` AND (
          CLASIFICADOR LIKE '%${search}%' OR 
          NOMBRE LIKE '%${search}%' OR
          ABREVIATURA LIKE '%${search}%'
        )`
      }
      
      // Filtrar por estado activo
      if (activo !== undefined) {
        whereCondition += ` AND ACTIVO = ${activo}`
      }
      
      // Construir la cláusula ORDER BY
      const orderByClause = `${orderBy} ${orderDirection}`
      
      // Consulta SQL para obtener los resultados paginados
      const query = `
        SELECT TOP ${take} * FROM [CLASIFICADOR] 
        WHERE ${whereCondition} AND CLASIFICADOR NOT IN (
          SELECT TOP ${skip} CLASIFICADOR FROM [CLASIFICADOR] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<Clasificador[]>(query)
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = result.map(item => ({
        ...item,
        ACTIVO: Number(item.ACTIVO)
      }))
      
      console.log(`Encontrados ${processedResult.length} clasificadores`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando clasificador con ID: ${id}`)
      
      const query = `
        SELECT * FROM [CLASIFICADOR]
        WHERE CLASIFICADOR = '${id}'
      `
      
      const result = await prisma.$queryRawUnsafe<Clasificador[]>(query)
      
      if (!result || result.length === 0) {
        console.log(`No se encontró clasificador con ID: ${id}`)
        return null
      }
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = {
        ...result[0],
        ACTIVO: Number(result[0].ACTIVO)
      }
      
      console.log(`Clasificador encontrado:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: Clasificador) {
    try {
      console.log('Creando nuevo clasificador:', data)
      
      // Validar que el ID no exista
      const existingClasificador = await this.findOne(data.CLASIFICADOR)
      if (existingClasificador) {
        throw new Error(`Ya existe un clasificador con el ID: ${data.CLASIFICADOR}`)
      }
      
      // Construir los campos y valores para la inserción
      const query = `
        INSERT INTO [CLASIFICADOR] (
          CLASIFICADOR, 
          NOMBRE, 
          CONTABLEC, 
          CONTABLEA, 
          ABREVIATURA, 
          ACTIVO
        )
        VALUES (
          '${data.CLASIFICADOR}',
          '${data.NOMBRE.replace(/'/g, "''")}',
          '${data.CONTABLEC.replace(/'/g, "''")}',
          '${data.CONTABLEA.replace(/'/g, "''")}',
          '${data.ABREVIATURA.replace(/'/g, "''")}',
          ${data.ACTIVO}
        )
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return this.findOne(data.CLASIFICADOR)
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<Clasificador>) {
    try {
      console.log(`Actualizando clasificador con ID: ${id}`, data)
      
      // Verificar que el clasificador existe
      const existingClasificador = await this.findOne(id)
      if (!existingClasificador) {
        throw new Error(`No existe un clasificador con el ID: ${id}`)
      }
      
      // Construir conjunto de campos a actualizar
      const updateFields = []
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE.replace(/'/g, "''")}'`)
      }
      
      if (data.CONTABLEC !== undefined) {
        updateFields.push(`CONTABLEC = '${data.CONTABLEC.replace(/'/g, "''")}'`)
      }
      
      if (data.CONTABLEA !== undefined) {
        updateFields.push(`CONTABLEA = '${data.CONTABLEA.replace(/'/g, "''")}'`)
      }
      
      if (data.ABREVIATURA !== undefined) {
        updateFields.push(`ABREVIATURA = '${data.ABREVIATURA.replace(/'/g, "''")}'`)
      }
      
      if (data.ACTIVO !== undefined) {
        updateFields.push(`ACTIVO = ${data.ACTIVO}`)
      }
      
      if (updateFields.length === 0) {
        console.log('No hay campos para actualizar')
        return existingClasificador
      }
      
      const query = `
        UPDATE [CLASIFICADOR]
        SET ${updateFields.join(', ')}
        WHERE CLASIFICADOR = '${id}'
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return this.findOne(id)
    } catch (error) {
      console.error(`Error en update(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async delete(id: string) {
    try {
      console.log(`Eliminando clasificador con ID: ${id}`)
      
      // Verificar que el clasificador existe
      const existingClasificador = await this.findOne(id)
      if (!existingClasificador) {
        throw new Error(`No existe un clasificador con el ID: ${id}`)
      }
      
      // Verificar si el clasificador está siendo utilizado en algún ITEM
      const checkQuery = `
        SELECT COUNT(*) as count FROM [ITEM]
        WHERE CLASIFICADOR = '${id}'
      `
      
      const checkResult = await prisma.$queryRawUnsafe<{ count: number }[]>(checkQuery)
      
      if (checkResult[0].count > 0) {
        throw new Error(`No se puede eliminar el clasificador porque está siendo utilizado en ${checkResult[0].count} items`)
      }
      
      const query = `
        DELETE FROM [CLASIFICADOR]
        WHERE CLASIFICADOR = '${id}'
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return true
    } catch (error) {
      console.error(`Error en delete(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async count(params: { search?: string, activo?: string }) {
    try {
      const { search = '', activo } = params
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda
      if (search) {
        whereCondition += ` AND (
          CLASIFICADOR LIKE '%${search}%' OR 
          NOMBRE LIKE '%${search}%' OR
          ABREVIATURA LIKE '%${search}%'
        )`
      }
      
      // Filtrar por estado activo
      if (activo !== undefined) {
        whereCondition += ` AND ACTIVO = ${activo}`
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [CLASIFICADOR]
        WHERE ${whereCondition}
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      console.log(`Total de clasificadores: ${result[0].count}`)
      return result[0].count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
