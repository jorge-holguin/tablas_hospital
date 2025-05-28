import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkEtniaTable() {
  try {
    // Consulta para verificar si la tabla ETNIA existe
    const tableExists = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'ETNIA'
    `
    
    console.log('¿Existe la tabla ETNIA?:', tableExists)
    
    // Consulta para obtener la estructura de la tabla ETNIA si existe
    if (Array.isArray(tableExists) && tableExists.length > 0 && tableExists[0].count > 0) {
      const tableStructure = await prisma.$queryRaw`
        SELECT 
          COLUMN_NAME, 
          DATA_TYPE, 
          CHARACTER_MAXIMUM_LENGTH
        FROM 
          INFORMATION_SCHEMA.COLUMNS 
        WHERE 
          TABLE_NAME = 'ETNIA'
      `
      
      console.log('\nEstructura de la tabla ETNIA:')
      console.log(tableStructure)
      
      // Consulta para obtener algunos registros de la tabla ETNIA
      try {
        const etnias = await prisma.$queryRaw`
          SELECT TOP 5 * FROM ETNIA
        `
        
        console.log('\nRegistros de muestra de la tabla ETNIA:')
        console.log(etnias)
      } catch (error) {
        console.error('Error al consultar registros de ETNIA:', error)
      }
    }
    
    // Consulta para verificar si hay alguna tabla similar a ETNIA
    const similarTables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME LIKE '%ETNI%'
    `
    
    console.log('\nTablas con nombres similares a ETNIA:')
    console.log(similarTables)
    
  } catch (error) {
    console.error('Error al verificar la tabla ETNIA:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEtniaTable()
