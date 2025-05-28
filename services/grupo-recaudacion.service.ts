import { prisma } from '@/lib/prisma/client'

export interface GrupoRecaudacion {
  GRUPO_RECAUDACION: string
  NOMBRE: string
  ACTIVO: number
  GENERAORDEN: number
  CONTROLASTOCK: number
  CONTROLPACIENTE: number
}

export class GrupoRecaudacionService {
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
        orderBy = 'GRUPO_RECAUDACION',
        orderDirection = 'asc',
        activo
      } = params
      
      console.log('Buscando grupos de recaudación con parámetros:', { skip, take, search, orderBy, orderDirection, activo })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda
      if (search) {
        whereCondition += ` AND (
          GRUPO_RECAUDACION LIKE '%${search}%' OR 
          NOMBRE LIKE '%${search}%'
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
        SELECT TOP ${take} * FROM [GRUPO_RECAUDACION] 
        WHERE ${whereCondition} AND GRUPO_RECAUDACION NOT IN (
          SELECT TOP ${skip} GRUPO_RECAUDACION FROM [GRUPO_RECAUDACION] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<GrupoRecaudacion[]>(query)
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = result.map(item => ({
        ...item,
        ACTIVO: Number(item.ACTIVO),
        GENERAORDEN: Number(item.GENERAORDEN),
        CONTROLASTOCK: Number(item.CONTROLASTOCK),
        CONTROLPACIENTE: Number(item.CONTROLPACIENTE)
      }))
      
      console.log(`Encontrados ${processedResult.length} grupos de recaudación`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando grupo de recaudación con ID: ${id}`)
      
      const query = `
        SELECT * FROM [GRUPO_RECAUDACION]
        WHERE GRUPO_RECAUDACION = '${id}'
      `
      
      const result = await prisma.$queryRawUnsafe<GrupoRecaudacion[]>(query)
      
      if (!result || result.length === 0) {
        console.log(`No se encontró grupo de recaudación con ID: ${id}`)
        return null
      }
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = {
        ...result[0],
        ACTIVO: Number(result[0].ACTIVO),
        GENERAORDEN: Number(result[0].GENERAORDEN),
        CONTROLASTOCK: Number(result[0].CONTROLASTOCK),
        CONTROLPACIENTE: Number(result[0].CONTROLPACIENTE)
      }
      
      console.log(`Grupo de recaudación encontrado:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: GrupoRecaudacion) {
    try {
      console.log('Creando nuevo grupo de recaudación:', data)
      
      // Validar que el ID no exista
      const existingGrupo = await this.findOne(data.GRUPO_RECAUDACION)
      if (existingGrupo) {
        throw new Error(`Ya existe un grupo de recaudación con el ID: ${data.GRUPO_RECAUDACION}`)
      }
      
      const query = `
        INSERT INTO [GRUPO_RECAUDACION] (
          GRUPO_RECAUDACION, 
          NOMBRE, 
          ACTIVO, 
          GENERAORDEN, 
          CONTROLASTOCK, 
          CONTROLPACIENTE
        )
        VALUES (
          '${data.GRUPO_RECAUDACION}',
          '${data.NOMBRE.replace(/'/g, "''")}',
          ${data.ACTIVO},
          ${data.GENERAORDEN},
          ${data.CONTROLASTOCK},
          ${data.CONTROLPACIENTE}
        )
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return this.findOne(data.GRUPO_RECAUDACION)
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<GrupoRecaudacion>) {
    try {
      console.log(`Actualizando grupo de recaudación con ID: ${id}`, data)
      
      // Verificar que el grupo existe
      const existingGrupo = await this.findOne(id)
      if (!existingGrupo) {
        throw new Error(`No existe un grupo de recaudación con el ID: ${id}`)
      }
      
      // Construir conjunto de campos a actualizar
      const updateFields = []
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE.replace(/'/g, "''")}'`)
      }
      
      if (data.ACTIVO !== undefined) {
        updateFields.push(`ACTIVO = ${data.ACTIVO}`)
      }
      
      if (data.GENERAORDEN !== undefined) {
        updateFields.push(`GENERAORDEN = ${data.GENERAORDEN}`)
      }
      
      if (data.CONTROLASTOCK !== undefined) {
        updateFields.push(`CONTROLASTOCK = ${data.CONTROLASTOCK}`)
      }
      
      if (data.CONTROLPACIENTE !== undefined) {
        updateFields.push(`CONTROLPACIENTE = ${data.CONTROLPACIENTE}`)
      }
      
      if (updateFields.length === 0) {
        console.log('No hay campos para actualizar')
        return existingGrupo
      }
      
      const query = `
        UPDATE [GRUPO_RECAUDACION]
        SET ${updateFields.join(', ')}
        WHERE GRUPO_RECAUDACION = '${id}'
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
      console.log(`Eliminando grupo de recaudación con ID: ${id}`)
      
      // Verificar que el grupo existe
      const existingGrupo = await this.findOne(id)
      if (!existingGrupo) {
        throw new Error(`No existe un grupo de recaudación con el ID: ${id}`)
      }
      
      // Verificar si el grupo está siendo utilizado en algún ITEM
      const checkQuery = `
        SELECT COUNT(*) as count FROM [ITEM]
        WHERE GRUPO_RECAUDACION = '${id}'
      `
      
      const checkResult = await prisma.$queryRawUnsafe<{ count: number }[]>(checkQuery)
      
      if (checkResult[0].count > 0) {
        throw new Error(`No se puede eliminar el grupo de recaudación porque está siendo utilizado en ${checkResult[0].count} items`)
      }
      
      const query = `
        DELETE FROM [GRUPO_RECAUDACION]
        WHERE GRUPO_RECAUDACION = '${id}'
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
          GRUPO_RECAUDACION LIKE '%${search}%' OR 
          NOMBRE LIKE '%${search}%'
        )`
      }
      
      // Filtrar por estado activo
      if (activo !== undefined) {
        whereCondition += ` AND ACTIVO = ${activo}`
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [GRUPO_RECAUDACION]
        WHERE ${whereCondition}
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      console.log(`Total de grupos de recaudación: ${result[0].count}`)
      return result[0].count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
