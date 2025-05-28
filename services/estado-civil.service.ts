import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

// Función auxiliar para convertir BigInt a Number o String
function processBigIntValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    // Convertir BigInt a número si es seguro, o a string si es demasiado grande
    return Number.isSafeInteger(Number(obj)) ? Number(obj) : obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(processBigIntValues);
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = processBigIntValues(obj[key]);
    }
    return result;
  }

  return obj;
}

export class EstadoCivilService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.ESTADO_CIVILWhereInput
    orderBy?: Prisma.ESTADO_CIVILOrderByWithRelationInput
  }) {
    const { skip = 0, take = 10, where, orderBy } = params
    
    try {
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por ESTADO_CIVIL o NOMBRE
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código ESTADO_CIVIL
            if (condition.ESTADO_CIVIL?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.ESTADO_CIVIL.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`ESTADO_CIVIL LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por NOMBRE
            if (condition.NOMBRE?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.NOMBRE.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`NOMBRE LIKE N'%${searchTerm}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado activo
        if (where.ACTIVO !== undefined) {
          whereCondition += ` AND ACTIVO = ${where.ACTIVO}`;
        }
      }
      
      // Construir la cláusula ORDER BY
      let orderByClause = 'ESTADO_CIVIL ASC';
      if (orderBy) {
        const field = Object.keys(orderBy)[0];
        const direction = orderBy[field as keyof typeof orderBy];
        if (field && direction) {
          orderByClause = `${field} ${direction}`;
        }
      }
      
      // Consulta simplificada para SQL Server 2008
      const query = `
        SELECT TOP ${take} * FROM [dbo].[ESTADO_CIVIL] 
        WHERE ${whereCondition} AND ESTADO_CIVIL NOT IN (
          SELECT TOP ${skip} ESTADO_CIVIL FROM [dbo].[ESTADO_CIVIL] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar los valores BigInt antes de devolverlos
      return processBigIntValues(result);
    } catch (error) {
      console.error('Error en findAll de EstadoCivilService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async findOne(id: string) {
    return prisma.eSTADO_CIVIL.findUnique({
      where: { ESTADO_CIVIL: id },
    })
  }

  async create(data: Prisma.ESTADO_CIVILCreateInput) {
    return prisma.eSTADO_CIVIL.create({
      data,
    })
  }

  async update(id: string, data: Prisma.ESTADO_CIVILUpdateInput) {
    return prisma.eSTADO_CIVIL.update({
      where: { ESTADO_CIVIL: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.eSTADO_CIVIL.delete({
      where: { ESTADO_CIVIL: id },
    })
  }

  async count(params: {
    where?: Prisma.ESTADO_CIVILWhereInput
  }) {
    try {
      const { where } = params
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por ESTADO_CIVIL o NOMBRE
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código ESTADO_CIVIL
            if (condition.ESTADO_CIVIL?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.ESTADO_CIVIL.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`ESTADO_CIVIL LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por NOMBRE
            if (condition.NOMBRE?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.NOMBRE.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`NOMBRE LIKE N'%${searchTerm}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado activo
        if (where.ACTIVO !== undefined) {
          whereCondition += ` AND ACTIVO = ${where.ACTIVO}`;
        }
      }
      
      // Consulta SQL nativa para contar registros
      const query = `SELECT COUNT(*) as total FROM [dbo].[ESTADO_CIVIL] WHERE ${whereCondition}`;
      
      // Ejecutar la consulta nativa
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Extraer el conteo del resultado
      const total = result[0].total;
      
      return total;
    } catch (error) {
      console.error('Error en count de EstadoCivilService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
