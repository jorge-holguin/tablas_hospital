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

export class PresentacionService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.PRESENTACIONWhereInput
    orderBy?: Prisma.PRESENTACIONOrderByWithRelationInput
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando presentaciones con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código PRESENTACION
            if (condition.PRESENTACION?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.PRESENTACION.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`PRESENTACION LIKE N'%${searchTerm}%'`);
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
      let orderByClause = 'PRESENTACION ASC';
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
        SELECT TOP ${take} * FROM [dbo].[PRESENTACION] 
        WHERE ${whereCondition} AND PRESENTACION NOT IN (
          SELECT TOP ${skip} PRESENTACION FROM [dbo].[PRESENTACION] 
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
      
      console.log(`Encontradas ${processedResult.length} presentaciones`);
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
      console.log(`Buscando presentación con ID: ${id}`);
      
      // Escapar comillas simples para prevenir SQL injection
      const safeId = id.replace(/'/g, "''");
      
      // Consulta SQL nativa compatible con SQL Server 2008
      const query = `
        SELECT * FROM [dbo].[PRESENTACION]
        WHERE PRESENTACION = N'${safeId}'
      `;
      
      const result = await prisma.$queryRaw(Prisma.raw(query));
      const processedResult = processBigIntValues(result);
      
      console.log(`Presentación encontrada:`, processedResult[0]);
      return processedResult[0] || null;
    } catch (error) {
      console.error(`Error en findOne(${id}):`, {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async create(data: Prisma.PRESENTACIONCreateInput) {
    try {
      console.log('Creando presentación con datos:', data);
      return prisma.pRESENTACION.create({
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

  async update(id: string, data: Prisma.PRESENTACIONUpdateInput) {
    try {
      console.log(`Actualizando presentación ${id} con datos:`, data);
      return prisma.pRESENTACION.update({
        where: { PRESENTACION: id },
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

  async deleteMany(ids: string[]) {
    try {
      console.log(`Eliminando múltiples presentaciones: ${ids.join(', ')}`);
      return prisma.pRESENTACION.deleteMany({
        where: { PRESENTACION: { in: ids } },
      });
    } catch (error) {
      console.error('Error en deleteMany:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async delete(id: string) {
    try {
      console.log(`Eliminando presentación ${id}`);
      return prisma.pRESENTACION.delete({
        where: { PRESENTACION: id },
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
    where?: Prisma.PRESENTACIONWhereInput
  }) {
    try {
      const { where } = params;
      console.log('Contando presentaciones con filtros:', where);
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código PRESENTACION
            if (condition.PRESENTACION?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.PRESENTACION.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`PRESENTACION LIKE N'%${searchTerm}%'`);
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
      const query = `SELECT COUNT(*) as count FROM [dbo].[PRESENTACION] WHERE ${whereCondition}`;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar el resultado para obtener el conteo
      const countResult = processBigIntValues(result);
      const count = countResult[0]?.count || 0;
      
      console.log(`Total de presentaciones: ${count}`);
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
