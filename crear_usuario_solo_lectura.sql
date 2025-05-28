-- Script para crear un usuario con permisos de solo lectura
-- 1. Insertar el usuario en la tabla USUARIO
INSERT INTO USUARIO (MODULO, USUARIO, CONTRASENA, NOMBRE, DIRECCION, TELEFONO, CARGO, FECHA_EXPIRACION, ACTIVO, CONSULTORIO, GRUPO_RECAUDACION, FLAT1, FLAT2, FLAT3, EESS)
VALUES (
  'FARMACIA',           -- MODULO: El módulo principal del sistema
  'LECTOR',             -- USUARIO: Nombre de usuario para login
  '1234',               -- CONTRASENA: Contraseña simple como solicitaste
  'Usuario de Lectura', -- NOMBRE: Nombre descriptivo del usuario
  '',                   -- DIRECCION: Puede quedar vacío
  '',                   -- TELEFONO: Puede quedar vacío
  'SOLO_LECTURA',       -- CARGO: Indicando que es un usuario de solo lectura
  DATEADD(YEAR, 1, GETDATE()), -- FECHA_EXPIRACION: Un año desde hoy
  1,                    -- ACTIVO: Usuario activo
  '',                   -- CONSULTORIO: Puede quedar vacío
  '000',                -- GRUPO_RECAUDACION: Valor por defecto
  0,                    -- FLAT1: Sin permisos especiales
  0,                    -- FLAT2: Sin permisos especiales
  0,                    -- FLAT3: Sin permisos especiales
  '0000005947'          -- EESS: Valor por defecto
);

-- 2. Configurar permisos de solo lectura en USUARIOD
-- Primero identificamos todos los menús disponibles
DECLARE @Menus TABLE (MENU CHAR(8));
INSERT INTO @Menus SELECT DISTINCT MENU FROM USUARIOD WHERE MODULO = 'FARMACIA';

-- Luego insertamos registros para cada menú con permisos de solo lectura
-- Configuramos BOTON1 (generalmente ver/leer) como 1 y los demás como 0
INSERT INTO USUARIOD (MODULO, USUARIO, MENU, BOTON1, BOTON2, BOTON3, BOTON4, BOTON5, BOTON6, BOTON7, BOTON8, BOTON9, BOTON10, BOTON11, BOTON12)
SELECT 
  'FARMACIA',  -- MODULO
  'LECTOR',    -- USUARIO
  MENU,        -- MENU: Cada menú del sistema
  1,           -- BOTON1: Permitir ver/leer (1=permitido)
  0,           -- BOTON2: No permitir crear/agregar (0=no permitido)
  0,           -- BOTON3: No permitir modificar/editar
  0,           -- BOTON4: No permitir eliminar
  0,           -- BOTON5: No permitir otras acciones
  0,           -- BOTON6: No permitir otras acciones
  0,           -- BOTON7: No permitir otras acciones
  0,           -- BOTON8: No permitir otras acciones
  0,           -- BOTON9: No permitir otras acciones
  0,           -- BOTON10: No permitir otras acciones
  0,           -- BOTON11: No permitir otras acciones
  0            -- BOTON12: No permitir otras acciones
FROM @Menus;

-- 3. Asegurar que el usuario tenga acceso al dashboard
-- Si existe una tabla específica para permisos de dashboard, agregar registro aquí
-- Por ejemplo:
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'DASHBOARD_PERMISOS')
BEGIN
  INSERT INTO DASHBOARD_PERMISOS (MODULO, USUARIO, PERMISO_VER)
  VALUES ('FARMACIA', 'LECTOR', 1);
END

-- 4. Confirmar la creación del usuario
SELECT 'Usuario LECTOR creado exitosamente con permisos de solo lectura' AS Resultado;
