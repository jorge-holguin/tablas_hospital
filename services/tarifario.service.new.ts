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

export class TarifarioService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: {
      ITEM?: string | { contains: string }
      NOMBRE?: string | { contains: string }
    }
    orderBy?: { [key: string]: 'asc' | 'desc' }
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('TarifarioService.findAll params:', { skip, take, where })
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        const searchConditions = [];
        
        // Buscar por código ITEM
        if (where.ITEM) {
          const searchTerm = typeof where.ITEM === 'string' 
            ? where.ITEM.replace(/'/g, "''") 
            : where.ITEM.contains.replace(/'/g, "''");
          
          searchConditions.push(`i.ITEM LIKE N'%${searchTerm}%'`);
        }
        
        // Buscar por NOMBRE
        if (where.NOMBRE) {
          const searchTerm = typeof where.NOMBRE === 'string' 
            ? where.NOMBRE.replace(/'/g, "''") 
            : where.NOMBRE.contains.replace(/'/g, "''");
          
          searchConditions.push(`i.NOMBRE LIKE N'%${searchTerm}%'`);
        }
        
        // Agregar condiciones de búsqueda con OR si existen
        if (searchConditions.length > 0) {
          whereCondition += ` AND (${searchConditions.join(' OR ')})`;
        }
      }
      
      // Construir la cláusula ORDER BY
      let orderByClause = '';
      
      if (orderBy) {
        const field = Object.keys(orderBy)[0];
        const direction = orderBy[field];
        
        // Determinar si el campo es de la tabla ITEM o PRECIO
        const tablePrefix = ['ITEM', 'NOMBRE'].includes(field) ? 'i.' : 'p.';
        
        orderByClause = `${tablePrefix}${field} ${direction}`;
      }
      
      if (!orderByClause) {
        orderByClause = 'i.ITEM ASC'; // Default ordering
      }
      
      console.log('Where condition:', whereCondition);
      console.log('Order by:', orderByClause);
      
      // Consulta SQL para obtener los datos de ambas tablas con JOIN
      const query = `
        SELECT TOP ${take} 
          i.ITEM,
          i.NOMBRE,
          p.PRECIOA,
          p.PRECIOB,
          p.PRECIOC,
          p.PRECIOD,
          p.PRECIOE,
          p.PRECIOF,
          p.PRECIOG,
          p.PRECIOH,
          p.PRECIOK
        FROM 
          [dbo].[ITEM] i
        LEFT JOIN 
          [dbo].[PRECIO] p ON i.ITEM = p.ITEM
        WHERE 
          ${whereCondition}
          AND i.ITEM NOT IN (
            SELECT TOP ${skip} i.ITEM 
            FROM [dbo].[ITEM] i
            LEFT JOIN [dbo].[PRECIO] p ON i.ITEM = p.ITEM
            WHERE ${whereCondition}
            ORDER BY ${orderByClause}
          )
        ORDER BY 
          ${orderByClause}
      `;
      
      console.log('Query:', query);
      
      // Ejecutar la consulta nativa
      const tarifarios = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar los valores BigInt y convertir los campos decimales a Number
      const processedTarifarios = processBigIntValues(tarifarios);
      
      return processedTarifarios.map((tarifario: any) => ({
        ...tarifario,
        PRECIOA: tarifario.PRECIOA ? Number(tarifario.PRECIOA) : 0,
        PRECIOB: tarifario.PRECIOB ? Number(tarifario.PRECIOB) : 0,
        PRECIOC: tarifario.PRECIOC ? Number(tarifario.PRECIOC) : 0,
        PRECIOD: tarifario.PRECIOD ? Number(tarifario.PRECIOD) : 0,
        PRECIOE: tarifario.PRECIOE ? Number(tarifario.PRECIOE) : 0,
        PRECIOF: tarifario.PRECIOF ? Number(tarifario.PRECIOF) : 0,
        PRECIOG: tarifario.PRECIOG ? Number(tarifario.PRECIOG) : 0,
        PRECIOH: tarifario.PRECIOH ? Number(tarifario.PRECIOH) : 0,
        PRECIOK: tarifario.PRECIOK ? Number(tarifario.PRECIOK) : 0
      }));
    } catch (error) {
      console.error('Error en findAll de TarifarioService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async count(params: {
    where?: {
      ITEM?: string | { contains: string }
      NOMBRE?: string | { contains: string }
    }
  }) {
    try {
      const { where } = params;
      console.log('Contando tarifarios con filtros:', where);
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        const searchConditions = [];
        
        // Buscar por código ITEM
        if (where.ITEM) {
          const searchTerm = typeof where.ITEM === 'string' 
            ? where.ITEM.replace(/'/g, "''") 
            : where.ITEM.contains.replace(/'/g, "''");
          
          searchConditions.push(`i.ITEM LIKE N'%${searchTerm}%'`);
        }
        
        // Buscar por NOMBRE
        if (where.NOMBRE) {
          const searchTerm = typeof where.NOMBRE === 'string' 
            ? where.NOMBRE.replace(/'/g, "''") 
            : where.NOMBRE.contains.replace(/'/g, "''");
          
          searchConditions.push(`i.NOMBRE LIKE N'%${searchTerm}%'`);
        }
        
        // Agregar condiciones de búsqueda con OR si existen
        if (searchConditions.length > 0) {
          whereCondition += ` AND (${searchConditions.join(' OR ')})`;
        }
      }
      
      // Consulta SQL para contar los registros
      const query = `
        SELECT COUNT(*) as count
        FROM [dbo].[ITEM] i
        LEFT JOIN [dbo].[PRECIO] p ON i.ITEM = p.ITEM
        WHERE ${whereCondition}
      `;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa
      const result = await prisma.$queryRaw(Prisma.raw(query));
      const processedResult = processBigIntValues(result);
      
      return processedResult[0]?.count || 0;
    } catch (error) {
      console.error('Error en count de TarifarioService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando tarifario con ITEM: ${id}`);
      
      // Escapar comillas simples para prevenir SQL injection
      const safeId = id.replace(/'/g, "''");
      
      // Consulta SQL nativa para obtener un tarifario específico
      const query = `
        SELECT 
          i.ITEM,
          i.NOMBRE,
          p.PRECIOA,
          p.PRECIOB,
          p.PRECIOC,
          p.PRECIOD,
          p.PRECIOE,
          p.PRECIOF,
          p.PRECIOG,
          p.PRECIOH,
          p.PRECIOK
        FROM 
          [dbo].[ITEM] i
        LEFT JOIN 
          [dbo].[PRECIO] p ON i.ITEM = p.ITEM
        WHERE 
          i.ITEM = N'${safeId}'
      `;
      
      const result = await prisma.$queryRaw(Prisma.raw(query));
      const processedResult = processBigIntValues(result);
      
      if (!processedResult || processedResult.length === 0) {
        return null;
      }
      
      const tarifario = processedResult[0];
      
      // Convertir los campos decimales a Number
      return {
        ...tarifario,
        PRECIOA: tarifario.PRECIOA ? Number(tarifario.PRECIOA) : 0,
        PRECIOB: tarifario.PRECIOB ? Number(tarifario.PRECIOB) : 0,
        PRECIOC: tarifario.PRECIOC ? Number(tarifario.PRECIOC) : 0,
        PRECIOD: tarifario.PRECIOD ? Number(tarifario.PRECIOD) : 0,
        PRECIOE: tarifario.PRECIOE ? Number(tarifario.PRECIOE) : 0,
        PRECIOF: tarifario.PRECIOF ? Number(tarifario.PRECIOF) : 0,
        PRECIOG: tarifario.PRECIOG ? Number(tarifario.PRECIOG) : 0,
        PRECIOH: tarifario.PRECIOH ? Number(tarifario.PRECIOH) : 0,
        PRECIOK: tarifario.PRECIOK ? Number(tarifario.PRECIOK) : 0
      };
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
