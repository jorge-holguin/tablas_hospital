import { prisma } from '@/lib/prisma/client'

export interface Cuenta {
  CUENTAID: string
  PACIENTE: string
  PACIENTE_NOMBRE?: string
  SEGURO: string
  SEGURO_NOMBRE?: string
  EMPRESASEGURO: string
  EMPRESASEGURO_NOMBRE?: string
  FECHA_APERTURA: Date
  FECHA_CIERRE?: Date
  NOMBRE: string
  ORIGEN: string
  ORIGEN_NOMBRE?: string
  ESTADO: string
}

export class CuentaService {
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
        orderBy = 'CUENTAID',
        orderDirection = 'asc'
      } = params
      
      console.log('Buscando cuentas con parámetros:', { skip, take, search, orderBy, orderDirection })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda en CUENTAID, PACIENTE o NOMBRE
      if (search) {
        whereCondition += ` AND (
          CUENTAID LIKE '%${search}%' OR 
          PACIENTE LIKE '%${search}%' OR
          NOMBRE LIKE '%${search}%'
        )`
      }
      
      // Construir la cláusula ORDER BY
      const orderByClause = `${orderBy} ${orderDirection}`
      
      // Consulta SQL para obtener los resultados paginados con solo los campos importantes
      // e incluir información relacionada
      const query = `
        SELECT TOP ${take} 
          C.CUENTAID, 
          C.PACIENTE, 
          P.NOMBRE AS PACIENTE_NOMBRE,
          C.SEGURO, 
          S.NOMBRE AS SEGURO_NOMBRE,
          C.EMPRESASEGURO, 
          ES.NOMBRE AS EMPRESASEGURO_NOMBRE,
          C.FECHA_APERTURA, 
          C.FECHA_CIERRE, 
          C.NOMBRE, 
          C.ORIGEN,
          O.NOMBRE AS ORIGEN_NOMBRE,
          C.ESTADO
        FROM [CUENTA] C
        LEFT JOIN [PACIENTE] P ON C.PACIENTE = P.PACIENTE
        LEFT JOIN [SEGURO] S ON C.SEGURO = S.SEGURO
        LEFT JOIN [EMPRESASEGURO] ES ON C.EMPRESASEGURO = ES.EMPRESASEGURO
        LEFT JOIN [ORIGEN] O ON C.ORIGEN = O.ORIGEN
        WHERE ${whereCondition} AND C.CUENTAID NOT IN (
          SELECT TOP ${skip} CUENTAID FROM [CUENTA] C
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<Cuenta[]>(query)
      
      console.log(`Encontradas ${result.length} cuentas`)
      return result
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando cuenta con ID: ${id}`)
      
      const query = `
        SELECT 
          C.CUENTAID, 
          C.PACIENTE, 
          P.NOMBRE AS PACIENTE_NOMBRE,
          C.SEGURO, 
          S.NOMBRE AS SEGURO_NOMBRE,
          C.EMPRESASEGURO, 
          ES.NOMBRE AS EMPRESASEGURO_NOMBRE,
          C.FECHA_APERTURA, 
          C.FECHA_CIERRE, 
          C.NOMBRE, 
          C.ORIGEN,
          O.NOMBRE AS ORIGEN_NOMBRE,
          C.ESTADO
        FROM [CUENTA] C
        LEFT JOIN [PACIENTE] P ON C.PACIENTE = P.PACIENTE
        LEFT JOIN [SEGURO] S ON C.SEGURO = S.SEGURO
        LEFT JOIN [EMPRESASEGURO] ES ON C.EMPRESASEGURO = ES.EMPRESASEGURO
        LEFT JOIN [ORIGEN] O ON C.ORIGEN = O.ORIGEN
        WHERE C.CUENTAID = '${id}'
      `
      
      const result = await prisma.$queryRawUnsafe<Cuenta[]>(query)
      
      if (!result || result.length === 0) {
        console.log(`No se encontró cuenta con ID: ${id}`)
        return null
      }
      
      console.log(`Cuenta encontrada:`, result[0])
      return result[0]
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: Cuenta) {
    try {
      console.log('Creando nueva cuenta:', data)
      
      // Validar que el ID no exista
      const existingCuenta = await this.findOne(data.CUENTAID)
      if (existingCuenta) {
        throw new Error(`Ya existe una cuenta con el ID: ${data.CUENTAID}`)
      }
      
      // Formatear las fechas
      const fechaApertura = data.FECHA_APERTURA 
        ? `'${new Date(data.FECHA_APERTURA).toISOString().split('T')[0]}'` 
        : 'GETDATE()'
      
      const fechaCierre = data.FECHA_CIERRE 
        ? `'${new Date(data.FECHA_CIERRE).toISOString().split('T')[0]}'` 
        : 'NULL'
      
      // Construir los campos y valores para la inserción
      const query = `
        INSERT INTO [CUENTA] (
          CUENTAID, 
          PACIENTE, 
          SEGURO, 
          EMPRESASEGURO, 
          FECHA_APERTURA, 
          FECHA_CIERRE, 
          NOMBRE, 
          ORIGEN,
          ESTADO,
          HORA_APERTURA
        )
        VALUES (
          '${data.CUENTAID}',
          '${data.PACIENTE}',
          '${data.SEGURO}',
          '${data.EMPRESASEGURO}',
          ${fechaApertura},
          ${fechaCierre},
          '${data.NOMBRE.replace(/'/g, "''") || ''}',
          '${data.ORIGEN}',
          '${data.ESTADO || '1'}',
          '${new Date().toTimeString().slice(0, 8)}'
        )
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return this.findOne(data.CUENTAID)
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<Cuenta>) {
    try {
      console.log(`Actualizando cuenta con ID: ${id}`, data)
      
      // Verificar que la cuenta existe
      const existingCuenta = await this.findOne(id)
      if (!existingCuenta) {
        throw new Error(`No existe una cuenta con el ID: ${id}`)
      }
      
      // Construir conjunto de campos a actualizar
      const updateFields = []
      
      if (data.PACIENTE !== undefined) {
        updateFields.push(`PACIENTE = '${data.PACIENTE}'`)
      }
      
      if (data.SEGURO !== undefined) {
        updateFields.push(`SEGURO = '${data.SEGURO}'`)
      }
      
      if (data.EMPRESASEGURO !== undefined) {
        updateFields.push(`EMPRESASEGURO = '${data.EMPRESASEGURO}'`)
      }
      
      if (data.FECHA_APERTURA !== undefined) {
        updateFields.push(`FECHA_APERTURA = '${new Date(data.FECHA_APERTURA).toISOString().split('T')[0]}'`)
      }
      
      if (data.FECHA_CIERRE !== undefined) {
        updateFields.push(`FECHA_CIERRE = '${new Date(data.FECHA_CIERRE).toISOString().split('T')[0]}'`)
      }
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE.replace(/'/g, "''")}'`)
      }
      
      if (data.ORIGEN !== undefined) {
        updateFields.push(`ORIGEN = '${data.ORIGEN}'`)
      }
      
      if (data.ESTADO !== undefined) {
        updateFields.push(`ESTADO = '${data.ESTADO}'`)
      }
      
      if (updateFields.length === 0) {
        console.log('No hay campos para actualizar')
        return existingCuenta
      }
      
      const query = `
        UPDATE [CUENTA]
        SET ${updateFields.join(', ')}
        WHERE CUENTAID = '${id}'
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
      console.log(`Eliminando cuenta con ID: ${id}`)
      
      // Verificar que la cuenta existe
      const existingCuenta = await this.findOne(id)
      if (!existingCuenta) {
        throw new Error(`No existe una cuenta con el ID: ${id}`)
      }
      
      // Verificar si la cuenta está siendo utilizada en alguna tabla relacionada
      const checkQuery = `
        SELECT 
          (SELECT COUNT(*) FROM [DESCUENTOC] WHERE CUENTAID = '${id}') as descuentos,
          (SELECT COUNT(*) FROM [HOSPITALIZA] WHERE CUENTAID = '${id}') as hospitalizaciones,
          (SELECT COUNT(*) FROM [OBSTETRICIA] WHERE CUENTAID = '${id}') as obstetricia,
          (SELECT COUNT(*) FROM [ORDENC] WHERE CUENTAID = '${id}') as ordenes
      `
      
      const checkResult = await prisma.$queryRawUnsafe<{ descuentos: number, hospitalizaciones: number, obstetricia: number, ordenes: number }[]>(checkQuery)
      
      if (checkResult[0].descuentos > 0 || checkResult[0].hospitalizaciones > 0 || checkResult[0].obstetricia > 0 || checkResult[0].ordenes > 0) {
        throw new Error(`No se puede eliminar la cuenta porque está siendo utilizada en: ${checkResult[0].descuentos} descuentos, ${checkResult[0].hospitalizaciones} hospitalizaciones, ${checkResult[0].obstetricia} registros de obstetricia, ${checkResult[0].ordenes} órdenes`)
      }
      
      const query = `
        DELETE FROM [CUENTA]
        WHERE CUENTAID = '${id}'
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return true
    } catch (error) {
      console.error(`Error en delete(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async count(params: { search?: string }) {
    try {
      const { search = '' } = params
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda en CUENTAID, PACIENTE o NOMBRE
      if (search) {
        whereCondition += ` AND (
          CUENTAID LIKE '%${search}%' OR 
          PACIENTE LIKE '%${search}%' OR
          NOMBRE LIKE '%${search}%'
        )`
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [CUENTA]
        WHERE ${whereCondition}
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      console.log(`Total de cuentas: ${result[0].count}`)
      return result[0].count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
