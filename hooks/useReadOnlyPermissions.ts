"use client"

import { useState, useEffect } from 'react'

interface UserData {
  USUARIO: string;
  PERFIL: string;
  NOMBRE: string;
}

/**
 * Hook para manejar permisos de usuario de solo lectura
 * @returns Objeto con funciones y estados para controlar permisos
 */
export function useReadOnlyPermissions() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Cargar información del usuario desde localStorage
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('hospital-user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          setUser(userData)
          
          // Verificar si el usuario tiene perfil de solo lectura
          setIsReadOnly(userData.PERFIL === 'SOLO_LECTURA')
        } catch (error) {
          console.error('Error al parsear datos de usuario:', error)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  /**
   * Verifica si el usuario puede realizar una acción específica
   * @param action Tipo de acción: 'edit', 'delete', 'create'
   * @returns boolean indicando si la acción está permitida
   */
  const canPerformAction = (action: 'edit' | 'delete' | 'create'): boolean => {
    if (!isLoaded) return false
    if (!user) return false
    
    // Si es usuario de solo lectura, no puede realizar ninguna acción de escritura
    if (isReadOnly) return false
    
    // Para otros roles, podría implementarse lógica adicional aquí
    return true
  }

  /**
   * Verifica si el usuario tiene acceso a una sección específica
   * @param section Nombre de la sección a verificar
   * @returns boolean indicando si el usuario tiene acceso
   */
  const hasAccessToSection = (section: string): boolean => {
    if (!isLoaded) return false
    if (!user) return false
    
    // Si el usuario es LECTOR (perfil SOLO_LECTURA), restringir acceso a ciertas secciones
    if (isReadOnly) {
      // Lista de secciones restringidas para usuarios de solo lectura
      // Aseguramos que especialidades no esté en la lista de secciones restringidas
      const restrictedSections = ['almacenes', 'ventas', 'reportes']
      return !restrictedSections.includes(section.toLowerCase())
    }
    
    // Otros usuarios tienen acceso a todas las secciones
    return true
  }

  return {
    user,
    isReadOnly,
    isLoaded,
    canPerformAction,
    hasAccessToSection
  }
}

export default useReadOnlyPermissions
