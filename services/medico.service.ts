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

export class MedicoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.MEDICOWhereInput
    orderBy?: Prisma.MEDICOOrderByWithRelationInput
  }) {
    const { skip = 0, take = 10, where, orderBy } = params
    
    try {
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por nombre o colegio
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código MEDICO
            if (condition.MEDICO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.MEDICO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`MEDICO LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por NOMBRE
            if (condition.NOMBRE?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.NOMBRE.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`NOMBRE LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por COLEGIO
            if (condition.COLEGIO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.COLEGIO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`COLEGIO LIKE N'%${searchTerm}%'`);
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
      let orderByClause = 'MEDICO DESC';
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
        SELECT TOP ${take} * FROM [dbo].[MEDICO] 
        WHERE ${whereCondition} AND MEDICO NOT IN (
          SELECT TOP ${skip} MEDICO FROM [dbo].[MEDICO] 
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
      console.error('Error en findAll de MedicoService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async findOne(id: string) {
    return prisma.mEDICO.findUnique({
      where: { MEDICO: id },
    })
  }

  async create(data: Prisma.MEDICOCreateInput) {
    return prisma.mEDICO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.MEDICOUpdateInput) {
    return prisma.mEDICO.update({
      where: { MEDICO: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.mEDICO.delete({
      where: { MEDICO: id },
    })
  }

  async count(params: {
    where?: Prisma.MEDICOWhereInput
  }) {
    try {
      const { where } = params
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por nombre o colegio
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código MEDICO
            if (condition.MEDICO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.MEDICO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`MEDICO LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por NOMBRE
            if (condition.NOMBRE?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.NOMBRE.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`NOMBRE LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por COLEGIO
            if (condition.COLEGIO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.COLEGIO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`COLEGIO LIKE N'%${searchTerm}%'`);
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
      
      console.log('Count where condition:', whereCondition);
      
      // Consulta SQL nativa para contar registros
      const query = `SELECT COUNT(*) as count FROM [dbo].[MEDICO] WHERE ${whereCondition}`;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar el resultado para obtener el conteo
      const countResult = processBigIntValues(result);
      return countResult[0]?.count || 0;
    } catch (error) {
      console.error('Error en count de MedicoService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
