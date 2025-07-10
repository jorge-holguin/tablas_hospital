# Sistema de Gestión de Tablas Hospitalarias

## Documentación Técnica

Este documento presenta la documentación técnica del Sistema de Gestión de Tablas Hospitalarias, una aplicación web desarrollada para la administración de tablas maestras y datos de referencia en entornos hospitalarios.

## Tabla de Contenidos

- [Introducción](#introducción)
- [Backend: Servicios](#backend-servicios)
- [Backend: Rutas API](#backend-rutas-api)
- [Frontend: Tablas en el Dashboard](#frontend-tablas-en-el-dashboard)
- [Modo Sin Conexión](#modo-sin-conexión)

## Introducción

El Sistema de Gestión de Tablas Hospitalarias es una aplicación web moderna diseñada para administrar eficientemente las tablas maestras y datos de referencia utilizados en entornos hospitalarios. El sistema permite la gestión completa (creación, lectura, actualización y eliminación) de diversas entidades como etnias, consultorios, especialidades, entre otros.

## Backend: Servicios

Los servicios del backend son clases que encapsulan la lógica de negocio y el acceso a datos para cada entidad del sistema. Están ubicados en el directorio `/services` y siguen un patrón común de implementación.

### Características Comunes de los Servicios

- Utilizan Prisma como ORM para interactuar con la base de datos
- Implementan operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
- Manejan errores y registran información de depuración
- Proporcionan métodos para búsqueda y filtrado

### Servicios Principales

#### EtniaService

Gestiona las etnias registradas en el sistema.

```typescript
// Métodos principales:
findAll({ skip, take, where }) // Recupera etnias con paginación y filtros
findOne(id) // Recupera una etnia específica por su ID
create(data) // Crea una nueva etnia
update(id, data) // Actualiza una etnia existente
delete(id) // Elimina una etnia
count({ where }) // Cuenta el número de etnias según filtros
```

#### OrigenHospitalizacionService

Gestiona los orígenes de hospitalización, incluyendo consulta externa y emergencia.

```typescript
// Métodos principales:
findAll({ skip, take, search }) // Recupera orígenes con paginación y búsqueda
findOne(id) // Recupera un origen específico por su ID
count({ search }) // Cuenta el número de orígenes según criterios de búsqueda
```

#### Otros Servicios

El sistema incluye más de 40 servicios para gestionar diferentes entidades:

- `almacen.service.ts` - Gestión de almacenes
- `consultorio.service.ts` - Gestión de consultorios
- `especialidad.service.ts` - Gestión de especialidades médicas
- `estado-civil.service.ts` - Gestión de estados civiles
- `grado-instruccion.service.ts` - Gestión de grados de instrucción
- `medico.service.ts` - Gestión de médicos
- `paciente.service.ts` - Gestión de pacientes
- `religion.service.ts` - Gestión de religiones
- `tipo-documento.service.ts` - Gestión de tipos de documentos
- Entre otros...

### Características Avanzadas de los Servicios

- **Manejo de SQL nativo**: Algunos servicios utilizan consultas SQL nativas para optimizar el rendimiento o trabajar con estructuras de datos complejas.
- **Procesamiento de BigInt**: Incluyen funciones auxiliares para manejar valores BigInt que pueden surgir en consultas SQL.
- **Consultas alternativas**: Implementan lógica para usar consultas alternativas cuando las principales fallan.

## Backend: Rutas API

Las rutas API proporcionan endpoints RESTful para interactuar con los servicios del backend. Están organizadas en el directorio `/app/api/tablas` siguiendo una estructura consistente.

### Estructura de Rutas

Cada entidad tiene típicamente tres tipos de rutas:

1. **Ruta principal** (`/api/tablas/{entidad}/route.ts`): Maneja operaciones GET (listar) y POST (crear)
2. **Ruta de ID** (`/api/tablas/{entidad}/[id]/route.ts`): Maneja operaciones GET (obtener), PUT (actualizar) y DELETE (eliminar) para un registro específico
3. **Ruta de conteo** (`/api/tablas/{entidad}/count/route.ts`): Devuelve el conteo total de registros, útil para paginación

### Ejemplo de Implementación de Ruta

```typescript
// Ruta principal (GET y POST)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    
    // Llamada al servicio correspondiente
    const data = await service.findAll({ take, skip, search })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const result = await service.create(data)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

## Frontend: Tablas en el Dashboard

El dashboard del sistema presenta una interfaz de usuario moderna para la gestión de tablas maestras. Está organizado en el directorio `/app/dashboard/tablas` con subdirectorios para cada entidad.

### Componentes Clave

#### DataProvider

El componente `DataProvider` es fundamental para la gestión de datos en las tablas. Proporciona:

- Carga y paginación de datos
- Búsqueda y filtrado
- Selección de registros
- Operaciones CRUD
- Gestión de diálogos de edición y confirmación

```typescript
<DataProvider<T>
  apiEndpoint="nombre-entidad"
  idField="CAMPO_ID"
  defaultValues={valoresPorDefecto}
>
  {({
    data,
    loading,
    totalItems,
    currentPage,
    // ... más propiedades y funciones
  }) => (
    // Renderizado de componentes de UI
  )}
</DataProvider>
```

#### DataTable

El componente `DataTable` muestra los datos en formato tabular con:

- Paginación
- Ordenamiento de columnas
- Búsqueda
- Selección de filas
- Exportación de datos
- Impresión

### Tablas Disponibles en el Dashboard

El sistema incluye numerosas tablas para la gestión de diferentes entidades:

1. **Tablas de Configuración Básica**
   - Etnias
   - Estados Civiles
   - Religiones
   - Grados de Instrucción
   - Tipos de Documento

2. **Tablas de Gestión Médica**
   - Especialidades
   - Consultorios
   - Médicos
   - Diagnósticos
   - Diagnósticos HIS-v2

3. **Tablas de Gestión Administrativa**
   - Almacenes
   - Clases
   - Clasificadores
   - Cuentas
   - Destinos
   - Entidades

4. **Otras Tablas**
   - Empresas Aseguradoras
   - Financiamientos
   - Genéricos
   - Grupos de Liquidación
   - Grupos de Recaudación
   - Laboratorios
   - Localidades
   - Ocupaciones
   - Orígenes
   - Países
   - Presentaciones
   - Proveedores
   - Tarifarios
   - Tipos de Atención
   - Tipos de Transacción
   - Turnos
   - Ubigeos

### Estructura Típica de una Página de Tabla

Cada página de tabla sigue una estructura similar:

```typescript
export default function EntidadPage() {
  return (
    <DataProvider<Entidad>
      apiEndpoint="entidad"
      idField="ID_CAMPO"
      defaultValues={valoresPorDefecto}
    >
      {(props) => (
        <>
          <DataTable<Entidad>
            title="Tabla de Entidad"
            columns={columnas}
            data={props.data}
            // ... más propiedades
          />
          <EditDialog
            // Propiedades para el diálogo de edición
          />
          <ConfirmDialog
            // Propiedades para el diálogo de confirmación
          />
        </>
      )}
    </DataProvider>
  )
}
```

## Modo Sin Conexión

El sistema implementa un modo sin conexión que permite que la aplicación funcione incluso cuando no hay conexión a la base de datos. Esta característica es especialmente útil para desarrollo y pruebas.

### Características del Modo Sin Conexión

- **Cliente Prisma Mock**: Se crea un cliente Prisma simulado cuando no hay conexión a la base de datos.
- **Datos Simulados**: Se proporcionan datos de muestra para todas las tablas del sistema.
- **Manejo de Errores Mejorado**: Las APIs devuelven datos simulados en lugar de errores 500 cuando no hay conexión.
- **Desarrollo Sin Base de Datos**: Permite que los desarrolladores trabajen sin necesidad de configurar una base de datos real.

### Implementación

El modo sin conexión se activa automáticamente cuando se detecta que no hay conexión a la base de datos. Los servicios intentan primero conectarse a la base de datos real y, si fallan, utilizan los datos simulados.

Este enfoque garantiza una experiencia de usuario fluida incluso en entornos con conectividad limitada o durante el desarrollo local.
