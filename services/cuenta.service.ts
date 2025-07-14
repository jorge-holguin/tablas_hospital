import { prisma } from '@/lib/prisma/client'

// Datos simulados para cuando no hay conexión a la base de datos
const MOCK_CUENTAS = [
  {
    CUENTAID: 'C001',
    PACIENTE: 'P001',
    PACIENTE_NOMBRE: 'Juan Pérez',
    SEGURO: 'S001',
    SEGURO_NOMBRE: 'Seguro Público',
    EMPRESASEGURO: 'ES001',
    EMPRESASEGURO_NOMBRE: 'EPS Nacional',
    FECHA_APERTURA: new Date('2023-01-15'),
    FECHA_CIERRE: null,
    NOMBRE: 'Cuenta de hospitalización',
    ORIGEN: 'O001',
    ORIGEN_NOMBRE: 'Emergencia',
    ESTADO: '1'
  },
  {
    CUENTAID: 'C002',
    PACIENTE: 'P002',
    PACIENTE_NOMBRE: 'María García',
    SEGURO: 'S002',
    SEGURO_NOMBRE: 'Seguro Privado',
    EMPRESASEGURO: 'ES002',
    EMPRESASEGURO_NOMBRE: 'Seguro Premium',
    FECHA_APERTURA: new Date('2023-02-20'),
    FECHA_CIERRE: new Date('2023-03-05'),
    NOMBRE: 'Cuenta de consulta externa',
    ORIGEN: 'O002',
    ORIGEN_NOMBRE: 'Consulta Externa',
    ESTADO: '1'
  },
  {
    CUENTAID: 'C003',
    PACIENTE: 'P003',
    PACIENTE_NOMBRE: 'Carlos Rodríguez',
    SEGURO: 'S001',
    SEGURO_NOMBRE: 'Seguro Público',
    EMPRESASEGURO: 'ES001',
    EMPRESASEGURO_NOMBRE: 'EPS Nacional',
    FECHA_APERTURA: new Date('2023-03-10'),
    FECHA_CIERRE: null,
    NOMBRE: 'Cuenta de procedimientos',
    ORIGEN: 'O003',
    ORIGEN_NOMBRE: 'Referencia',
    ESTADO: '1'
  },
  {
    CUENTAID: 'C004',
    PACIENTE: 'P004',
    PACIENTE_NOMBRE: 'Ana López',
    SEGURO: 'S003',
    SEGURO_NOMBRE: 'Seguro Internacional',
    EMPRESASEGURO: 'ES003',
    EMPRESASEGURO_NOMBRE: 'Aseguradora Global',
    FECHA_APERTURA: new Date('2023-04-05'),
    FECHA_CIERRE: null,
    NOMBRE: 'Cuenta de cirugía',
    ORIGEN: 'O001',
    ORIGEN_NOMBRE: 'Emergencia',
    ESTADO: '1'
  },
  {
    CUENTAID: 'C005',
    PACIENTE: 'P005',
    PACIENTE_NOMBRE: 'Roberto Sánchez',
    SEGURO: 'S002',
    SEGURO_NOMBRE: 'Seguro Privado',
    EMPRESASEGURO: 'ES002',
    EMPRESASEGURO_NOMBRE: 'Seguro Premium',
    FECHA_APERTURA: new Date('2023-05-12'),
    FECHA_CIERRE: new Date('2023-05-20'),
    NOMBRE: 'Cuenta de laboratorio',
    ORIGEN: 'O002',
    ORIGEN_NOMBRE: 'Consulta Externa',
    ESTADO: '1'
  },
  {
    CUENTAID: 'C006',
    PACIENTE: 'P006',
    PACIENTE_NOMBRE: 'Hilario García',
    SEGURO: 'S001',
    SEGURO_NOMBRE: 'Seguro Público',
    EMPRESASEGURO: 'ES001',
    EMPRESASEGURO_NOMBRE: 'EPS Nacional',
    FECHA_APERTURA: new Date('2023-06-18'),
    FECHA_CIERRE: null,
    NOMBRE: 'Cuenta de hospitalización',
    ORIGEN: 'O001',
    ORIGEN_NOMBRE: 'Emergencia',
    ESTADO: '1'
  }
];

// Función para filtrar cuentas simuladas
function filterMockCuentas(search: string, skip: number, take: number, orderBy: string, orderDirection: 'asc' | 'desc') {
  let filteredCuentas = [...MOCK_CUENTAS];
  
  // Aplicar filtro de búsqueda
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCuentas = filteredCuentas.filter(cuenta => 
      cuenta.CUENTAID.toLowerCase().includes(searchLower) ||
      cuenta.PACIENTE.toLowerCase().includes(searchLower) ||
      cuenta.NOMBRE.toLowerCase().includes(searchLower) ||
      (cuenta.PACIENTE_NOMBRE && cuenta.PACIENTE_NOMBRE.toLowerCase().includes(searchLower))
    );
  }
  
  // Ordenar resultados
  filteredCuentas.sort((a, b) => {
    const aValue = a[orderBy as keyof typeof a];
    const bValue = b[orderBy as keyof typeof b];
    
    if (aValue === bValue) return 0;
    
    // Manejar valores nulos
    if (aValue === null) return orderDirection === 'asc' ? -1 : 1;
    if (bValue === null) return orderDirection === 'asc' ? 1 : -1;
    
    // Ordenar según el tipo de dato
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return orderDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else {
      // Para fechas y otros tipos
      return orderDirection === 'asc'
        ? (aValue < bValue ? -1 : 1)
        : (aValue < bValue ? 1 : -1);
    }
  });
  
  // Aplicar paginación
  return filteredCuentas.slice(skip, skip + take);
}

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
      const result = await prisma.$queryRawUnsafe(query) as Cuenta[]
      
      console.log(`Encontradas ${result.length} cuentas`)
      return result
    } catch (error) {
      console.error('Error en findAll:', error instanceof Error ? error.message : 'Error desconocido')
      
      // En caso de error de conexión, devolver datos simulados
      console.log('Usando datos simulados para cuentas debido a error de conexión')
      const { 
        skip = 0, 
        take = 10, 
        search = '',
        orderBy = 'CUENTAID',
        orderDirection = 'asc'
      } = params
      
      const mockData = filterMockCuentas(search, skip, take, orderBy, orderDirection)
      console.log(`Devolviendo ${mockData.length} cuentas simuladas`)
      return mockData
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
      
      const result = await prisma.$queryRawUnsafe(query) as Cuenta[]
      
      if (!result || result.length === 0) {
        console.log(`No se encontró cuenta con ID: ${id}`)
        return null
      }
      
      console.log(`Cuenta encontrada:`, result[0])
      return result[0]
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido')
      
      // En caso de error de conexión, buscar en datos simulados
      console.log(`Usando datos simulados para buscar cuenta con ID: ${id}`)
      const mockCuenta = MOCK_CUENTAS.find(cuenta => cuenta.CUENTAID === id)
      
      if (mockCuenta) {
        console.log(`Cuenta simulada encontrada:`, mockCuenta)
        return mockCuenta
      } else {
        console.log(`No se encontró cuenta simulada con ID: ${id}`)
        return null
      }
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
      
      const checkResult = await prisma.$queryRawUnsafe(checkQuery) as { descuentos: number, hospitalizaciones: number, obstetricia: number, ordenes: number }[]
      
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
      
      const result = await prisma.$queryRawUnsafe(query) as { count: number }[]
      
      console.log(`Total de cuentas: ${result[0].count}`)
      return result[0].count
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido')
      
      // En caso de error de conexión, contar datos simulados
      console.log('Usando datos simulados para contar cuentas debido a error de conexión')
      const { search = '' } = params
      
      // Filtrar cuentas simuladas según el término de búsqueda
      let filteredCuentas = [...MOCK_CUENTAS]
      
      if (search) {
        const searchLower = search.toLowerCase()
        filteredCuentas = filteredCuentas.filter(cuenta => 
          cuenta.CUENTAID.toLowerCase().includes(searchLower) ||
          cuenta.PACIENTE.toLowerCase().includes(searchLower) ||
          cuenta.NOMBRE.toLowerCase().includes(searchLower) ||
          (cuenta.PACIENTE_NOMBRE && cuenta.PACIENTE_NOMBRE.toLowerCase().includes(searchLower))
        )
      }
      
      console.log(`Total de cuentas simuladas: ${filteredCuentas.length}`)
      return filteredCuentas.length
    }
  }
}
