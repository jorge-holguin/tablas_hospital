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

export class LaboratorioService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.LABORATORIOWhereInput
    orderBy?: Prisma.LABORATORIOOrderByWithRelationInput
  }) {
    const { skip = 0, take = 10, where, orderBy } = params
    
    try {
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código LABORATORIO
            if (condition.LABORATORIO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.LABORATORIO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`LABORATORIO LIKE N'%${searchTerm}%'`);
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
          whereCondition += ` AND ACTIVO = '${where.ACTIVO}'`;
        }
      }
      
      // Construir la cláusula ORDER BY
      let orderByClause = 'LABORATORIO ASC';
      if (orderBy) {
        const field = Object.keys(orderBy)[0];
        const direction = orderBy[field as keyof typeof orderBy];
        if (field && direction) {
          orderByClause = `${field} ${direction}`;
        }
      }
      
      console.log('Where condition:', whereCondition);
      
      // Consulta simplificada para SQL Server 2008
      const query = `
        SELECT TOP ${take} * FROM [dbo].[LABORATORIO] 
        WHERE ${whereCondition} AND LABORATORIO NOT IN (
          SELECT TOP ${skip} LABORATORIO FROM [dbo].[LABORATORIO] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar los valores BigInt antes de devolverlos
      return processBigIntValues(result);
    } catch (error) {
      console.error('Error en findAll de LaboratorioService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async findOne(id: string) {
    return prisma.lABORATORIO.findUnique({
      where: { LABORATORIO: id },
    })
  }

  async create(data: Prisma.LABORATORIOCreateInput) {
    return prisma.lABORATORIO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.LABORATORIOUpdateInput) {
    return prisma.lABORATORIO.update({
      where: { LABORATORIO: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.lABORATORIO.delete({
      where: { LABORATORIO: id },
    })
  }

  async count(params: {
    where?: Prisma.LABORATORIOWhereInput
  }) {
    try {
      const { where } = params
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código LABORATORIO
            if (condition.LABORATORIO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.LABORATORIO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`LABORATORIO LIKE N'%${searchTerm}%'`);
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
          whereCondition += ` AND ACTIVO = '${where.ACTIVO}'`;
        }
      }
      
      console.log('Count where condition:', whereCondition);
      
      // Consulta SQL nativa para contar registros
      const query = `SELECT COUNT(*) as count FROM [dbo].[LABORATORIO] WHERE ${whereCondition}`;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar el resultado para obtener el conteo
      const countResult = processBigIntValues(result);
      return countResult[0]?.count || 0;
    } catch (error) {
      console.error('Error en count de LaboratorioService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
