import { prisma } from '@/lib/prisma/client'

export interface Turno {
  TURNO: string
  NOMBRE: string
  INICIO?: string | null
  FINAL?: string | null
  ACTIVO: number
}

export class TurnoService {
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
        orderBy = 'TURNO',
        orderDirection = 'asc',
        activo
      } = params
      
      console.log('Buscando turnos con parámetros:', { skip, take, search, orderBy, orderDirection, activo })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda
      if (search) {
        whereCondition += ` AND (
          TURNO LIKE '%${search}%' OR 
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
        SELECT TOP ${take} * FROM [TURNO] 
        WHERE ${whereCondition} AND TURNO NOT IN (
          SELECT TOP ${skip} TURNO FROM [TURNO] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<Turno[]>(query)
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = result.map(item => ({
        ...item,
        ACTIVO: Number(item.ACTIVO)
      }))
      
      console.log(`Encontrados ${processedResult.length} turnos`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando turno con ID: ${id}`)
      
      const query = `
        SELECT * FROM [TURNO]
        WHERE TURNO = '${id}'
      `
      
      const result = await prisma.$queryRawUnsafe<Turno[]>(query)
      
      if (!result || result.length === 0) {
        console.log(`No se encontró turno con ID: ${id}`)
        return null
      }
      
      // Procesar los valores para evitar problemas de serialización
      const processedResult = {
        ...result[0],
        ACTIVO: Number(result[0].ACTIVO)
      }
      
      console.log(`Turno encontrado:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: Turno) {
    try {
      console.log('Creando nuevo turno:', data)
      
      // Validar que el ID no exista
      const existingTurno = await this.findOne(data.TURNO)
      if (existingTurno) {
        throw new Error(`Ya existe un turno con el ID: ${data.TURNO}`)
      }
      
      // Construir los campos y valores para la inserción
      const fields = ['TURNO', 'NOMBRE', 'ACTIVO']
      const values = [
        `'${data.TURNO}'`,
        `'${data.NOMBRE.replace(/'/g, "''")}'`,
        `${data.ACTIVO}`
      ]
      
      // Agregar campos opcionales si están presentes
      if (data.INICIO !== undefined) {
        fields.push('INICIO')
        values.push(data.INICIO === null ? 'NULL' : `'${data.INICIO}'`)
      }
      
      if (data.FINAL !== undefined) {
        fields.push('FINAL')
        values.push(data.FINAL === null ? 'NULL' : `'${data.FINAL}'`)
      }
      
      const query = `
        INSERT INTO [TURNO] (${fields.join(', ')})
        VALUES (${values.join(', ')})
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return this.findOne(data.TURNO)
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<Turno>) {
    try {
      console.log(`Actualizando turno con ID: ${id}`, data)
      
      // Verificar que el turno existe
      const existingTurno = await this.findOne(id)
      if (!existingTurno) {
        throw new Error(`No existe un turno con el ID: ${id}`)
      }
      
      // Construir conjunto de campos a actualizar
      const updateFields = []
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE.replace(/'/g, "''")}'`)
      }
      
      if (data.ACTIVO !== undefined) {
        updateFields.push(`ACTIVO = ${data.ACTIVO}`)
      }
      
      if (data.INICIO !== undefined) {
        updateFields.push(data.INICIO === null ? 'INICIO = NULL' : `INICIO = '${data.INICIO}'`)
      }
      
      if (data.FINAL !== undefined) {
        updateFields.push(data.FINAL === null ? 'FINAL = NULL' : `FINAL = '${data.FINAL}'`)
      }
      
      if (updateFields.length === 0) {
        console.log('No hay campos para actualizar')
        return existingTurno
      }
      
      const query = `
        UPDATE [TURNO]
        SET ${updateFields.join(', ')}
        WHERE TURNO = '${id}'
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
      console.log(`Eliminando turno con ID: ${id}`)
      
      // Verificar que el turno existe
      const existingTurno = await this.findOne(id)
      if (!existingTurno) {
        throw new Error(`No existe un turno con el ID: ${id}`)
      }
      
      // Verificar si el turno está siendo utilizado en alguna CAJA
      const checkQuery = `
        SELECT COUNT(*) as count FROM [CAJA]
        WHERE TURNO = '${id}'
      `
      
      const checkResult = await prisma.$queryRawUnsafe<{ count: number }[]>(checkQuery)
      
      if (checkResult[0].count > 0) {
        throw new Error(`No se puede eliminar el turno porque está siendo utilizado en ${checkResult[0].count} cajas`)
      }
      
      const query = `
        DELETE FROM [TURNO]
        WHERE TURNO = '${id}'
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
          TURNO LIKE '%${search}%' OR 
          NOMBRE LIKE '%${search}%'
        )`
      }
      
      // Filtrar por estado activo
      if (activo !== undefined) {
        whereCondition += ` AND ACTIVO = ${activo}`
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [TURNO]
        WHERE ${whereCondition}
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      console.log(`Total de turnos: ${result[0].count}`)
      return result[0].count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
