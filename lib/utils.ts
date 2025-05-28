// Importar clsx de manera que funcione tanto si es una exportación por defecto como si es una exportación nombrada
import * as clsxImport from "clsx";
import { twMerge } from "tailwind-merge";

// Obtener la función clsx correctamente, independientemente de cómo se exporte
const clsx = (clsxImport.default || clsxImport) as (...args: any[]) => string;

// Definir el tipo ClassValue
type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

/**
 * Combina clases con tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

/**
 * Formatea una respuesta estándar para las APIs
 * @param success Indica si la operación fue exitosa
 * @param message Mensaje descriptivo del resultado
 * @param data Datos opcionales a devolver
 * @returns Objeto con formato estándar para respuestas de API
 */
export function formatResponse(success: boolean, message: string, data: any = null) {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
