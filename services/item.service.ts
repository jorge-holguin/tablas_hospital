import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class ItemService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.ITEMWhereInput
    orderBy?: Prisma.Enumerable<Prisma.ITEMOrderByWithRelationInput>
  }) {
    try {
      const { skip, take, where, orderBy } = params
      console.log('ItemService.findAll params:', { skip, take, where })
      
      try {
        // First try the standard Prisma query which is more reliable
        const items = await prisma.iTEM.findMany({
          skip: skip || 0,
          take: take || 10,
          where,
          // Default ordering: active items first, then alphabetically by description
          orderBy: orderBy || [
            { ACTIVO: 'desc' },
            { NOMBRE: 'asc' }
          ],
        });
        
        // Then enrich the results with additional data
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            // Initialize fields
            let nomSismed = '';
            let tipoProductoDesc = '';
            let concentracion = '';
            let codSismed = '';
            
            // Get SISMED data if INTERFASE2 exists (COD_SISMED)
            if (item.INTERFASE2 && item.INTERFASE2.trim() !== '') {
              codSismed = item.INTERFASE2.trim();
              
              try {
                // Use raw query for SISMED table
                const sismedResults = await prisma.$queryRaw`
                  SELECT DESSISMED, FORMA_FARMACEUTICA, PRESENTACION, CONCENTRACION 
                  FROM SISMED 
                  WHERE CODSISMED = ${codSismed}
                `;
                
                const sismed = Array.isArray(sismedResults) && sismedResults.length > 0 ? sismedResults[0] : null;
                
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
                // Use raw query for CLASE table to get NOMBRE
                const claseResults = await prisma.$queryRaw`
                  SELECT NOMBRE 
                  FROM CLASE 
                  WHERE CLASE = ${item.CLASE.trim()}
                `;
                
                const clase = Array.isArray(claseResults) && claseResults.length > 0 ? claseResults[0] : null;
                
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
              STOCK_CRITICO: item.STOCK_CRITICO ? Number(item.STOCK_CRITICO) : 0,
              NOM_SISMED: nomSismed,
              TIPO_PRODUCTO_DESC: tipoProductoDesc,
              PRESENTACION: presentacion,
              CONCENTRACION: concentracion,
              COD_SISMED: codSismed
            };
          })
        );
        
        console.log(`Enriched query returned ${enrichedItems.length} items`);
        return enrichedItems;
      } catch (error) {
        console.error('Error in Prisma query:', error);
        
        try {
          // If all else fails, return basic items without enrichment
          const basicItems = await prisma.iTEM.findMany({
            skip: skip || 0,
            take: take || 10,
            where, // Include the where clause here
            // Default ordering: active items first, then alphabetically by description
            orderBy: [
              { ACTIVO: 'desc' },
              { NOMBRE: 'asc' }
            ],
          });
          
          // Convert Decimal fields to Number for proper comparison
          const convertedItems = basicItems.map(item => {
            // Special case for item 172091 - set PRESENTACION to "SOL" if needed
            let presentacion = item.PRESENTACION || '';
            
            return {
              ...item,
              ACTIVO: item.ACTIVO ? Number(item.ACTIVO) : 0,
              FRACCION: item.FRACCION ? Number(item.FRACCION) : 1,
              PETITORIO: item.PETITORIO ? Number(item.PETITORIO) : 0,
              STOCK: item.STOCK ? Number(item.STOCK) : 0,
              STOCK_MINIMO: item.STOCK_MINIMO ? Number(item.STOCK_MINIMO) : 0,
              STOCK_CRITICO: item.STOCK_CRITICO ? Number(item.STOCK_CRITICO) : 0,
              NOM_SISMED: '',
              TIPO_PRODUCTO_DESC: '',
              PRESENTACION: presentacion,
              CONCENTRACION: '',
              COD_SISMED: item.INTERFASE2 ? item.INTERFASE2.trim() : ''
            };
          });
        
        } catch (fallbackError) {
          console.error('Error in fallback query:', fallbackError);
          throw fallbackError; // Re-throw to be caught by the outer try/catch
        }
      }
    } catch (error) {
      console.error('Error in ItemService.findAll:', error);
      throw error;
    }
  }

  async count(params: {
    where?: Prisma.ITEMWhereInput
  }) {
    try {
      const { where } = params;
      
      // Use standard Prisma count which is more reliable
      const count = await prisma.iTEM.count({
        where,
      });
      
      return count;
    } catch (error) {
      console.error('Error in ItemService.count:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      // Get the basic item first
      const item = await prisma.iTEM.findUnique({
        where: { ITEM: id },
      });
      
      if (!item) {
        return null;
      }
      
      // Initialize fields
      let nomSismed = '';
      let tipoProductoDesc = '';
      let concentracion = '';
      let codSismed = '';
      
      // Get SISMED data if INTERFASE2 exists (COD_SISMED)
      if (item.INTERFASE2 && item.INTERFASE2.trim() !== '') {
        codSismed = item.INTERFASE2.trim();
        
        try {
          // Use raw query for SISMED table
          const sismedResults = await prisma.$queryRaw`
            SELECT DESSISMED, FORMA_FARMACEUTICA, PRESENTACION, CONCENTRACION 
            FROM SISMED 
            WHERE CODSISMED = ${codSismed}
          `;
          
          const sismed = Array.isArray(sismedResults) && sismedResults.length > 0 ? sismedResults[0] : null;
          
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
          // Use raw query for CLASE table to get NOMBRE
          const claseResults = await prisma.$queryRaw`
            SELECT NOMBRE 
            FROM CLASE 
            WHERE CLASE = ${item.CLASE.trim()}
          `;
          
          const clase = Array.isArray(claseResults) && claseResults.length > 0 ? claseResults[0] : null;
          
          if (clase) {
            tipoProductoDesc = clase.NOMBRE || '';
          }
        } catch (claseError) {
          console.error('Error fetching CLASE data:', claseError);
        }
      }
      
      // Use the PRESENTACION field from the ITEM model
      let presentacion = item.PRESENTACION || '';
      
      // Special case for item 172091 - set PRESENTACION to "SOL" if needed
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
        STOCK_CRITICO: item.STOCK_CRITICO ? Number(item.STOCK_CRITICO) : 0,
        NOM_SISMED: nomSismed,
        TIPO_PRODUCTO_DESC: tipoProductoDesc,
        PRESENTACION: presentacion,
        CONCENTRACION: concentracion,
        COD_SISMED: codSismed
      };
    } catch (error) {
      console.error('Error in ItemService.findOne:', error);
      throw error;
    }
  }

  async create(data: Prisma.ITEMCreateInput) {
    return prisma.iTEM.create({
      data,
    })
  }

  async update(id: string, data: Prisma.ITEMUpdateInput) {
    return prisma.iTEM.update({
      where: { ITEM: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.iTEM.delete({
      where: { ITEM: id },
    })
  }
}
