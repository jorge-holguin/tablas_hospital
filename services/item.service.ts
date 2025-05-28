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

export class ItemService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.ITEMWhereInput
    orderBy?: Prisma.Enumerable<Prisma.ITEMOrderByWithRelationInput>
  }) {
    try {
      const { skip = 0, take = 10, where, orderBy } = params
      console.log('ItemService.findAll params:', { skip, take, where })
      
      // Para SQL Server 2008, usaremos una consulta más simple sin ROW_NUMBER
      // ya que puede causar problemas con BigInt
      
      // Primero obtenemos todos los IDs ordenados para poder paginar manualmente
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código ITEM
            if (condition.ITEM?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.ITEM.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`ITEM LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por NOMBRE
            if (condition.NOMBRE?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.NOMBRE.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`NOMBRE LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por GENERICO
            if (condition.GENERICO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.GENERICO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`GENERICO LIKE N'%${searchTerm}%'`);
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
        
        // Manejar otros filtros específicos
        if (where.CLASE) {
          if (typeof where.CLASE === 'string') {
            whereCondition += ` AND CLASE = N'${where.CLASE.replace(/'/g, "''")}'`;
          } else if (where.CLASE.equals) {
            whereCondition += ` AND CLASE = N'${where.CLASE.equals.replace(/'/g, "''")}'`;
          }
        }
        
        if (where.PETITORIO !== undefined) {
          whereCondition += ` AND PETITORIO = ${where.PETITORIO}`;
        }
      }
      
      // Construir la cláusula ORDER BY
      let orderByClause = '';
      
      if (orderBy) {
        if (Array.isArray(orderBy)) {
          const orderClauses = orderBy.map(clause => {
            const field = Object.keys(clause)[0];
            const direction = clause[field as keyof typeof clause];
            return `${field} ${direction}`;
          });
          orderByClause = orderClauses.join(', ');
        } else {
          const field = Object.keys(orderBy)[0];
          const direction = orderBy[field as keyof typeof orderBy];
          orderByClause = `${field} ${direction}`;
        }
      }
      
      if (!orderByClause) {
        orderByClause = 'ACTIVO DESC, NOMBRE ASC'; // Default ordering
      }
      
      console.log('Where condition:', whereCondition);
      console.log('Order by:', orderByClause);
      
      // Consulta simplificada para SQL Server 2008
      const query = `
        SELECT TOP ${take} * FROM [dbo].[ITEM] 
        WHERE ${whereCondition} AND ITEM NOT IN (
          SELECT TOP ${skip} ITEM FROM [dbo].[ITEM] 
          WHERE ${whereCondition} 
          ORDER BY ${orderByClause}
        )
        ORDER BY ${orderByClause}
      `;
      
      console.log('Query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const items = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar los valores BigInt antes de continuar
      const processedItems = processBigIntValues(items);
      
      // Enriquecer los resultados con datos adicionales
      const enrichedItems = await Promise.all(
        processedItems.map(async (item) => {
          // Initialize fields
          let nomSismed = '';
          let tipoProductoDesc = '';
          let concentracion = '';
          let codSismed = '';
          
          // Get SISMED data if INTERFASE2 exists (COD_SISMED)
          if (item.INTERFASE2 && item.INTERFASE2.trim() !== '') {
            codSismed = item.INTERFASE2.trim();
            
            try {
              // Use SQL Server 2008 compatible query for SISMED table
              const sismedQuery = `
                SELECT DESSISMED, FORMA_FARMACEUTICA, PRESENTACION, CONCENTRACION 
                FROM SISMED 
                WHERE CODSISMED = N'${codSismed.replace(/'/g, "''")}'
              `;
              
              const sismedResults = await prisma.$queryRaw(Prisma.raw(sismedQuery));
              const processedSismedResults = processBigIntValues(sismedResults);
              
              const sismed = Array.isArray(processedSismedResults) && processedSismedResults.length > 0 
                ? processedSismedResults[0] 
                : null;
              
              if (sismed) {
                // Get individual fields
                concentracion = sismed.CONCENTRACION || '';
                
                // Create NOM_SISMED by concatenating fields as requested
                nomSismed = [
                  sismed.DESSISMED || '',
                  sismed.FORMA_FARMACEUTICA || '',
                  sismed.PRESENTACION || '',
                  sismed.CONCENTRACION || ''
                ].filter(Boolean).join(' ');
              }
            } catch (sismedError) {
              console.error('Error fetching SISMED data:', sismedError);
            }
          }
          
          // Get Tipo Producto from CLASE table's NOMBRE column using the foreign key
          if (item.CLASE && item.CLASE.trim() !== '0') {
            try {
              // Use SQL Server 2008 compatible query for CLASE table
              const claseQuery = `
                SELECT NOMBRE 
                FROM CLASE 
                WHERE CLASE = N'${item.CLASE.trim().replace(/'/g, "''")}'
              `;
              
              const claseResults = await prisma.$queryRaw(Prisma.raw(claseQuery));
              const processedClaseResults = processBigIntValues(claseResults);
              
              const clase = Array.isArray(processedClaseResults) && processedClaseResults.length > 0 
                ? processedClaseResults[0] 
                : null;
              
              if (clase) {
                tipoProductoDesc = clase.NOMBRE || '';
              }
            } catch (claseError) {
              console.error('Error fetching CLASE data:', claseError);
            }
          }
          
          // Special case for item 172091 - set PRESENTACION to "SOL" if needed
          let presentacion = item.PRESENTACION || '';
          if (item.ITEM === '172091' && !presentacion) {
            presentacion = 'SOL';
          }
          
          // Convert Decimal fields to Number for proper comparison
          return {
            ...item,
            ACTIVO: item.ACTIVO ? Number(item.ACTIVO) : 0,
            FRACCION: item.FRACCION ? Number(item.FRACCION) : 1,
            PETITORIO: item.PETITORIO ? Number(item.PETITORIO) : 0,
            STOCK: item.STOCK ? Number(item.STOCK) : 0,
            STOCK_MINIMO: item.STOCK_MINIMO ? Number(item.STOCK_MINIMO) : 0,
            // Add enriched fields
            NOM_SISMED: nomSismed,
            TIPO_PRODUCTO: tipoProductoDesc,
            CONCENTRACION: concentracion,
            COD_SISMED: codSismed,
            PRESENTACION: presentacion
          };
        })
      );
      
      return enrichedItems;
    } catch (error) {
      console.error('Error en findAll de ItemService:', { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Buscando item con ID: ${id}`);
      
      // Escapar comillas simples para prevenir SQL injection
      const safeId = id.replace(/'/g, "''");
      
      // Consulta SQL nativa compatible con SQL Server 2008
      const query = `
        SELECT * FROM [dbo].[ITEM]
        WHERE ITEM = N'${safeId}'
      `;
      
      const result = await prisma.$queryRaw(Prisma.raw(query));
      const processedResult = processBigIntValues(result);
      
      if (!processedResult || processedResult.length === 0) {
        return null;
      }
      
      const item = processedResult[0];
      
      // Initialize fields
      let nomSismed = '';
      let tipoProductoDesc = '';
      let concentracion = '';
      let codSismed = '';
      
      // Get SISMED data if INTERFASE2 exists (COD_SISMED)
      if (item.INTERFASE2 && item.INTERFASE2.trim() !== '') {
        codSismed = item.INTERFASE2.trim();
        
        try {
          // Use SQL Server 2008 compatible query for SISMED table
          const sismedQuery = `
            SELECT DESSISMED, FORMA_FARMACEUTICA, PRESENTACION, CONCENTRACION 
            FROM SISMED 
            WHERE CODSISMED = N'${codSismed.replace(/'/g, "''")}'
          `;
          
          const sismedResults = await prisma.$queryRaw(Prisma.raw(sismedQuery));
          const processedSismedResults = processBigIntValues(sismedResults);
          
          const sismed = Array.isArray(processedSismedResults) && processedSismedResults.length > 0 
            ? processedSismedResults[0] 
            : null;
          
          if (sismed) {
            // Get individual fields
            concentracion = sismed.CONCENTRACION || '';
            
            // Create NOM_SISMED by concatenating fields as requested
            nomSismed = [
              sismed.DESSISMED || '',
              sismed.FORMA_FARMACEUTICA || '',
              sismed.PRESENTACION || '',
              sismed.CONCENTRACION || ''
            ].filter(Boolean).join(' ');
          }
        } catch (sismedError) {
          console.error('Error fetching SISMED data:', sismedError);
        }
      }
      
      // Get Tipo Producto from CLASE table's NOMBRE column using the foreign key
      if (item.CLASE && item.CLASE.trim() !== '0') {
        try {
          // Use SQL Server 2008 compatible query for CLASE table
          const claseQuery = `
            SELECT NOMBRE 
            FROM CLASE 
            WHERE CLASE = N'${item.CLASE.trim().replace(/'/g, "''")}'
          `;
          
          const claseResults = await prisma.$queryRaw(Prisma.raw(claseQuery));
          const processedClaseResults = processBigIntValues(claseResults);
          
          const clase = Array.isArray(processedClaseResults) && processedClaseResults.length > 0 
            ? processedClaseResults[0] 
            : null;
          
          if (clase) {
            tipoProductoDesc = clase.NOMBRE || '';
          }
        } catch (claseError) {
          console.error('Error fetching CLASE data:', claseError);
        }
      }
      
      // Special case for item 172091 - set PRESENTACION to "SOL" if needed
      let presentacion = item.PRESENTACION || '';
      if (item.ITEM === '172091' && !presentacion) {
        presentacion = 'SOL';
      }
      
      // Convert Decimal fields to Number for proper comparison
      return {
        ...item,
        ACTIVO: item.ACTIVO ? Number(item.ACTIVO) : 0,
        FRACCION: item.FRACCION ? Number(item.FRACCION) : 1,
        PETITORIO: item.PETITORIO ? Number(item.PETITORIO) : 0,
        STOCK: item.STOCK ? Number(item.STOCK) : 0,
        STOCK_MINIMO: item.STOCK_MINIMO ? Number(item.STOCK_MINIMO) : 0,
        // Add enriched fields
        NOM_SISMED: nomSismed,
        TIPO_PRODUCTO: tipoProductoDesc,
        CONCENTRACION: concentracion,
        COD_SISMED: codSismed,
        PRESENTACION: presentacion
      };
    } catch (error) {
      console.error(`Error en findOne(${id}):`, error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async count(params: {
    where?: Prisma.ITEMWhereInput
  }) {
    try {
      const { where } = params;
      console.log('Contando items con filtros:', where);
      
      // Construir la condición WHERE basada en el objeto where
      let whereCondition = '1=1';
      
      if (where) {
        // Manejar búsqueda por código o nombre
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          
          for (const condition of where.OR) {
            // Buscar por código ITEM
            if (condition.ITEM?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.ITEM.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`ITEM LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por NOMBRE
            if (condition.NOMBRE?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.NOMBRE.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`NOMBRE LIKE N'%${searchTerm}%'`);
            }
            
            // Buscar por GENERICO
            if (condition.GENERICO?.contains) {
              // SQL Server 2008 compatible LIKE syntax - usando concatenación directa
              const searchTerm = condition.GENERICO.contains.replace(/'/g, "''"); // Escapar comillas simples
              orConditions.push(`GENERICO LIKE N'%${searchTerm}%'`);
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
        
        // Manejar otros filtros específicos
        if (where.CLASE) {
          if (typeof where.CLASE === 'string') {
            whereCondition += ` AND CLASE = N'${where.CLASE.replace(/'/g, "''")}'`;
          } else if (where.CLASE.equals) {
            whereCondition += ` AND CLASE = N'${where.CLASE.equals.replace(/'/g, "''")}'`;
          }
        }
        
        if (where.PETITORIO !== undefined) {
          whereCondition += ` AND PETITORIO = ${where.PETITORIO}`;
        }
      }
      
      console.log('Count where condition:', whereCondition);
      
      // Consulta SQL nativa para contar registros
      const query = `SELECT COUNT(*) as count FROM [dbo].[ITEM] WHERE ${whereCondition}`;
      
      console.log('Count query:', query);
      
      // Ejecutar la consulta nativa sin parámetros (ya están incluidos en la consulta)
      const result = await prisma.$queryRaw(Prisma.raw(query));
      
      // Procesar el resultado para obtener el conteo
      const countResult = processBigIntValues(result);
      const count = countResult[0]?.count || 0;
      
      console.log(`Total de items:`, count);
      return count;
    } catch (error) {
      console.error('Error en count:', error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async create(data: Prisma.ITEMCreateInput) {
    try {
      console.log('Creando item:', data);
      return prisma.iTEM.create({
        data,
      });
    } catch (error) {
      console.error('Error en create:', error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async update(id: string, data: Prisma.ITEMUpdateInput) {
    try {
      console.log(`Actualizando item ${id}:`, data);
      return prisma.iTEM.update({
        where: { ITEM: id },
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
      console.log(`Eliminando item ${id}`);
      return prisma.iTEM.delete({
        where: { ITEM: id },
      });
    } catch (error) {
      console.error(`Error en delete(${id}):`, error instanceof Error ? error.message : 'Error desconocido', {
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
