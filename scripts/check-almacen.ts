import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAlmacenTable() {
  try {
    // Consulta para obtener la estructura de la tabla ALMACEN
    const tableStructure = await prisma.$queryRaw`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        CHARACTER_MAXIMUM_LENGTH
      FROM 
        INFORMATION_SCHEMA.COLUMNS 
      WHERE 
        TABLE_NAME = 'ALMACEN'
    `
    
    console.log('Estructura de la tabla ALMACEN:')
    console.log(tableStructure)
    
    // Consulta para obtener algunos registros de la tabla ALMACEN
    const almacenes = await prisma.$queryRaw`
      SELECT TOP 5 * FROM ALMACEN
    `
    
    console.log('\nRegistros de muestra de la tabla ALMACEN:')
    console.log(almacenes)
    
    // Consulta para contar registros
    const count = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM ALMACEN
    `
    
    console.log('\nTotal de registros en ALMACEN:')
    console.log(count)
    
  } catch (error) {
    console.error('Error al verificar la tabla ALMACEN:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAlmacenTable()
