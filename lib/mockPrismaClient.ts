/**
 * Cliente Prisma mock para cuando no hay conexión a la base de datos
 * Proporciona datos simulados para las tablas del hospital
 */

// Datos simulados para almacenes
const mockAlmacenes = [
  { ALMACEN: 'A001', NOMBRE: 'Almacén Principal', ACTIVO: 1 },
  { ALMACEN: 'A002', NOMBRE: 'Almacén Secundario', ACTIVO: 1 },
  { ALMACEN: 'A003', NOMBRE: 'Almacén Emergencias', ACTIVO: 1 },
  { ALMACEN: 'A004', NOMBRE: 'Almacén Insumos', ACTIVO: 0 }
];

// Datos simulados para otras tablas que podrían ser necesarias
const mockUsuarios = [
  { ID: 1, NOMBRE: 'Admin', USUARIO: 'admin', CLAVE: 'admin123', ACTIVO: 1 }
];

const mockEtnias = [
  { ID: 1, NOMBRE: 'Mestizo', ACTIVO: 1 },
  { ID: 2, NOMBRE: 'Indígena', ACTIVO: 1 },
  { ID: 3, NOMBRE: 'Afrodescendiente', ACTIVO: 1 }
];

// Cliente Prisma mock
export const mockPrismaClient = {
  // Método para consultas SQL raw
  $queryRawUnsafe: async (query: string, ...params: any[]) => {
    console.log('Mock query:', query);
    
    // Simular consultas a ALMACEN
    if (query.includes('FROM ALMACEN')) {
      if (query.includes('COUNT(*)')) {
        return [{ total: mockAlmacenes.length, count: mockAlmacenes.length }];
      }
      
      // Simular búsqueda por ID
      if (query.includes('WHERE ALMACEN =')) {
        const idMatch = query.match(/ALMACEN = '([^']+)'/);
        if (idMatch && idMatch[1]) {
          const id = idMatch[1];
          const found = mockAlmacenes.find(a => a.ALMACEN === id);
          return found ? [found] : [];
        }
      }
      
      // Devolver todos los almacenes para consultas generales
      return mockAlmacenes;
    }
    
    // Simular consultas a USUARIOS
    if (query.includes('FROM USUARIOS')) {
      return mockUsuarios;
    }
    
    // Simular consultas a ETNIAS
    if (query.includes('FROM ETNIAS')) {
      return mockEtnias;
    }
    
    // Simular consultas para verificar relaciones (siempre devolver 0 para permitir eliminaciones)
    if (query.includes('COUNT(*) as count FROM INGRESOC') ||
        query.includes('COUNT(*) as count FROM KARDEX') ||
        query.includes('COUNT(*) as count FROM SALIDAC') ||
        query.includes('COUNT(*) as count FROM TRANSFERENCIAC')) {
      return [{ count: 0 }];
    }
    
    // Valor predeterminado para otras consultas
    return [];
  },
  
  // Método para ejecutar SQL raw
  $executeRawUnsafe: async (query: string, ...params: any[]) => {
    console.log('Mock execute:', query);
    
    // Simular inserción en ALMACEN
    if (query.includes('INSERT INTO ALMACEN')) {
      const almacenMatch = query.match(/VALUES \('([^']+)', '([^']+)', (\d+)\)/);
      if (almacenMatch) {
        const newAlmacen = {
          ALMACEN: almacenMatch[1],
          NOMBRE: almacenMatch[2],
          ACTIVO: parseInt(almacenMatch[3])
        };
        mockAlmacenes.push(newAlmacen);
      }
    }
    
    // Simular actualización en ALMACEN
    if (query.includes('UPDATE ALMACEN')) {
      const idMatch = query.match(/WHERE ALMACEN = '([^']+)'/);
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];
        const almacen = mockAlmacenes.find(a => a.ALMACEN === id);
        if (almacen) {
          // Actualizar nombre si está en la consulta
          const nombreMatch = query.match(/NOMBRE = '([^']+)'/);
          if (nombreMatch && nombreMatch[1]) {
            almacen.NOMBRE = nombreMatch[1];
          }
          
          // Actualizar activo si está en la consulta
          const activoMatch = query.match(/ACTIVO = (\d+)/);
          if (activoMatch && activoMatch[1]) {
            almacen.ACTIVO = parseInt(activoMatch[1]);
          }
        }
      }
    }
    
    // Simular eliminación en ALMACEN
    if (query.includes('DELETE FROM ALMACEN')) {
      const idMatch = query.match(/WHERE ALMACEN = '([^']+)'/);
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];
        const index = mockAlmacenes.findIndex(a => a.ALMACEN === id);
        if (index !== -1) {
          mockAlmacenes.splice(index, 1);
        }
      }
    }
    
    return { count: 1 }; // Simular que la operación afectó a 1 registro
  }
};
