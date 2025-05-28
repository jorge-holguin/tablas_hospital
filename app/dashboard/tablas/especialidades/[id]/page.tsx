"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Especialidad {
  ESPECIALIDAD: string
  NOMBRE: string
  ACTIVO: number | string
  semprofesion?: string | null
}

export default function EditarEspecialidadPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  
  // Estado del formulario
  const [formData, setFormData] = useState<Especialidad>({
    ESPECIALIDAD: "",
    NOMBRE: "",
    ACTIVO: 1,
    semprofesion: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar datos de la especialidad
  useEffect(() => {
    const loadEspecialidad = async () => {
      try {
        const response = await fetch(`/api/tablas/especialidades/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Especialidad no encontrada",
            })
            router.push('/dashboard/tablas/especialidades')
            return
          }
          throw new Error('Error al cargar la especialidad')
        }
        
        const data = await response.json()
        setFormData({
          ESPECIALIDAD: data.ESPECIALIDAD,
          NOMBRE: data.NOMBRE,
          ACTIVO: Number(data.ACTIVO),
          semprofesion: data.semprofesion || ""
        })
      } catch (error) {
        console.error('Error:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información de la especialidad",
        })
      } finally {
        setLoadingData(false)
      }
    }
    
    loadEspecialidad()
  }, [id, router, toast])

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error cuando el usuario modifica el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Manejar cambio en el switch de activo
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, ACTIVO: checked ? 1 : 0 }))
  }

  // Validar el formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.NOMBRE.trim()) {
      newErrors.NOMBRE = "El nombre de la especialidad es obligatorio"
    } else if (formData.NOMBRE.length > 150) {
      newErrors.NOMBRE = "El nombre debe tener máximo 150 caracteres"
    }
    
    if (formData.semprofesion && formData.semprofesion.length > 4) {
      newErrors.semprofesion = "El código de profesión debe tener máximo 4 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/tablas/especialidades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NOMBRE: formData.NOMBRE,
          ACTIVO: formData.ACTIVO,
          semprofesion: formData.semprofesion || null
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar la especialidad')
      }
      
      toast({
        title: "Especialidad actualizada",
        description: "La especialidad ha sido actualizada correctamente",
      })
      
      router.push('/dashboard/tablas/especialidades')
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar la especialidad",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando información de la especialidad...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Editar Especialidad</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información de la Especialidad</CardTitle>
            <CardDescription>
              Modifica los datos de la especialidad. Los campos marcados con * son obligatorios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ESPECIALIDAD">Código de Especialidad</Label>
                <Input
                  id="ESPECIALIDAD"
                  name="ESPECIALIDAD"
                  value={formData.ESPECIALIDAD}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">El código no se puede modificar</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semprofesion">Código de Profesión</Label>
                <Input
                  id="semprofesion"
                  name="semprofesion"
                  placeholder="Opcional"
                  value={formData.semprofesion || ""}
                  onChange={handleChange}
                  maxLength={4}
                  className={errors.semprofesion ? "border-red-500" : ""}
                />
                {errors.semprofesion && (
                  <p className="text-sm text-red-500">{errors.semprofesion}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="NOMBRE">Nombre de la Especialidad *</Label>
              <Input
                id="NOMBRE"
                name="NOMBRE"
                placeholder="Ej: Medicina General"
                value={formData.NOMBRE}
                onChange={handleChange}
                maxLength={150}
                className={errors.NOMBRE ? "border-red-500" : ""}
              />
              {errors.NOMBRE && (
                <p className="text-sm text-red-500">{errors.NOMBRE}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ACTIVO"
                checked={Number(formData.ACTIVO) === 1}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="ACTIVO">Especialidad Activa</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
