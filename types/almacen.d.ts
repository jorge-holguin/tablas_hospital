import { Prisma } from '@prisma/client'

// Tipos para Ingresos
export interface IngresoAlmacen {
  Estado: string
  IngresoId: string
  Documento: string
  Tipo_transaccion: string
  Nombre: string
  Fecha: Date
  Hora: string
  Fecha_proceso: Date
  Hora_Proceso: string
  Almacen: string
  Total: number
  Usuario: string
  Proveedor: string
  Nombre_Proveedor: string
  Observacion: string
  Referencia: string
  Tipo_documento: string
  PPA: number
}

// Tipos para Salidas
export interface SalidaAlmacen {
  Estado: string
  SalidaID: string
  Documento: string
  Tipo_transaccion: string
  Nombre: string
  Fecha: Date
  Hora: string
  Fecha_proceso: Date
  Hora_Proceso: string
  Almacen: string
  Total: number
  Usuario: string
  Observacion: string
}

// Tipos para Transferencias
export interface TransferenciaAlmacen {
  Estado: string
  TransferenciaId: string
  Documento: string
  Fecha: Date
  Hora: string
  Fecha_Proceso: Date
  Hora_Proceso: string
  DeAlmacen: string
  AAlmacen: string
  Total: number
  Usuario: string
  Observacion: string
}

// Tipos para Kardex
export interface KardexItem {
  Item: string
  Nombre: string
  Presentacion: string
  Stock: number
  Promedio: number
  Ubicacion: string
  Nombre_Ubicacion: string
  SISMED: string
  CLASE: string
  APLICA_DSCTO: boolean
  TIPO_PROGRAMA: string
  FECHA_VENCIMIENTO: Date
}

// Tipos para Inventario
export interface InventarioItem {
  Item: string
  Nombre: string
  Presentacion: string
  Stock: number
  Stockf: number
  Costo: number
  Promedio: number
  Precio: number
  Estado: string
  Fecha_Inventario: Date
  Usuario_Insert: string
  Usuario_Edicion: string
  Usuario_Ejecuto: string
  Usuario_Kardex: string
}
