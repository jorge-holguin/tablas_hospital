"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Receta {
  ID_RECETAS: number
  ATENCION_ID: string
  MODULO: string
  SEGURO: string
  ITEM: string
  CIEX: string
  PRECIO: number
  CANTIDAD: number
  DOSIS: number
  FRECUENCIA: number
  DIAS: number
  VIA: number
  ORD: number
  ESTADO: number
  FECHA: string | Date
  CANTIDAD_ENTREG: number
  TIEMPO?: number
  EDAD?: number
  INDICACIONES?: string
  COD_MEDICO?: string
  NUM_REC?: string
  CONSULTORIO?: string
  FECHA_UPDATE?: string | Date
  METODO?: string
  INDIC_GENERALES?: string
  NUEVO: number
}

interface RecetaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  receta: Receta | null
  onSave: (receta: Partial<Receta>) => void
  vias: { id: number; nombre: string }[]
  estados: { id: number; nombre: string }[]
}

export default function RecetaDialog({
  open,
  onOpenChange,
  receta,
  onSave,
  vias,
  estados
}: RecetaDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<Receta>>({
    ATENCION_ID: "",
    MODULO: "CE",
    SEGURO: "01",
    ITEM: "",
    CIEX: "",
    PRECIO: 0,
    CANTIDAD: 0,
    DOSIS: 1,
    FRECUENCIA: 1,
    DIAS: 1,
    VIA: 1,
    ORD: 1,
    ESTADO: 1,
    CANTIDAD_ENTREG: 0,
    NUEVO: 0
  })
  
  // Actualizar el formulario cuando cambia la receta en edición
  useEffect(() => {
    if (receta) {
      setFormData({
        ...receta,
        // Convertir fechas a string para el formulario si es necesario
        FECHA: receta.FECHA ? new Date(receta.FECHA).toISOString().split('T')[0] : undefined,
        FECHA_UPDATE: receta.FECHA_UPDATE ? new Date(receta.FECHA_UPDATE).toISOString().split('T')[0] : undefined
      })
    } else {
      // Valores por defecto para una nueva receta
      setFormData({
        ATENCION_ID: "",
        MODULO: "CE",
        SEGURO: "01",
        ITEM: "",
        CIEX: "",
        PRECIO: 0,
        CANTIDAD: 0,
        DOSIS: 1,
        FRECUENCIA: 1,
        DIAS: 1,
        VIA: 1,
        ORD: 1,
        ESTADO: 1,
        CANTIDAD_ENTREG: 0,
        NUEVO: 0,
        FECHA: new Date().toISOString().split('T')[0]
      })
    }
  }, [receta, open])
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    // Convertir valores numéricos
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  
  // Manejar cambios en los campos de selección
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }
  
  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    if (!formData.ATENCION_ID || !formData.ITEM) {
      toast({
        title: 'Error',
        description: 'Los campos ID de Atención e Ítem son obligatorios',
        variant: 'destructive'
      })
      return
    }
    
    // Enviar datos al componente padre
    onSave(formData)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{receta ? 'Editar Receta' : 'Nueva Receta'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ATENCION_ID">ID de Atención</Label>
              <Input
                id="ATENCION_ID"
                name="ATENCION_ID"
                value={formData.ATENCION_ID || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="MODULO">Módulo</Label>
              <Select
                value={formData.MODULO || 'CE'}
                onValueChange={(value) => handleSelectChange('MODULO', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CE">Consulta Externa (CE)</SelectItem>
                  <SelectItem value="HO">Hospitalización (HO)</SelectItem>
                  <SelectItem value="EM">Emergencia (EM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ITEM">Ítem</Label>
              <Input
                id="ITEM"
                name="ITEM"
                value={formData.ITEM || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="CIEX">Diagnóstico (CIEX)</Label>
              <Input
                id="CIEX"
                name="CIEX"
                value={formData.CIEX || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="PRECIO">Precio</Label>
              <Input
                id="PRECIO"
                name="PRECIO"
                type="number"
                step="0.01"
                value={formData.PRECIO || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="CANTIDAD">Cantidad</Label>
              <Input
                id="CANTIDAD"
                name="CANTIDAD"
                type="number"
                value={formData.CANTIDAD || 0}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="CANTIDAD_ENTREG">Cantidad Entregada</Label>
              <Input
                id="CANTIDAD_ENTREG"
                name="CANTIDAD_ENTREG"
                type="number"
                value={formData.CANTIDAD_ENTREG || 0}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="DOSIS">Dosis</Label>
              <Input
                id="DOSIS"
                name="DOSIS"
                type="number"
                value={formData.DOSIS || 1}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="FRECUENCIA">Frecuencia</Label>
              <Input
                id="FRECUENCIA"
                name="FRECUENCIA"
                type="number"
                value={formData.FRECUENCIA || 1}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="DIAS">Días</Label>
              <Input
                id="DIAS"
                name="DIAS"
                type="number"
                value={formData.DIAS || 1}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="VIA">Vía de Administración</Label>
              <Select
                value={formData.VIA?.toString() || '1'}
                onValueChange={(value) => handleSelectChange('VIA', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vía" />
                </SelectTrigger>
                <SelectContent>
                  {vias.map((via) => (
                    <SelectItem key={via.id} value={via.id.toString()}>
                      {via.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ESTADO">Estado</Label>
              <Select
                value={formData.ESTADO?.toString() || '1'}
                onValueChange={(value) => handleSelectChange('ESTADO', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado.id} value={estado.id.toString()}>
                      {estado.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="INDICACIONES">Indicaciones</Label>
            <Textarea
              id="INDICACIONES"
              name="INDICACIONES"
              value={formData.INDICACIONES || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="COD_MEDICO">Código Médico</Label>
              <Input
                id="COD_MEDICO"
                name="COD_MEDICO"
                value={formData.COD_MEDICO || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="NUM_REC">Número de Receta</Label>
              <Input
                id="NUM_REC"
                name="NUM_REC"
                value={formData.NUM_REC || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
