import { prisma } from '@/lib/prisma/client'

export interface Destino {
  DESTINO: string
  NOMBRE: string
  ACTIVO: number
  CIERRA_CUENTA: number
  MOSTRAR_WEB?: string
  ORDEN?: number
}

export class DestinoService {
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
        orderBy = 'DESTINO',
        orderDirection = 'asc'
      } = params
      
      console.log('Buscando destinos con parámetros:', { skip, take, search, orderBy, orderDirection })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      if (search) {
        whereCondition += ` AND (DESTINO LIKE '%${search}%' OR NOMBRE LIKE '%${search}%')`
      }
      
      // Construir la cláusula ORDER BY
      const orderByClause = `${orderBy} ${orderDirection}`
      
      // Consulta SQL para obtener los resultados paginados
      const query = `
        SELECT TOP ${take} * FROM [dbo].[DESTINO] 
        WHERE ${whereCondition} AND DESTINO NOT IN (
          SELECT TOP ${skip} DESTINO FROM [dbo].[DESTINO] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<Destino[]>(query)
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = result.map(item => ({
        ...item,
        ACTIVO: Number(item.ACTIVO),
        CIERRA_CUENTA: Number(item.CIERRA_CUENTA),
        ORDEN: item.ORDEN ? Number(item.ORDEN) : null
      }))
      
      console.log(`Encontrados ${processedResult.length} destinos`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando destino con ID: ${id}`)
      
      const result = await prisma.dESTINO.findUnique({
        where: { DESTINO: id }
      })
      
      if (!result) {
        console.log(`No se encontró destino con ID: ${id}`)
        return null
      }
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = {
        ...result,
        ACTIVO: Number(result.ACTIVO),
        CIERRA_CUENTA: Number(result.CIERRA_CUENTA),
        ORDEN: result.ORDEN ? Number(result.ORDEN) : null
      }
      
      console.log(`Destino encontrado:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: Destino) {
    try {
      console.log('Creando nuevo destino:', data)
      
      const result = await prisma.dESTINO.create({
        data: {
          DESTINO: data.DESTINO,
          NOMBRE: data.NOMBRE,
          ACTIVO: data.ACTIVO,
          CIERRA_CUENTA: data.CIERRA_CUENTA,
          MOSTRAR_WEB: data.MOSTRAR_WEB,
          ORDEN: data.ORDEN
        }
      })
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = {
        ...result,
        ACTIVO: Number(result.ACTIVO),
        CIERRA_CUENTA: Number(result.CIERRA_CUENTA),
        ORDEN: result.ORDEN ? Number(result.ORDEN) : null
      }
      
      console.log('Destino creado:', processedResult)
      return processedResult
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<Destino>) {
    try {
      console.log(`Actualizando destino ${id}:`, data)
      
      const result = await prisma.dESTINO.update({
        where: { DESTINO: id },
        data: {
          NOMBRE: data.NOMBRE,
          ACTIVO: data.ACTIVO !== undefined ? data.ACTIVO : undefined,
          CIERRA_CUENTA: data.CIERRA_CUENTA !== undefined ? data.CIERRA_CUENTA : undefined,
          MOSTRAR_WEB: data.MOSTRAR_WEB,
          ORDEN: data.ORDEN
        }
      })
      
      // Procesar los valores BigInt para evitar problemas de serialización
      const processedResult = {
        ...result,
        ACTIVO: Number(result.ACTIVO),
        CIERRA_CUENTA: Number(result.CIERRA_CUENTA),
        ORDEN: result.ORDEN ? Number(result.ORDEN) : null
      }
      
      console.log('Destino actualizado:', processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en update(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async delete(id: string) {
    try {
      console.log(`Eliminando destino con ID: ${id}`)
      
      await prisma.dESTINO.delete({
        where: { DESTINO: id }
      })
      
      console.log(`Destino ${id} eliminado con éxito`)
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
      console.log('Contando destinos con filtros:', { search })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      if (search) {
        whereCondition += ` AND (DESTINO LIKE '%${search}%' OR NOMBRE LIKE '%${search}%')`
      }
      
      // Consulta SQL para contar registros
      const query = `
        SELECT COUNT(*) as count
        FROM [dbo].[DESTINO]
        WHERE ${whereCondition}
      `
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      const count = Number(result[0]?.count || 0)
      console.log(`Total de destinos: ${count}`)
      return count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
