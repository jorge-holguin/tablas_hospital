import { prisma } from '@/lib/prisma/client'

export interface Origen {
  ORIGEN: string
  NOMBRE: string
  ACTIVO: number
  TIPO?: string
  ACTIVO_FUA?: number
}

export class OrigenService {
  async findAll(params: {
    skip?: number
    take?: number
    search?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
  }) {
    try {
      const { 
        skip = 0, 
        take = 10, 
        search = '',
        orderBy = 'ORIGEN',
        orderDirection = 'asc'
      } = params
      
      console.log('Buscando orígenes con parámetros:', { skip, take, search, orderBy, orderDirection })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      if (search) {
        whereCondition += ` AND (ORIGEN LIKE '%${search}%' OR NOMBRE LIKE '%${search}%')`
      }
      
      // Construir la cláusula ORDER BY
      const orderByClause = `${orderBy} ${orderDirection}`
      
      // Consulta SQL para obtener los resultados paginados
      const query = `
        SELECT TOP ${take} * FROM [dbo].[ORIGEN] 
        WHERE ${whereCondition} AND ORIGEN NOT IN (
          SELECT TOP ${skip} ORIGEN FROM [dbo].[ORIGEN] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<Origen[]>(query)
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = result.map(item => ({
        ...item,
        ACTIVO: Number(item.ACTIVO),
        ACTIVO_FUA: item.ACTIVO_FUA ? Number(item.ACTIVO_FUA) : null
      }))
      
      console.log(`Encontrados ${processedResult.length} orígenes`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando origen con ID: ${id}`)
      
      const result = await prisma.oRIGEN.findUnique({
        where: { ORIGEN: id }
      })
      
      if (!result) {
        console.log(`No se encontró origen con ID: ${id}`)
        return null
      }
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = {
        ...result,
        ACTIVO: Number(result.ACTIVO),
        ACTIVO_FUA: result.ACTIVO_FUA ? Number(result.ACTIVO_FUA) : null
      }
      
      console.log(`Origen encontrado:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: Origen) {
    try {
      console.log('Creando nuevo origen:', data)
      
      const result = await prisma.oRIGEN.create({
        data: {
          ORIGEN: data.ORIGEN,
          NOMBRE: data.NOMBRE,
          ACTIVO: data.ACTIVO,
          TIPO: data.TIPO,
          ACTIVO_FUA: data.ACTIVO_FUA
        }
      })
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = {
        ...result,
        ACTIVO: Number(result.ACTIVO),
        ACTIVO_FUA: result.ACTIVO_FUA ? Number(result.ACTIVO_FUA) : null
      }
      
      console.log('Origen creado:', processedResult)
      return processedResult
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<Origen>) {
    try {
      console.log(`Actualizando origen ${id}:`, data)
      
      const result = await prisma.oRIGEN.update({
        where: { ORIGEN: id },
        data: {
          NOMBRE: data.NOMBRE,
          ACTIVO: data.ACTIVO !== undefined ? data.ACTIVO : undefined,
          TIPO: data.TIPO,
          ACTIVO_FUA: data.ACTIVO_FUA
        }
      })
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = {
        ...result,
        ACTIVO: Number(result.ACTIVO),
        ACTIVO_FUA: result.ACTIVO_FUA ? Number(result.ACTIVO_FUA) : null
      }
      
      console.log('Origen actualizado:', processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en update(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async delete(id: string) {
    try {
      console.log(`Eliminando origen con ID: ${id}`)
      
      await prisma.oRIGEN.delete({
        where: { ORIGEN: id }
      })
      
      console.log(`Origen ${id} eliminado con éxito`)
      return { success: true }
    } catch (error) {
      console.error(`Error en delete(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async count(params: {
    search?: string
  }) {
    try {
      const { search = '' } = params
      console.log('Contando orígenes con filtros:', { search })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      if (search) {
        whereCondition += ` AND (ORIGEN LIKE '%${search}%' OR NOMBRE LIKE '%${search}%')`
      }
      
      // Consulta SQL para contar registros
      const query = `
        SELECT COUNT(*) as count
        FROM [dbo].[ORIGEN]
        WHERE ${whereCondition}
      `
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      const count = Number(result[0]?.count || 0)
      console.log(`Total de orígenes: ${count}`)
      return count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
