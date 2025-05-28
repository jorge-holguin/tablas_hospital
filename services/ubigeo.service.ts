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

export class UbigeoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.UBIGEOWhereInput
    orderBy?: Prisma.UBIGEOOrderByWithRelationInput
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando ubigeos con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if ('UBIGEO' in condition && condition.UBIGEO.contains) {
              orConditions.push(`UBIGEO LIKE '%${condition.UBIGEO.contains}%'`);
            }
            if ('DISTRITO' in condition && condition.DISTRITO.contains) {
              orConditions.push(`DISTRITO LIKE '%${condition.DISTRITO.contains}%'`);
            }
            if ('PROVINCIA' in condition && condition.PROVINCIA.contains) {
              orConditions.push(`PROVINCIA LIKE '%${condition.PROVINCIA.contains}%'`);
            }
            if ('DEPARTAMENTO' in condition && condition.DEPARTAMENTO.contains) {
              orConditions.push(`DEPARTAMENTO LIKE '%${condition.DEPARTAMENTO.contains}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado activo
        if ('ACTIVO' in where) {
          whereCondition += ` AND ACTIVO = ${where.ACTIVO}`;
        }
      }
      
      // Determinar ordenamiento
      let orderByClause = 'UBIGEO ASC';
      if (orderBy) {
        if ('UBIGEO' in orderBy) {
          orderByClause = `UBIGEO ${orderBy.UBIGEO === 'asc' ? 'ASC' : 'DESC'}`;
        } else if ('DISTRITO' in orderBy) {
          orderByClause = `DISTRITO ${orderBy.DISTRITO === 'asc' ? 'ASC' : 'DESC'}`;
        } else if ('PROVINCIA' in orderBy) {
          orderByClause = `PROVINCIA ${orderBy.PROVINCIA === 'asc' ? 'ASC' : 'DESC'}`;
        } else if ('DEPARTAMENTO' in orderBy) {
          orderByClause = `DEPARTAMENTO ${orderBy.DEPARTAMENTO === 'asc' ? 'ASC' : 'DESC'}`;
        }
      }
      
      // Consulta SQL para obtener los datos paginados
      const query = `
        SELECT TOP ${take} * FROM [dbo].[UBIGEO] 
        WHERE ${whereCondition} AND UBIGEO NOT IN (
          SELECT TOP ${skip} UBIGEO FROM [dbo].[UBIGEO] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Ejecutando consulta SQL:', query);
      
      const result = await prisma.$queryRawUnsafe(query);
      return processBigIntValues(result);
      
    } catch (error) {
      console.error('Error en findAll de UbigeoService:', error);
      throw error;
    }
  }
  
  async findOne(id: string) {
    try {
      const ubigeo = await prisma.uBIGEO.findUnique({
        where: { UBIGEO: id }
      });
      
      return processBigIntValues(ubigeo);
    } catch (error) {
      console.error(`Error en findOne de UbigeoService para id ${id}:`, error);
      throw error;
    }
  }
  
  async create(data: Prisma.UBIGEOCreateInput) {
    try {
      const ubigeo = await prisma.uBIGEO.create({
        data
      });
      
      return processBigIntValues(ubigeo);
    } catch (error) {
      console.error('Error en create de UbigeoService:', error);
      throw error;
    }
  }
  
  async update(id: string, data: Prisma.UBIGEOUpdateInput) {
    try {
      const ubigeo = await prisma.uBIGEO.update({
        where: { UBIGEO: id },
        data
      });
      
      return processBigIntValues(ubigeo);
    } catch (error) {
      console.error(`Error en update de UbigeoService para id ${id}:`, error);
      throw error;
    }
  }
  
  async delete(id: string) {
    try {
      await prisma.uBIGEO.delete({
        where: { UBIGEO: id }
      });
      
      return { success: true };
    } catch (error) {
      console.error(`Error en delete de UbigeoService para id ${id}:`, error);
      throw error;
    }
  }
  
  async count(params: { where?: Prisma.UBIGEOWhereInput }) {
    try {
      const { where } = params;
      
      const count = await prisma.uBIGEO.count({
        where
      });
      
      return count;
    } catch (error) {
      console.error('Error en count de UbigeoService:', error);
      throw error;
    }
  }
}
