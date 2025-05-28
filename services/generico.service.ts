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

export class GenericoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.GENERICOWhereInput
    orderBy?: Prisma.GENERICOOrderByWithRelationInput
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando genéricos con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código GENERICO
            if (condition.GENERICO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.GENERICO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`GENERICO LIKE N'%${searchTerm}%'`);
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
      let orderByClause = 'GENERICO ASC';
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
        SELECT TOP ${take} * FROM [dbo].[GENERICO] 
        WHERE ${whereCondition} AND GENERICO NOT IN (
          SELECT TOP ${skip} GENERICO FROM [dbo].[GENERICO] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar los valores BigInt antes de devolverlos
      const processedResult = processBigIntValues(result);
      
      console.log(`Encontrados ${processedResult.length} genéricos`);
      return processedResult;
    } catch (error) {
      console.error('Error en findAll:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando genérico con ID: ${id}`);
      
      // Escapar comillas simples para prevenir SQL injection
      const safeId = id.replace(/'/g, "''");
      
      // Consulta SQL nativa compatible con SQL Server 2008
      const query = `
        SELECT * FROM [dbo].[GENERICO]
        WHERE GENERICO = N'${safeId}'
      `;
      
      const result = await prisma.$queryRaw(Prisma.raw(query));
      const processedResult = processBigIntValues(result);
      
      console.log(`Genérico encontrado:`, processedResult[0]);
      return processedResult[0] || null;
    } catch (error) {
      console.error(`Error en findOne(${id}):`, {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async create(data: Prisma.GENERICOCreateInput) {
    try {
      console.log('Creando genérico con datos:', data);
      return prisma.gENERICO.create({
        data,
      });
    } catch (error) {
      console.error('Error en create:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async update(id: string, data: Prisma.GENERICOUpdateInput) {
    try {
      console.log(`Actualizando genérico ${id} con datos:`, data);
      return prisma.gENERICO.update({
        where: { GENERICO: id },
        data,
      });
    } catch (error) {
      console.error(`Error en update(${id}):`, {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async delete(id: string) {
    try {
      console.log(`Eliminando genérico ${id}`);
      return prisma.gENERICO.delete({
        where: { GENERICO: id },
      });
    } catch (error) {
      console.error(`Error en delete(${id}):`, {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async count(params: {
    where?: Prisma.GENERICOWhereInput
  }) {
    try {
      const { where } = params;
      console.log('Contando genéricos con filtros:', where);
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código GENERICO
            if (condition.GENERICO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.GENERICO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`GENERICO LIKE N'%${searchTerm}%'`);
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
      const query = `SELECT COUNT(*) as count FROM [dbo].[GENERICO] WHERE ${whereCondition}`;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar el resultado para obtener el conteo
      const countResult = processBigIntValues(result);
      const count = countResult[0]?.count || 0;
      
      console.log(`Total de genéricos: ${count}`);
      return count;
    } catch (error) {
      console.error('Error en count:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
