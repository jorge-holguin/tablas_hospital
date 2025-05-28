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

export class SeguroService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.SEGUROWhereInput
    orderBy?: Prisma.SEGUROOrderByWithRelationInput
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando seguros con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if ('SEGURO' in condition && condition.SEGURO.contains) {
              orConditions.push(`SEGURO LIKE '%${condition.SEGURO.contains}%'`);
            }
            if ('NOMBRE' in condition && condition.NOMBRE.contains) {
              orConditions.push(`NOMBRE LIKE '%${condition.NOMBRE.contains}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado activo
        if ('ACTIVO' in where) {
          whereCondition += ` AND ACTIVO = '${where.ACTIVO}'`;
        }
      }
      
      // Determinar ordenamiento
      let orderByClause = 'SEGURO ASC';
      if (orderBy) {
        if ('SEGURO' in orderBy) {
          orderByClause = `SEGURO ${orderBy.SEGURO === 'asc' ? 'ASC' : 'DESC'}`;
        } else if ('NOMBRE' in orderBy) {
          orderByClause = `NOMBRE ${orderBy.NOMBRE === 'asc' ? 'ASC' : 'DESC'}`;
        }
      }
      
      // Consulta SQL para obtener los datos paginados
      const query = `
        SELECT TOP ${take} * FROM [dbo].[SEGURO] 
        WHERE ${whereCondition} AND SEGURO NOT IN (
          SELECT TOP ${skip} SEGURO FROM [dbo].[SEGURO] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Ejecutando consulta SQL:', query);
      
      const result = await prisma.$queryRawUnsafe(query);
      return processBigIntValues(result);
      
    } catch (error) {
      console.error('Error en findAll de SeguroService:', error);
      throw error;
    }
  }
  
  async findOne(id: string) {
    try {
      const query = `
        SELECT * FROM [dbo].[SEGURO] 
        WHERE SEGURO = '${id}'
      `;
      
      const result = await prisma.$queryRawUnsafe(query);
      const data = processBigIntValues(result);
      
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Error en findOne de SeguroService para id ${id}:`, error);
      throw error;
    }
  }
  
  async create(data: any) {
    try {
      // Validar campos requeridos
      if (!data.SEGURO || !data.NOMBRE) {
        throw new Error('Los campos SEGURO y NOMBRE son obligatorios');
      }
      
      // Verificar si ya existe
      const exists = await this.findOne(data.SEGURO);
      if (exists) {
        throw new Error(`Ya existe un seguro con el código ${data.SEGURO}`);
      }
      
      // Preparar campos para la inserción
      const fields = ['SEGURO', 'NOMBRE'];
      const values = [`'${data.SEGURO}'`, `'${data.NOMBRE}'`];
      
      // Campos opcionales
      if (data.ACTIVO !== undefined) {
        fields.push('ACTIVO');
        values.push(`'${data.ACTIVO}'`);
      }
      
      if (data.TIPO_SEGURO !== undefined) {
        fields.push('TIPO_SEGURO');
        values.push(`'${data.TIPO_SEGURO}'`);
      }
      
      if (data.ABREVIATURA !== undefined) {
        fields.push('ABREVIATURA');
        values.push(`'${data.ABREVIATURA}'`);
      }
      
      if (data.DESCRIPCION !== undefined) {
        fields.push('DESCRIPCION');
        values.push(`'${data.DESCRIPCION}'`);
      }
      
      // Consulta de inserción
      const query = `
        INSERT INTO [dbo].[SEGURO] (${fields.join(', ')})
        VALUES (${values.join(', ')})
      `;
      
      await prisma.$executeRawUnsafe(query);
      
      // Retornar el registro creado
      return this.findOne(data.SEGURO);
    } catch (error) {
      console.error('Error en create de SeguroService:', error);
      throw error;
    }
  }
  
  async update(id: string, data: any) {
    try {
      // Verificar si existe
      const exists = await this.findOne(id);
      if (!exists) {
        throw new Error(`No existe un seguro con el código ${id}`);
      }
      
      // Preparar campos para la actualización
      const updateFields = [];
      
      if (data.NOMBRE !== undefined) {
        updateFields.push(`NOMBRE = '${data.NOMBRE}'`);
      }
      
      if (data.ACTIVO !== undefined) {
        updateFields.push(`ACTIVO = '${data.ACTIVO}'`);
      }
      
      if (data.TIPO_SEGURO !== undefined) {
        updateFields.push(`TIPO_SEGURO = '${data.TIPO_SEGURO}'`);
      }
      
      if (data.ABREVIATURA !== undefined) {
        updateFields.push(`ABREVIATURA = '${data.ABREVIATURA}'`);
      }
      
      if (data.DESCRIPCION !== undefined) {
        updateFields.push(`DESCRIPCION = '${data.DESCRIPCION}'`);
      }
      
      if (updateFields.length === 0) {
        return exists; // No hay campos para actualizar
      }
      
      // Consulta de actualización
      const query = `
        UPDATE [dbo].[SEGURO]
        SET ${updateFields.join(', ')}
        WHERE SEGURO = '${id}'
      `;
      
      await prisma.$executeRawUnsafe(query);
      
      // Retornar el registro actualizado
      return this.findOne(id);
    } catch (error) {
      console.error(`Error en update de SeguroService para id ${id}:`, error);
      throw error;
    }
  }
  
  async delete(id: string) {
    try {
      // Verificar si existe
      const exists = await this.findOne(id);
      if (!exists) {
        throw new Error(`No existe un seguro con el código ${id}`);
      }
      
      // Consulta de eliminación
      const query = `
        DELETE FROM [dbo].[SEGURO]
        WHERE SEGURO = '${id}'
      `;
      
      await prisma.$executeRawUnsafe(query);
      
      return { success: true };
    } catch (error) {
      console.error(`Error en delete de SeguroService para id ${id}:`, error);
      throw error;
    }
  }
  
  async count(params: { where?: Prisma.SEGUROWhereInput }) {
    try {
      const { where } = params;
      
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            if ('SEGURO' in condition && condition.SEGURO.contains) {
              orConditions.push(`SEGURO LIKE '%${condition.SEGURO.contains}%'`);
            }
            if ('NOMBRE' in condition && condition.NOMBRE.contains) {
              orConditions.push(`NOMBRE LIKE '%${condition.NOMBRE.contains}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado activo
        if ('ACTIVO' in where) {
          whereCondition += ` AND ACTIVO = '${where.ACTIVO}'`;
        }
      }
      
      const query = `
        SELECT COUNT(*) as count FROM [dbo].[SEGURO]
        WHERE ${whereCondition}
      `;
      
      const result = await prisma.$queryRawUnsafe(query);
      const count = processBigIntValues(result);
      
      return count[0]?.count || 0;
    } catch (error) {
      console.error('Error en count de SeguroService:', error);
      throw error;
    }
  }
}
