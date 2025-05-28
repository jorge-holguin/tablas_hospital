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

export class TipoDocumentoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.TIPO_DOCUMENTOWhereInput
    orderBy?: Prisma.TIPO_DOCUMENTOOrderByWithRelationInput
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando tipos de documento con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código TIPO_DOCUMENTO
            if (condition.TIPO_DOCUMENTO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.TIPO_DOCUMENTO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`TIPO_DOCUMENTO LIKE N'%${searchTerm}%'`);
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
      let orderByClause = 'TIPO_DOCUMENTO ASC';
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
        SELECT TOP ${take} * FROM [dbo].[TIPO_DOCUMENTO] 
        WHERE ${whereCondition} AND TIPO_DOCUMENTO NOT IN (
          SELECT TOP ${skip} TIPO_DOCUMENTO FROM [dbo].[TIPO_DOCUMENTO] 
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
      
      console.log(`Encontrados ${processedResult.length} tipos de documento`);
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
      console.log(`Buscando tipo de documento con ID: ${id}`);
      
      // Escapar comillas simples para prevenir SQL injection
      const safeId = id.replace(/'/g, "''");
      
      // Consulta SQL nativa compatible con SQL Server 2008
      const query = `
        SELECT * FROM [dbo].[TIPO_DOCUMENTO]
        WHERE TIPO_DOCUMENTO = N'${safeId}'
      `;
      
      const result = await prisma.$queryRaw(Prisma.raw(query));
      const processedResult = processBigIntValues(result);
      
      console.log(`Tipo de documento encontrado:`, processedResult[0]);
      return processedResult[0] || null;
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async count(params: {
    where?: Prisma.TIPO_DOCUMENTOWhereInput
  }) {
    try {
      const { where } = params;
      console.log('Contando tipos de documento con filtros:', where);
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código TIPO_DOCUMENTO
            if (condition.TIPO_DOCUMENTO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.TIPO_DOCUMENTO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`TIPO_DOCUMENTO LIKE N'%${searchTerm}%'`);
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
      const query = `SELECT COUNT(*) as count FROM [dbo].[TIPO_DOCUMENTO] WHERE ${whereCondition}`;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar el resultado para obtener el conteo
      const countResult = processBigIntValues(result);
      const count = countResult[0]?.count || 0;
      
      console.log(`Total de tipos de transacción:`, count);
      return count;
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async create(data: Prisma.TIPO_TRANSACCIONCreateInput) {
    try {
      console.log('Creando tipo de transacción:', data);
      return prisma.tIPO_TRANSACCION.create({
        data,
      });
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async update(id: string, data: Prisma.TIPO_TRANSACCIONUpdateInput) {
    try {
      console.log(`Actualizando tipo de transacción ${id}:`, data);
      return prisma.tIPO_TRANSACCION.update({
        where: { TIPO_TRANSACCION: id },
        data,
      });
    } catch (error) {
      console.error(`Error en update(${id}):`, error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async delete(id: string) {
    try {
      console.log(`Eliminando tipo de transacción ${id}`);
      return prisma.tIPO_TRANSACCION.delete({
        where: { TIPO_TRANSACCION: id },
      });
    } catch (error) {
      console.error(`Error en delete(${id}):`, error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
