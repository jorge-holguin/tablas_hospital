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

export class DiagnosticoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.oeiDiagnosticoDetalleWhereInput
    orderBy?: Prisma.oeiDiagnosticoDetalleOrderByWithRelationInput
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('Buscando diagnósticos con parámetros:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o descripción
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código Codigo
            if (condition.Codigo?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.Codigo.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`Codigo LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por Descripcion
            if (condition.Descripcion?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.Descripcion.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`Descripcion LIKE N'%${searchTerm}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado activo
        if (where.Activo !== undefined) {
          whereCondition += ` AND Activo = ${where.Activo ? 1 : 0}`;
        }
      }
      
      // Construir la cláusula ORDER BY
      let orderByClause = 'Codigo ASC';
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
        SELECT TOP ${take} * FROM [dbo].[oeiDiagnosticoDetalle] 
        WHERE ${whereCondition} AND Codigo NOT IN (
          SELECT TOP ${skip} Codigo FROM [dbo].[oeiDiagnosticoDetalle] 
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
      
      console.log(`Encontrados ${processedResult.length} diagnósticos`);
      
      // Imprimir los primeros 3 resultados para depuración
      if (processedResult.length > 0) {
        console.log('Muestra de diagnósticos:', processedResult.slice(0, 3));
      }
      
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
      console.log(`Buscando diagnóstico con ID: ${id}`);
      
      // Escapar comillas simples para prevenir SQL injection
      const safeId = id.replace(/'/g, "''");
      
      // Consulta SQL nativa compatible con SQL Server 2008
      const query = `
        SELECT TOP 1 * FROM [dbo].[oeiDiagnosticoDetalle]
        WHERE Codigo = N'${safeId}'
      `;
      
      const result = await prisma.$queryRaw(Prisma.raw(query));
      const processedResult = processBigIntValues(result);
      
      console.log(`Diagnóstico encontrado:`, processedResult[0]);
      return processedResult[0] || null;
    } catch (error) {
      console.error(`Error en findOne(${id}):`, {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async create(data: Prisma.oeiDiagnosticoDetalleCreateInput) {
    try {
      console.log('Creando diagnóstico con datos:', data);
      return prisma.oeiDiagnosticoDetalle.create({
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

  async update(id: string, data: Prisma.oeiDiagnosticoDetalleUpdateInput) {
    try {
      console.log(`Actualizando diagnóstico ${id} con datos:`, data);
      
      // Usar updateMany en lugar de update ya que no hay clave primaria
      const result = await prisma.oeiDiagnosticoDetalle.updateMany({
        where: { Codigo: id },
        data,
      });
      
      // Si se actualizó con éxito, obtener el registro actualizado
      if (result.count > 0) {
        // Usar nuestra versión SQL Server 2008 compatible de findOne
        const updatedRecord = await this.findOne(id);
        console.log('Diagnóstico actualizado:', updatedRecord);
        return updatedRecord;
      }
      
      console.log('No se encontró diagnóstico para actualizar');
      return null;
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
      console.log(`Eliminando diagnóstico con ID: ${id}`);
      
      // Usar deleteMany en lugar de delete ya que no hay clave primaria
      return prisma.oeiDiagnosticoDetalle.deleteMany({
        where: { Codigo: id },
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
    where?: Prisma.oeiDiagnosticoDetalleWhereInput
  }) {
    try {
      const { where } = params;
      console.log('Contando diagnósticos con filtros:', where);
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o descripción
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código Codigo
            if (condition.Codigo?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.Codigo.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`Codigo LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por Descripcion
            if (condition.Descripcion?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.Descripcion.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`Descripcion LIKE N'%${searchTerm}%'`);
            }
          }
          
          if (orConditions.length > 0) {
            whereCondition += ` AND (${orConditions.join(' OR ')})`;
          }
        }
        
        // Manejar filtro por estado activo
        if (where.Activo !== undefined) {
          whereCondition += ` AND Activo = ${where.Activo ? 1 : 0}`;
        }
      }
      
      console.log('Count where condition:', whereCondition);
      
      // Consulta SQL nativa para contar registros
      const query = `SELECT COUNT(*) as count FROM [dbo].[oeiDiagnosticoDetalle] WHERE ${whereCondition}`;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar el resultado para obtener el conteo
      const countResult = processBigIntValues(result);
      const count = countResult[0]?.count || 0;
      
      console.log(`Total de diagnósticos: ${count}`);
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
