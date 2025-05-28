// Script para probar la conexión a la base de datos
const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  console.log('Iniciando prueba de conexión a la base de datos...')
  
  try {
    // Crear una nueva instancia de PrismaClient
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    
    console.log('URL de conexión:', process.env.DATABASE_URL)
    
    // Intentar ejecutar una consulta simple
    console.log('Intentando ejecutar una consulta...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    console.log('Conexión exitosa. Resultado:', result)
    
    // Cerrar la conexión
    await prisma.$disconnect()
    console.log('Conexión cerrada correctamente')
    
    return true
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
    return false
  }
}

// Ejecutar la prueba
testConnection()
  .then(success => {
    console.log('Prueba completada:', success ? 'ÉXITO' : 'FALLO')
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Error inesperado:', error)
    process.exit(1)
  })
