/**
 * Script de prueba para verificar los datos que se obtienen para un paciente específico
 * en el servicio de origen-hospitalizacion
 */

// Usando require en lugar de import para compatibilidad con Node.js sin configuración adicional
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testOrigenHospitalizacion() {
  const PACIENTE_ID = '2008110914'
  
  console.log(`\n=== PRUEBA PARA PACIENTE: ${PACIENTE_ID} ===\n`)
  
  try {
    // 1. Verificar si el paciente existe en la tabla PACIENTE
    console.log('1. Verificando datos en tabla PACIENTE:')
    const pacienteData = await prisma.$queryRawUnsafe(`
      SELECT PACIENTE, NOMBRES, NOMBRE, PATERNO, MATERNO, DOCUMENTO
      FROM dbo.PACIENTE WITH (NOLOCK)
      WHERE PACIENTE = '${PACIENTE_ID}'
    `)
    console.log(JSON.stringify(pacienteData, null, 2))
    
    // 2. Buscar registros en ATENCIONC relacionados con este paciente
    console.log('\n2. Verificando datos en tabla ATENCIONC:')
    const atencionData = await prisma.$queryRawUnsafe(`
      SELECT TOP 5 ID_CITA, PACIENTE, NOMBRES, DNI, FECHA, CONSULTORIO, MEDICO
      FROM dbo.ATENCIONC WITH (NOLOCK)
      WHERE PACIENTE = '${PACIENTE_ID}'
      ORDER BY FECHA DESC
    `)
    console.log(JSON.stringify(atencionData, null, 2))
    
    // 3. Buscar registros en EMERGENCIA relacionados con este paciente
    console.log('\n3. Verificando datos en tabla EMERGENCIA:')
    const emergenciaData = await prisma.$queryRawUnsafe(`
      SELECT TOP 5 EMERGENCIA_ID, PACIENTE, NOMBRES, NOMBRE, PATERNO, MATERNO, DOCUMENTO, FECHA, CONSULTORIO, MEDICO
      FROM dbo.EMERGENCIA WITH (NOLOCK)
      WHERE PACIENTE = '${PACIENTE_ID}'
      ORDER BY FECHA DESC
    `)
    console.log(JSON.stringify(emergenciaData, null, 2))
    
    // 4. Probar la consulta completa que usa el servicio (findAll)
    console.log('\n4. Probando consulta completa (similar a findAll):')
    const resultadoCompleto = await prisma.$queryRawUnsafe(`
      SELECT TOP 10 ORIGEN, CODIGO, CONSULTORIO, NOM_CONSULTORIO, PACIENTE, FECHA, MEDICO, NOM_MEDICO, NOMBRES, DNI
      FROM (
        SELECT 
          'CE' AS ORIGEN, 
          A.ID_CITA AS CODIGO, 
          B.CONSULTORIO, 
          B.NOMBRE AS NOM_CONSULTORIO, 
          A.PACIENTE, 
          A.FECHA + A.HORA_ATEN AS FECHA, 
          A.MEDICO, 
          C.NOMBRE AS NOM_MEDICO,
          RTRIM(ISNULL(D.NOMBRES, COALESCE(CONCAT(RTRIM(ISNULL(D.NOMBRE, '')), ' ', RTRIM(ISNULL(D.PATERNO, '')), ' ', RTRIM(ISNULL(D.MATERNO, ''))), A.NOMBRES))) AS NOMBRES,
          RTRIM(ISNULL(D.DOCUMENTO, A.DNI)) AS DNI,
          A.FECHA AS FECHA_ORDEN
        FROM dbo.ATENCIONC AS A WITH (NOLOCK)
        INNER JOIN dbo.CONSULTORIO AS B WITH (NOLOCK) ON A.CONSULTORIO = B.CONSULTORIO 
        INNER JOIN dbo.MEDICO AS C WITH (NOLOCK) ON A.MEDICO = C.MEDICO
        LEFT JOIN dbo.PACIENTE AS D WITH (NOLOCK) ON A.PACIENTE = D.PACIENTE
        WHERE A.PACIENTE = '${PACIENTE_ID}'
        
        UNION ALL
        
        SELECT 
          'EM' AS ORIGEN, 
          RTRIM(A.EMERGENCIA_ID) AS CODIGO, 
          RTRIM(B.CONSULTORIO) AS CONSULTORIO, 
          RTRIM(B.NOMBRE) AS NOM_CONSULTORIO, 
          RTRIM(A.PACIENTE) AS PACIENTE, 
          A.FECHA + A.HORA AS FECHA, 
          RTRIM(C.MEDICO) AS MEDICO, 
          RTRIM(C.NOMBRE) AS NOM_MEDICO,
          RTRIM(ISNULL(D.NOMBRES, COALESCE(CONCAT(RTRIM(ISNULL(D.NOMBRE, '')), ' ', RTRIM(ISNULL(D.PATERNO, '')), ' ', RTRIM(ISNULL(D.MATERNO, ''))), RTRIM(ISNULL(A.NOMBRES, CONCAT(RTRIM(ISNULL(A.NOMBRE, '')), ' ', RTRIM(ISNULL(A.PATERNO, '')), ' ', RTRIM(ISNULL(A.MATERNO, '')))))))) AS NOMBRES,
          RTRIM(ISNULL(D.DOCUMENTO, RTRIM(ISNULL(A.DOCUMENTO, '')))) AS DNI,
          A.FECHA AS FECHA_ORDEN
        FROM dbo.EMERGENCIA AS A WITH (NOLOCK)
        INNER JOIN dbo.CONSULTORIO AS B WITH (NOLOCK) ON A.CONSULTORIO = B.CONSULTORIO 
        INNER JOIN dbo.MEDICO AS C WITH (NOLOCK) ON A.MEDICO = C.MEDICO
        LEFT JOIN dbo.PACIENTE AS D WITH (NOLOCK) ON A.PACIENTE = D.PACIENTE
        WHERE A.PACIENTE = '${PACIENTE_ID}'
      ) AS CombinedResults
      ORDER BY FECHA DESC
      OPTION (RECOMPILE)
    `)
    console.log(JSON.stringify(resultadoCompleto, null, 2))
    
    // 5. Verificar si hay registros en V_ORIGEN_HOSPITALIZA
    console.log('\n5. Verificando datos en vista V_ORIGEN_HOSPITALIZA:')
    try {
      const vistaData = await prisma.$queryRawUnsafe(`
        SELECT TOP 5 ORIGEN, CODIGO, CONSULTORIO, NOM_CONSULTORIO, PACIENTE, FECHA, MEDICO, NOM_MEDICO
        FROM V_ORIGEN_HOSPITALIZA WITH (NOLOCK)
        WHERE PACIENTE = '${PACIENTE_ID}'
        ORDER BY FECHA DESC
      `)
      console.log(JSON.stringify(vistaData, null, 2))
    } catch (error) {
      console.log('Error al consultar la vista V_ORIGEN_HOSPITALIZA:', error.message)
    }
    
  } catch (error) {
    console.error('Error en prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la prueba
testOrigenHospitalizacion()
  .then(() => console.log('\n=== PRUEBA FINALIZADA ==='))
  .catch(e => console.error('Error al ejecutar la prueba:', e))
