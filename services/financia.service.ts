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

export class FinanciaService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: any
    orderBy?: any
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando financiamientos con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if ('FINANCIA' in condition && condition.FINANCIA.contains) {
              orConditions.push(`FINANCIA LIKE '%${condition.FINANCIA.contains}%'`);
            }
            if ('NOMBRE' in condition && condition.NOMBRE.contains) {
              orConditions.push(`NOMBRE LIKE '%${condition.NOMBRE.contains}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
      }
      
      // Determinar ordenamiento
      let orderByClause = 'FINANCIA ASC';
      if (orderBy) {
        if ('FINANCIA' in orderBy) {
          orderByClause = `FINANCIA ${orderBy.FINANCIA === 'asc' ? 'ASC' : 'DESC'}`;
        } else if ('NOMBRE' in orderBy) {
          orderByClause = `NOMBRE ${orderBy.NOMBRE === 'asc' ? 'ASC' : 'DESC'}`;
        }
      }
      
      // Consulta SQL para obtener los datos paginados
      const query = `
        SELECT TOP ${take} * FROM [dbo].[FINANCIA] 
        WHERE ${whereCondition} AND FINANCIA NOT IN (
          SELECT TOP ${skip} FINANCIA FROM [dbo].[FINANCIA] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Ejecutando consulta SQL:', query);
      
      const result = await prisma.$queryRawUnsafe(query);
      return processBigIntValues(result);
      
    } catch (error) {
      console.error('Error en findAll de FinanciaService:', error);
      throw error;
    }
  }
  
  async findOne(id: string) {
    try {
      const query = `
        SELECT * FROM [dbo].[FINANCIA] 
        WHERE FINANCIA = '${id}'
      `;
      
      const result = await prisma.$queryRawUnsafe(query);
      const data = processBigIntValues(result);
      
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Error en findOne de FinanciaService para id ${id}:`, error);
      throw error;
    }
  }
  
  async create(data: any) {
    try {
      // Validar campos requeridos
      if (!data.FINANCIA || !data.NOMBRE) {
        throw new Error('Los campos FINANCIA y NOMBRE son obligatorios');
      }
      
      // Verificar si ya existe
      const exists = await this.findOne(data.FINANCIA);
      if (exists) {
        throw new Error(`Ya existe un financiamiento con el código ${data.FINANCIA}`);
      }
      
      // Preparar campos para la inserción
      const fields = ['FINANCIA', 'NOMBRE'];
      const values = [`'${data.FINANCIA}'`, `'${data.NOMBRE}'`];
      
      // Consulta de inserción
      const query = `
        INSERT INTO [dbo].[FINANCIA] (${fields.join(', ')})
        VALUES (${values.join(', ')})
      `;
      
      await prisma.$executeRawUnsafe(query);
      
      // Retornar el registro creado
      return this.findOne(data.FINANCIA);
    } catch (error) {
      console.error('Error en create de FinanciaService:', error);
      throw error;
    }
  }
  
  async update(id: string, data: any) {
    try {
      // Verificar si existe
      const exists = await this.findOne(id);
      if (!exists) {
        throw new Error(`No existe un financiamiento con el código ${id}`);
      }
      
      // Preparar campos para la actualización
      const updateFields = [];
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE}'`);
      }
      
      if (updateFields.length === 0) {
        return exists; // No hay campos para actualizar
      }
      
      // Consulta de actualización
      const query = `
        UPDATE [dbo].[FINANCIA]
        SET ${updateFields.join(', ')}
        WHERE FINANCIA = '${id}'
      `;
      
      await prisma.$executeRawUnsafe(query);
      
      // Retornar el registro actualizado
      return this.findOne(id);
    } catch (error) {
      console.error(`Error en update de FinanciaService para id ${id}:`, error);
      throw error;
    }
  }
  
  async delete(id: string) {
    try {
      // Verificar si existe
      const exists = await this.findOne(id);
      if (!exists) {
        throw new Error(`No existe un financiamiento con el código ${id}`);
      }
      
      // Consulta de eliminación
      const query = `
        DELETE FROM [dbo].[FINANCIA]
        WHERE FINANCIA = '${id}'
      `;
      
      await prisma.$executeRawUnsafe(query);
      
      return { success: true };
    } catch (error) {
      console.error(`Error en delete de FinanciaService para id ${id}:`, error);
      throw error;
    }
  }
  
  async count(params: { where?: any }) {
    try {
      const { where } = params;
      
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if ('FINANCIA' in condition && condition.FINANCIA.contains) {
              orConditions.push(`FINANCIA LIKE '%${condition.FINANCIA.contains}%'`);
            }
            if ('NOMBRE' in condition && condition.NOMBRE.contains) {
              orConditions.push(`NOMBRE LIKE '%${condition.NOMBRE.contains}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [dbo].[FINANCIA]
        WHERE ${whereCondition}
      `;
      
      const result = await prisma.$queryRawUnsafe(query);
      const count = processBigIntValues(result);
      
      return count[0]?.count || 0;
    } catch (error) {
      console.error('Error en count de FinanciaService:', error);
      throw error;
    }
  }
}
