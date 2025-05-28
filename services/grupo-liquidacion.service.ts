import { prisma } from '@/lib/prisma/client'

export interface GrupoLiquidacion {
  GRUPO_LIQUIDACION: string
  NOMBRE: string
  ACTIVO: number
  ITEM?: string | null
  DESCUENTO?: string | null
}

export class GrupoLiquidacionService {
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
        orderBy = 'GRUPO_LIQUIDACION',
        orderDirection = 'asc',
        activo
      } = params
      
      console.log('Buscando grupos de liquidación con parámetros:', { skip, take, search, orderBy, orderDirection, activo })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda
      if (search) {
        whereCondition += ` AND (
          GRUPO_LIQUIDACION LIKE '%${search}%' OR 
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
        SELECT TOP ${take} * FROM [GRUPO_LIQUIDACION] 
        WHERE ${whereCondition} AND GRUPO_LIQUIDACION NOT IN (
          SELECT TOP ${skip} GRUPO_LIQUIDACION FROM [GRUPO_LIQUIDACION] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<GrupoLiquidacion[]>(query)
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = result.map(item => ({
        ...item,
        ACTIVO: Number(item.ACTIVO)
      }))
      
      console.log(`Encontrados ${processedResult.length} grupos de liquidación`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando grupo de liquidación con ID: ${id}`)
      
      const query = `
        SELECT * FROM [GRUPO_LIQUIDACION]
        WHERE GRUPO_LIQUIDACION = '${id}'
      `
      
      const result = await prisma.$queryRawUnsafe<GrupoLiquidacion[]>(query)
      
      if (!result || result.length === 0) {
        console.log(`No se encontró grupo de liquidación con ID: ${id}`)
        return null
      }
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = {
        ...result[0],
        ACTIVO: Number(result[0].ACTIVO)
      }
      
      console.log(`Grupo de liquidación encontrado:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: GrupoLiquidacion) {
    try {
      console.log('Creando nuevo grupo de liquidación:', data)
      
      // Validar que el ID no exista
      const existingGrupo = await this.findOne(data.GRUPO_LIQUIDACION)
      if (existingGrupo) {
        throw new Error(`Ya existe un grupo de liquidación con el ID: ${data.GRUPO_LIQUIDACION}`)
      }
      
      // Construir los campos y valores para la inserción
      const fields = ['GRUPO_LIQUIDACION', 'NOMBRE', 'ACTIVO']
      const values = [
        `'${data.GRUPO_LIQUIDACION}'`,
        `'${data.NOMBRE.replace(/'/g, "''")}'`,
        `${data.ACTIVO}`
      ]
      
      // Agregar campos opcionales si están presentes
      if (data.ITEM !== undefined) {
        fields.push('ITEM')
        values.push(data.ITEM === null ? 'NULL' : `'${data.ITEM}'`)
      }
      
      if (data.DESCUENTO !== undefined) {
        fields.push('DESCUENTO')
        values.push(data.DESCUENTO === null ? 'NULL' : `'${data.DESCUENTO}'`)
      }
      
      const query = `
        INSERT INTO [GRUPO_LIQUIDACION] (${fields.join(', ')})
        VALUES (${values.join(', ')})
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return this.findOne(data.GRUPO_LIQUIDACION)
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<GrupoLiquidacion>) {
    try {
      console.log(`Actualizando grupo de liquidación con ID: ${id}`, data)
      
      // Verificar que el grupo existe
      const existingGrupo = await this.findOne(id)
      if (!existingGrupo) {
        throw new Error(`No existe un grupo de liquidación con el ID: ${id}`)
      }
      
      // Construir conjunto de campos a actualizar
      const updateFields = []
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE.replace(/'/g, "''")}'`)
      }
      
      if (data.ACTIVO !== undefined) {
        updateFields.push(`ACTIVO = ${data.ACTIVO}`)
      }
      
      if (data.ITEM !== undefined) {
        updateFields.push(data.ITEM === null ? 'ITEM = NULL' : `ITEM = '${data.ITEM}'`)
      }
      
      if (data.DESCUENTO !== undefined) {
        updateFields.push(data.DESCUENTO === null ? 'DESCUENTO = NULL' : `DESCUENTO = '${data.DESCUENTO}'`)
      }
      
      if (updateFields.length === 0) {
        console.log('No hay campos para actualizar')
        return existingGrupo
      }
      
      const query = `
        UPDATE [GRUPO_LIQUIDACION]
        SET ${updateFields.join(', ')}
        WHERE GRUPO_LIQUIDACION = '${id}'
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
      console.log(`Eliminando grupo de liquidación con ID: ${id}`)
      
      // Verificar que el grupo existe
      const existingGrupo = await this.findOne(id)
      if (!existingGrupo) {
        throw new Error(`No existe un grupo de liquidación con el ID: ${id}`)
      }
      
      // Verificar si el grupo está siendo utilizado en algún ITEM
      const checkQuery = `
        SELECT COUNT(*) as count FROM [ITEM]
        WHERE GRUPO_LIQUIDACION = '${id}'
      `
      
      const checkResult = await prisma.$queryRawUnsafe<{ count: number }[]>(checkQuery)
      
      if (checkResult[0].count > 0) {
        throw new Error(`No se puede eliminar el grupo de liquidación porque está siendo utilizado en ${checkResult[0].count} items`)
      }
      
      const query = `
        DELETE FROM [GRUPO_LIQUIDACION]
        WHERE GRUPO_LIQUIDACION = '${id}'
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
          GRUPO_LIQUIDACION LIKE '%${search}%' OR 
          NOMBRE LIKE '%${search}%'
        )`
      }
      
      // Filtrar por estado activo
      if (activo !== undefined) {
        whereCondition += ` AND ACTIVO = ${activo}`
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [GRUPO_LIQUIDACION]
        WHERE ${whereCondition}
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      console.log(`Total de grupos de liquidación: ${result[0].count}`)
      return result[0].count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
