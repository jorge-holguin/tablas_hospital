"use client"

import { ReactNode } from "react"
import { useReadOnlyPermissions } from "@/hooks/useReadOnlyPermissions"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ReadOnlyGuardProps {
  children: ReactNode;
  action: 'edit' | 'delete' | 'create';
  fallback?: ReactNode;
}

/**
 * Componente que protege contenido basado en permisos de usuario
 * Si el usuario es de solo lectura, muestra un mensaje o fallback
 * Si el usuario tiene permisos, muestra el children normalmente
 */
export function ReadOnlyGuard({ children, action, fallback }: ReadOnlyGuardProps) {
  const { canPerformAction, isReadOnly, isLoaded } = useReadOnlyPermissions()

  // Mientras carga, no mostrar nada
  if (!isLoaded) return null

  // Si el usuario puede realizar la acción, mostrar el contenido normal
  if (canPerformAction(action)) {
    return <>{children}</>
  }

  // Si hay un fallback personalizado, mostrarlo
  if (fallback) {
    return <>{fallback}</>
  }

  // Fallback por defecto: alerta informativa
  const actionMessages = {
    edit: "editar este contenido",
    delete: "eliminar este contenido",
    create: "crear nuevo contenido"
  }

  return (
    <Alert variant="warning" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Acceso restringido</AlertTitle>
      <AlertDescription>
        No tienes permisos para {actionMessages[action]}. 
        Tu cuenta tiene permisos de solo lectura.
      </AlertDescription>
    </Alert>
  )
}

export default ReadOnlyGuard
