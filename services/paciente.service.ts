import { prisma } from '@/lib/prisma/client'

export interface Paciente {
  PACIENTE: string
  HISTORIA: string
  PATERNO: string
  MATERNO: string
  NOMBRE: string
  NOMBRES: string
  SEXO: string
  FECHA_NACIMIENTO?: Date
  EDAD: string
  TIPO_DOCUMENTO: string
  DOCUMENTO: string
  DIRECCION: string
  TELEFONO1: string
  EMAIL: string
  ESTADO_CIVIL: string
  OCUPACION: string
}

export class PacienteService {
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
        orderBy = 'PACIENTE',
        orderDirection = 'asc'
      } = params
      
      console.log('Buscando pacientes con parámetros:', { skip, take, search, orderBy, orderDirection })
      
      // Construir la condición WHERE para la búsqueda
      let whereCondition = "1=1"
      
      // Filtrar por término de búsqueda en nombres, historia clínica, código paciente o DNI
      if (search) {
        whereCondition += ` AND (
          PACIENTE LIKE '%${search}%' OR 
          HISTORIA LIKE '%${search}%' OR
          NOMBRES LIKE '%${search}%' OR
          DOCUMENTO LIKE '%${search}%'
        )`
      }
      
      // Construir la cláusula ORDER BY
      const orderByClause = `${orderBy} ${orderDirection}`
      
      // Consulta SQL para obtener los resultados paginados
      // Seleccionamos solo los campos más importantes
      const query = `
        SELECT TOP ${take} 
          PACIENTE, 
          HISTORIA, 
          PATERNO, 
          MATERNO, 
          NOMBRE, 
          NOMBRES, 
          SEXO, 
          FECHA_NACIMIENTO, 
          EDAD, 
          TIPO_DOCUMENTO, 
          DOCUMENTO, 
          DIRECCION, 
          TELEFONO1, 
          EMAIL, 
          ESTADO_CIVIL, 
          OCUPACION
        FROM [PACIENTE] 
        WHERE ${whereCondition} AND PACIENTE NOT IN (
          SELECT TOP ${skip} PACIENTE FROM [PACIENTE] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `
      
      console.log('Query a ejecutar:', query)
      
      // Ejecutar la consulta
      const result = await prisma.$queryRawUnsafe<Paciente[]>(query)
      
      // Procesar los resultados para formatear fechas y otros campos
      const processedResult = result.map(item => ({
        ...item,
        FECHA_NACIMIENTO: item.FECHA_NACIMIENTO ? new Date(item.FECHA_NACIMIENTO) : undefined,
        // Eliminar espacios en blanco de los campos de texto
        PATERNO: item.PATERNO?.trim(),
        MATERNO: item.MATERNO?.trim(),
        NOMBRE: item.NOMBRE?.trim(),
        NOMBRES: item.NOMBRES?.trim(),
        SEXO: item.SEXO?.trim(),
        DOCUMENTO: item.DOCUMENTO?.trim(),
        DIRECCION: item.DIRECCION?.trim(),
        TELEFONO1: item.TELEFONO1?.trim(),
        EMAIL: item.EMAIL?.trim()
      }))
      
      console.log(`Encontrados ${processedResult.length} pacientes`)
      return processedResult
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando paciente con ID: ${id}`)
      
      const query = `
        SELECT 
          PACIENTE, 
          HISTORIA, 
          PATERNO, 
          MATERNO, 
          NOMBRE, 
          NOMBRES, 
          SEXO, 
          FECHA_NACIMIENTO, 
          EDAD, 
          TIPO_DOCUMENTO, 
          DOCUMENTO, 
          DIRECCION, 
          TELEFONO1, 
          EMAIL, 
          ESTADO_CIVIL, 
          OCUPACION
        FROM [PACIENTE]
        WHERE PACIENTE = '${id}'
      `
      
      const result = await prisma.$queryRawUnsafe<Paciente[]>(query)
      
      if (!result || result.length === 0) {
        console.log(`No se encontró paciente con ID: ${id}`)
        return null
      }
      
      // Procesar los resultados para formatear fechas y otros campos
      const processedResult = {
        ...result[0],
        FECHA_NACIMIENTO: result[0].FECHA_NACIMIENTO ? new Date(result[0].FECHA_NACIMIENTO) : undefined,
        // Eliminar espacios en blanco de los campos de texto
        PATERNO: result[0].PATERNO?.trim(),
        MATERNO: result[0].MATERNO?.trim(),
        NOMBRE: result[0].NOMBRE?.trim(),
        NOMBRES: result[0].NOMBRES?.trim(),
        SEXO: result[0].SEXO?.trim(),
        DOCUMENTO: result[0].DOCUMENTO?.trim(),
        DIRECCION: result[0].DIRECCION?.trim(),
        TELEFONO1: result[0].TELEFONO1?.trim(),
        EMAIL: result[0].EMAIL?.trim()
      }
      
      console.log(`Paciente encontrado:`, processedResult)
      return processedResult
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async create(data: Paciente) {
    try {
      console.log('Creando nuevo paciente:', data)
      
      // Validar que el ID no exista
      const existingPaciente = await this.findOne(data.PACIENTE)
      if (existingPaciente) {
        throw new Error(`Ya existe un paciente con el ID: ${data.PACIENTE}`)
      }
      
      // Formatear la fecha de nacimiento si existe
      const fechaNacimiento = data.FECHA_NACIMIENTO 
        ? `'${new Date(data.FECHA_NACIMIENTO).toISOString().split('T')[0]}'` 
        : 'NULL'
      
      // Construir los campos y valores para la inserción
      const query = `
        INSERT INTO [PACIENTE] (
          PACIENTE, 
          HISTORIA, 
          PATERNO, 
          MATERNO, 
          NOMBRE, 
          NOMBRES, 
          SEXO, 
          FECHA_NACIMIENTO, 
          EDAD, 
          TIPO_DOCUMENTO, 
          DOCUMENTO, 
          DIRECCION, 
          TELEFONO1, 
          EMAIL, 
          ESTADO_CIVIL, 
          OCUPACION
        )
        VALUES (
          '${data.PACIENTE}',
          '${data.HISTORIA.replace(/'/g, "''")}',
          '${data.PATERNO.replace(/'/g, "''")}',
          '${data.MATERNO.replace(/'/g, "''")}',
          '${data.NOMBRE.replace(/'/g, "''")}',
          '${data.NOMBRES.replace(/'/g, "''")}',
          '${data.SEXO}',
          ${fechaNacimiento},
          '${data.EDAD.replace(/'/g, "''")}',
          '${data.TIPO_DOCUMENTO}',
          '${data.DOCUMENTO.replace(/'/g, "''")}',
          '${data.DIRECCION.replace(/'/g, "''")}',
          '${data.TELEFONO1.replace(/'/g, "''")}',
          '${data.EMAIL.replace(/'/g, "''")}',
          '${data.ESTADO_CIVIL}',
          '${data.OCUPACION}'
        )
      `
      
      console.log('Query a ejecutar:', query)
      
      await prisma.$executeRawUnsafe(query)
      
      return this.findOne(data.PACIENTE)
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }

  async update(id: string, data: Partial<Paciente>) {
    try {
      console.log(`Actualizando paciente con ID: ${id}`, data)
      
      // Verificar que el paciente existe
      const existingPaciente = await this.findOne(id)
      if (!existingPaciente) {
        throw new Error(`No existe un paciente con el ID: ${id}`)
      }
      
      // Construir conjunto de campos a actualizar
      const updateFields = []
      
      if (data.HISTORIA !== undefined) {
        updateFields.push(`HISTORIA = '${data.HISTORIA.replace(/'/g, "''")}'`)
      }
      
      if (data.PATERNO !== undefined) {
        updateFields.push(`PATERNO = '${data.PATERNO.replace(/'/g, "''")}'`)
      }
      
      if (data.MATERNO !== undefined) {
        updateFields.push(`MATERNO = '${data.MATERNO.replace(/'/g, "''")}'`)
      }
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE.replace(/'/g, "''")}'`)
      }
      
      if (data.NOMBRES !== undefined) {
        updateFields.push(`NOMBRES = '${data.NOMBRES.replace(/'/g, "''")}'`)
      }
      
      if (data.SEXO !== undefined) {
        updateFields.push(`SEXO = '${data.SEXO}'`)
      }
      
      if (data.FECHA_NACIMIENTO !== undefined) {
        const fechaNacimiento = data.FECHA_NACIMIENTO 
          ? `'${new Date(data.FECHA_NACIMIENTO).toISOString().split('T')[0]}'` 
          : 'NULL'
        updateFields.push(`FECHA_NACIMIENTO = ${fechaNacimiento}`)
      }
      
      if (data.EDAD !== undefined) {
        updateFields.push(`EDAD = '${data.EDAD.replace(/'/g, "''")}'`)
      }
      
      if (data.TIPO_DOCUMENTO !== undefined) {
        updateFields.push(`TIPO_DOCUMENTO = '${data.TIPO_DOCUMENTO}'`)
      }
      
      if (data.DOCUMENTO !== undefined) {
        updateFields.push(`DOCUMENTO = '${data.DOCUMENTO.replace(/'/g, "''")}'`)
      }
      
      if (data.DIRECCION !== undefined) {
        updateFields.push(`DIRECCION = '${data.DIRECCION.replace(/'/g, "''")}'`)
      }
      
      if (data.TELEFONO1 !== undefined) {
        updateFields.push(`TELEFONO1 = '${data.TELEFONO1.replace(/'/g, "''")}'`)
      }
      
      if (data.EMAIL !== undefined) {
        updateFields.push(`EMAIL = '${data.EMAIL.replace(/'/g, "''")}'`)
      }
      
      if (data.ESTADO_CIVIL !== undefined) {
        updateFields.push(`ESTADO_CIVIL = '${data.ESTADO_CIVIL}'`)
      }
      
      if (data.OCUPACION !== undefined) {
        updateFields.push(`OCUPACION = '${data.OCUPACION}'`)
      }
      
      if (updateFields.length === 0) {
        console.log('No hay campos para actualizar')
        return existingPaciente
      }
      
      const query = `
        UPDATE [PACIENTE]
        SET ${updateFields.join(', ')}
        WHERE PACIENTE = '${id}'
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
      console.log(`Eliminando paciente con ID: ${id}`)
      
      // Verificar que el paciente existe
      const existingPaciente = await this.findOne(id)
      if (!existingPaciente) {
        throw new Error(`No existe un paciente con el ID: ${id}`)
      }
      
      // Verificar si el paciente está siendo utilizado en alguna tabla relacionada
      const checkQuery = `
        SELECT 
          (SELECT COUNT(*) FROM [CUENTA] WHERE PACIENTE = '${id}') as cuentas,
          (SELECT COUNT(*) FROM [ORDENC] WHERE PACIENTE = '${id}') as ordenes
      `
      
      const checkResult = await prisma.$queryRawUnsafe<{ cuentas: number, ordenes: number }[]>(checkQuery)
      
      if (checkResult[0].cuentas > 0 || checkResult[0].ordenes > 0) {
        throw new Error(`No se puede eliminar el paciente porque está siendo utilizado en ${checkResult[0].cuentas} cuentas y ${checkResult[0].ordenes} órdenes`)
      }
      
      const query = `
        DELETE FROM [PACIENTE]
        WHERE PACIENTE = '${id}'
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
      
      // Filtrar por término de búsqueda en nombres, historia clínica, código paciente o DNI
      if (search) {
        whereCondition += ` AND (
          PACIENTE LIKE '%${search}%' OR 
          HISTORIA LIKE '%${search}%' OR
          NOMBRES LIKE '%${search}%' OR
          DOCUMENTO LIKE '%${search}%'
        )`
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [PACIENTE]
        WHERE ${whereCondition}
      `
      
      console.log('Query a ejecutar:', query)
      
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(query)
      
      console.log(`Total de pacientes: ${result[0].count}`)
      return result[0].count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      throw error
    }
  }
}
