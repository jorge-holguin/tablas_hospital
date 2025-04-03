import { CUENTA } from '@prisma/client'

// Tipos para las respuestas de la API
export type CuentaResponse = CUENTA
export type CuentasResponse = CUENTA[]

// Tipos para las peticiones
export type CreateCuentaRequest = Omit<CUENTA, 'CUENTAID'>
export type UpdateCuentaRequest = Partial<CreateCuentaRequest>

// Tipos para los parámetros de búsqueda
export interface CuentaSearchParams {
  skip?: number
  take?: number
  searchTerm?: string
  startDate?: Date
  endDate?: Date
  estado?: string
}
