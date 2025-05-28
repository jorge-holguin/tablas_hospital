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

export class CiexhisV2Service {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.CIEXHIS_V2WhereInput
    orderBy?: Prisma.CIEXHIS_V2OrderByWithRelationInput
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando diagnósticos HIS V2 con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if ('CODIGO' in condition && condition.CODIGO.contains) {
              orConditions.push(`CODIGO LIKE '%${condition.CODIGO.contains}%'`);
            }
            if ('NOMBRE' in condition && condition.NOMBRE.contains) {
              orConditions.push(`NOMBRE LIKE '%${condition.NOMBRE.contains}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado
        if ('EST' in where) {
          whereCondition += ` AND EST = '${where.EST}'`;
        }
        
        // Manejar filtro por clase
        if ('CLASE' in where) {
          whereCondition += ` AND CLASE = '${where.CLASE}'`;
        }
        
        // Manejar filtro por tipo
        if ('TIPO' in where) {
          whereCondition += ` AND TIPO = '${where.TIPO}'`;
        }
        
        // Manejar filtro por sexo
        if ('SEXO' in where) {
          whereCondition += ` AND SEXO = '${where.SEXO}'`;
          console.log('Aplicando filtro por SEXO:', where.SEXO);
        }
      }
      
      // Determinar ordenamiento
      let orderByClause = 'CODORD ASC';
      if (orderBy) {
        if ('CODORD' in orderBy) {
          orderByClause = `CODORD ${orderBy.CODORD === 'asc' ? 'ASC' : 'DESC'}`;
        } else if ('CODIGO' in orderBy) {
          orderByClause = `CODIGO ${orderBy.CODIGO === 'asc' ? 'ASC' : 'DESC'}`;
        } else if ('NOMBRE' in orderBy) {
          orderByClause = `NOMBRE ${orderBy.NOMBRE === 'asc' ? 'ASC' : 'DESC'}`;
        }
      }
      
      // Consulta SQL para obtener los datos paginados
      const query = `
        SELECT TOP ${take} * FROM [dbo].[CIEXHIS_V2] 
        WHERE ${whereCondition} AND CODORD NOT IN (
          SELECT TOP ${skip} CODORD FROM [dbo].[CIEXHIS_V2] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Query:', query);
      
      const result = await prisma.$queryRawUnsafe(query);
      
      return processBigIntValues(result);
    } catch (error) {
      console.error('Error en findAll de CiexhisV2Service:', error);
      throw error;
    }
  }
  
  async findOne(id: number) {
    try {
      const diagnostico = await prisma.cIEXHIS_V2.findUnique({
        where: { CODORD: id }
      });
      
      return processBigIntValues(diagnostico);
    } catch (error) {
      console.error(`Error en findOne de CiexhisV2Service para id ${id}:`, error);
      throw error;
    }
  }
  
  async count(params: { where?: Prisma.CIEXHIS_V2WhereInput }) {
    try {
      const { where } = params;
      
      // Construir la condición WHERE para la consulta SQL
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if ('CODIGO' in condition && condition.CODIGO.contains) {
              orConditions.push(`CODIGO LIKE '%${condition.CODIGO.contains}%'`);
            }
            if ('NOMBRE' in condition && condition.NOMBRE.contains) {
              orConditions.push(`NOMBRE LIKE '%${condition.NOMBRE.contains}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado
        if ('EST' in where) {
          whereCondition += ` AND EST = '${where.EST}'`;
        }
        
        // Manejar filtro por clase
        if ('CLASE' in where) {
          whereCondition += ` AND CLASE = '${where.CLASE}'`;
        }
        
        // Manejar filtro por tipo
        if ('TIPO' in where) {
          whereCondition += ` AND TIPO = '${where.TIPO}'`;
        }
        
        // Manejar filtro por sexo
        if ('SEXO' in where) {
          whereCondition += ` AND SEXO = '${where.SEXO}'`;
          console.log('Aplicando filtro por SEXO en count:', where.SEXO);
        }
      }
      
      // Consulta SQL para contar registros
      const query = `
        SELECT COUNT(*) as total FROM [dbo].[CIEXHIS_V2] 
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
      console.error('Error en count de CiexhisV2Service:', error);
      throw error;
    }
  }
}
