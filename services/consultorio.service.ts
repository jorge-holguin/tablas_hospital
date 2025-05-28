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

export class ConsultorioService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.CONSULTORIOWhereInput
    orderBy?: Prisma.CONSULTORIOOrderByWithRelationInput
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
            // Buscar por código CONSULTORIO
            if (condition.CONSULTORIO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.CONSULTORIO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`CONSULTORIO LIKE N'%${searchTerm}%'`);
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
        
        // Manejar filtro por tipo
        if (where.TIPO !== undefined && where.TIPO !== null && where.TIPO !== '') {
          whereCondition += ` AND TIPO = '${where.TIPO}'`;
          console.log('Aplicando filtro por TIPO:', where.TIPO, typeof where.TIPO);
        }
      }
      
      // Construir la cláusula ORDER BY
      let orderByClause = 'CONSULTORIO ASC';
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
        SELECT TOP ${take} * FROM [dbo].[CONSULTORIO] 
        WHERE ${whereCondition} AND CONSULTORIO NOT IN (
          SELECT TOP ${skip} CONSULTORIO FROM [dbo].[CONSULTORIO] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Query:', query);
      
      const result = await prisma.$queryRawUnsafe(query);
      
      return processBigIntValues(result);
    } catch (error) {
      console.error('Error en findAll de ConsultorioService:', error);
      throw error;
    }
  }
  
  async findOne(id: string) {
    try {
      const consultorio = await prisma.cONSULTORIO.findUnique({
        where: { CONSULTORIO: id }
      });
      
      return processBigIntValues(consultorio);
    } catch (error) {
      console.error(`Error en findOne de ConsultorioService para id ${id}:`, error);
      throw error;
    }
  }
  
  async create(data: Prisma.CONSULTORIOCreateInput) {
    try {
      const consultorio = await prisma.cONSULTORIO.create({
        data
      });
      
      return processBigIntValues(consultorio);
    } catch (error) {
      console.error('Error en create de ConsultorioService:', error);
      throw error;
    }
  }
  
  async update(id: string, data: Prisma.CONSULTORIOUpdateInput) {
    try {
      const consultorio = await prisma.cONSULTORIO.update({
        where: { CONSULTORIO: id },
        data
      });
      
      return processBigIntValues(consultorio);
    } catch (error) {
      console.error(`Error en update de ConsultorioService para id ${id}:`, error);
      throw error;
    }
  }
  
  async delete(id: string) {
    try {
      await prisma.cONSULTORIO.delete({
        where: { CONSULTORIO: id }
      });
      
      return { success: true };
    } catch (error) {
      console.error(`Error en delete de ConsultorioService para id ${id}:`, error);
      throw error;
    }
  }
  
  async count(params: { where?: Prisma.CONSULTORIOWhereInput }) {
    try {
      const { where } = params;
      
      // Construir la condición WHERE para la consulta SQL
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if (condition.CONSULTORIO?.contains) {
              const searchTerm = condition.CONSULTORIO.contains.replace(/'/g, "''");
              orConditions.push(`CONSULTORIO LIKE N'%${searchTerm}%'`);
            }
            
            if (condition.NOMBRE?.contains) {
              const searchTerm = condition.NOMBRE.contains.replace(/'/g, "''");
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
        
        // Manejar filtro por tipo
        if (where.TIPO !== undefined && where.TIPO !== null && where.TIPO !== '') {
          whereCondition += ` AND TIPO = '${where.TIPO}'`;
          console.log('Aplicando filtro por TIPO en count:', where.TIPO, typeof where.TIPO);
        }
      }
      
      // Consulta SQL para contar registros
      const query = `
        SELECT COUNT(*) as total FROM [dbo].[CONSULTORIO] 
        WHERE ${whereCondition}
      `;
      
      console.log('Query de conteo:', query);
      
      const result = await prisma.$queryRawUnsafe(query);
      const countResult = result as { total: number | bigint }[];
      
      // Asegurarse de que el resultado sea un número
      let totalCount = 0;
      if (countResult && countResult.length > 0) {
        const total = countResult[0].total;
        totalCount = typeof total === 'bigint' ? Number(total) : total;
      }
      
      return totalCount;
    } catch (error) {
      console.error('Error en count de ConsultorioService:', error);
      throw error;
    }
  }
}
