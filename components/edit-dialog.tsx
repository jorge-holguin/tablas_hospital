"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox'
  customType?: 'combobox' | string
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
  maxLength?: number
  placeholder?: string
  description?: string
  options?: { value: string; label: string }[]
  onChange?: (value: any, setFieldValue: (field: string, value: any) => void, formData?: any) => void
  transform?: {
    input: (value: any) => any
    output: (value: any) => any
  }
  // Propiedades para combobox
  apiEndpoint?: string | ((formValues: Record<string, any>) => string)
  valueField?: string
  labelField?: string
  descriptionField?: string
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
  title?: string
  defaultValues?: any
  fields: FieldConfig[]
  selectedItem?: string | null
  data?: any[]
  type?: string
}

export function EditDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  title = "Editar", 
  defaultValues = {}, 
  fields = [],
  selectedItem,
  data,
  type 
}: EditDialogProps) {
  const [formData, setFormData] = useState<any>({})

  // Inicializar formData solo cuando cambia selectedItem o data
  useEffect(() => {
    if (selectedItem && data) {
      const selectedData = data.find((item: any) => item[Object.keys(item)[0]] === selectedItem)
      setFormData(selectedData || defaultValues)
    } else {
      setFormData(defaultValues)
    }
    // Eliminamos defaultValues de las dependencias para evitar bucles infinitos
    // ya que defaultValues es un objeto que puede cambiar en cada renderizado
  }, [selectedItem, data])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const renderField = (field: FieldConfig) => {
    let value = formData[field.name] !== undefined ? formData[field.name] : ''
    
    // Apply input transform if available (for checkbox)
    if (field.type === 'checkbox' && field.transform?.input) {
      value = field.transform.input(value)
    }
    
    switch (field.type) {
      case 'checkbox':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={field.name}>
            <Label htmlFor={field.name} className="text-right">
              {field.label}
            </Label>
            <div className="col-span-3 space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={field.name} 
                  checked={value === 1 || value === '1' || value === true} 
                  onCheckedChange={(checked) => {
                    const newValue = checked ? 1 : 0
                    field.onChange 
                      ? field.onChange(newValue, (fieldName, fieldValue) => setFormData({ ...formData, [fieldName]: fieldValue }), formData) 
                      : setFormData({ ...formData, [field.name]: newValue})
                  }}
                  disabled={field.readOnly || field.disabled}
                />
                <Label htmlFor={field.name}>
                  {value === 1 || value === '1' || value === true ? "Sí" : "No"}
                </Label>
              </div>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </div>
          </div>
        )
      
      case 'select':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={field.name}>
            <Label htmlFor={field.name} className="text-right">
              {field.label}
            </Label>
            <div className="col-span-3 space-y-1">
              <Select 
                value={String(value)} 
                onValueChange={(val) => field.onChange 
                  ? field.onChange({target: {value: val}} as React.ChangeEvent<HTMLInputElement>, formData, setFormData) 
                  : setFormData({ ...formData, [field.name]: val})}
                disabled={field.readOnly || field.disabled}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder={field.placeholder || `Seleccione ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </div>
          </div>
        )
      
      case 'number':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={field.name}>
            <Label htmlFor={field.name} className="text-right">
              {field.label}
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id={field.name}
                type="number"
                value={value}
                onChange={(e) => field.onChange ? field.onChange(e.target.value, (fieldName, fieldValue) => setFormData({ ...formData, [fieldName]: fieldValue }), formData) : setFormData({ ...formData, [field.name]: e.target.value})}
                className="w-full"
                required={field.required}
                readOnly={field.readOnly}
                disabled={field.disabled}
                placeholder={field.placeholder}
              />
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </div>
          </div>
        )
      
      default:
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={field.name}>
            <Label htmlFor={field.name} className="text-right">
              {field.label}
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id={field.name}
                value={value}
                onChange={(e) => field.onChange ? field.onChange(e.target.value, (fieldName, fieldValue) => setFormData({ ...formData, [fieldName]: fieldValue }), formData) : setFormData({ ...formData, [field.name]: e.target.value})}
                className="w-full"
                required={field.required}
                readOnly={field.readOnly}
                disabled={field.disabled}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
              />
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </div>
          </div>
        )
    }
  }

  const renderFields = () => {
    // If we have fields config, use that
    if (fields.length > 0) {
      return fields.map(field => renderField(field))
    }
    
    // Otherwise use the legacy type-based rendering
    switch (type) {
      case "genericos":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="GENERICO" className="text-right">
                Código
              </Label>
              <Input
                id="GENERICO"
                value={formData.GENERICO || ""}
                onChange={(e) => setFormData({ ...formData, "GENERICO": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="NOMBRE" className="text-right">
                Nombre
              </Label>
              <Input
                id="NOMBRE"
                value={formData.NOMBRE || ""}
                onChange={(e) => setFormData({ ...formData, "NOMBRE": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ACTIVO" className="text-right">
                Activo?
              </Label>
              <Input
                id="ACTIVO"
                value={formData.ACTIVO || "1"}
                onChange={(e) => setFormData({ ...formData, "ACTIVO": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "laboratorios":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, "codigo": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Razón Social
              </Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, "nombre": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ruc" className="text-right">
                RUC
              </Label>
              <Input
                id="ruc"
                value={formData.ruc || ""}
                onChange={(e) => setFormData({ ...formData, "ruc": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={formData.direccion || ""}
                onChange={(e) => setFormData({ ...formData, "direccion": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono(s)
              </Label>
              <Input
                id="telefono"
                value={formData.telefono || ""}
                onChange={(e) => setFormData({ ...formData, "telefono": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">
                Activo?
              </Label>
              <Input
                id="activo"
                value={formData.activo || "1"}
                onChange={(e) => setFormData({ ...formData, "activo": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "tipoAtencion":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, "codigo": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, "nombre": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">
                Activo?
              </Label>
              <Input
                id="activo"
                value={formData.activo || "1"}
                onChange={(e) => setFormData({ ...formData, "activo": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "items":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código Interno
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, "codigo": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigoSismed" className="text-right">
                Código SISMED
              </Label>
              <Input
                id="codigoSismed"
                value={formData.codigoSismed || ""}
                onChange={(e) => setFormData({ ...formData, "codigoSismed": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoPrograma" className="text-right">
                Tipo Programa
              </Label>
              <Input
                id="tipoPrograma"
                value={formData.tipoPrograma || ""}
                onChange={(e) => setFormData({ ...formData, "tipoPrograma": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aplicaDescuento" className="text-right">
                Aplica descuento(100%)
              </Label>
              <Input
                id="aplicaDescuento"
                value={formData.aplicaDescuento || "S"}
                onChange={(e) => setFormData({ ...formData, "aplicaDescuento": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, "nombre": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formaFarmaceutica" className="text-right">
                Forma Farmacéutica
              </Label>
              <Input
                id="formaFarmaceutica"
                value={formData.formaFarmaceutica || ""}
                onChange={(e) => setFormData({ ...formData, "formaFarmaceutica": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clase" className="text-right">
                Clase
              </Label>
              <Input
                id="clase"
                value={formData.clase || ""}
                onChange={(e) => setFormData({ ...formData, "clase": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="presentacion" className="text-right">
                Presentación
              </Label>
              <Input
                id="presentacion"
                value={formData.presentacion || ""}
                onChange={(e) => setFormData({ ...formData, "presentacion": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="concentracion" className="text-right">
                Concentración
              </Label>
              <Input
                id="concentracion"
                value={formData.concentracion || ""}
                onChange={(e) => setFormData({ ...formData, "concentracion": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="familia" className="text-right">
                Familia
              </Label>
              <Input
                id="familia"
                value={formData.familia || ""}
                onChange={(e) => setFormData({ ...formData, "familia": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "familias":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, "codigo": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, "nombre": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">
                Activo?
              </Label>
              <Input
                id="activo"
                value={formData.activo || "1"}
                onChange={(e) => setFormData({ ...formData, "activo": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "presentaciones":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="PRESENTACION" className="text-right">
                Presentación
              </Label>
              <Input
                id="PRESENTACION"
                value={formData.PRESENTACION || ""}
                onChange={(e) => setFormData({ ...formData, "PRESENTACION": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="NOMBRE" className="text-right">
                Nombre
              </Label>
              <Input
                id="NOMBRE"
                value={formData.NOMBRE || ""}
                onChange={(e) => setFormData({ ...formData, "NOMBRE": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ACTIVO" className="text-right">
                Activo?
              </Label>
              <Input
                id="ACTIVO"
                value={formData.ACTIVO || "1"}
                onChange={(e) => setFormData({ ...formData, "ACTIVO": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "precios":
        return (
          <>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item" className="text-right">
                  Item
                </Label>
                <Input id="item" value={formData.item || ""} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre" value={formData.nombre || ""} readOnly className="col-span-3" />
              </div>
            </div>
            <div className="border-t my-4 pt-4">
              <h3 className="text-lg font-medium mb-4">Ingreso/Edición</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fecha" className="text-right">
                    Fecha
                  </Label>
                  <Input
                    id="fecha"
                    value={formData.fecha || ""}
                    onChange={(e) => setFormData({ ...formData, "fecha": e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hora" className="text-right">
                    Hora
                  </Label>
                  <Input
                    id="hora"
                    value={formData.hora || ""}
                    onChange={(e) => setFormData({ ...formData, "hora": e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="costo" className="text-right">
                    Costo
                  </Label>
                  <Input
                    id="costo"
                    type="number"
                    step="0.01"
                    value={formData.costo || "0"}
                    onChange={(e) => setFormData({ ...formData, "costo": e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="utilidad" className="text-right">
                    %Utilidad
                  </Label>
                  <Input
                    id="utilidad"
                    type="number"
                    step="0.1"
                    value={formData.utilidad || "0"}
                    onChange={(e) => setFormData({ ...formData, "utilidad": e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precioPub" className="text-right">
                    Precio Pub.
                  </Label>
                  <Input
                    id="precioPub"
                    type="number"
                    step="0.01"
                    value={formData.precioPub || "0"}
                    onChange={(e) => setFormData({ ...formData, "precioPub": e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descuento" className="text-right">
                    %Descuento
                  </Label>
                  <Input
                    id="descuento"
                    type="number"
                    step="0.1"
                    value={formData.descuento || "0"}
                    onChange={(e) => setFormData({ ...formData, "descuento": e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precioVenta" className="text-right">
                    Precio Venta
                  </Label>
                  <Input
                    id="precioVenta"
                    type="number"
                    step="0.01"
                    value={formData.precioVenta || "0"}
                    onChange={(e) => setFormData({ ...formData, "precioVenta": e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "clases":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, "codigo": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, "nombre": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">
                Activo?
              </Label>
              <Input
                id="activo"
                value={formData.activo || "1"}
                onChange={(e) => setFormData({ ...formData, "activo": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "proveedores":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, "codigo": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Razón Social
              </Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, "nombre": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ruc" className="text-right">
                RUC
              </Label>
              <Input
                id="ruc"
                value={formData.ruc || ""}
                onChange={(e) => setFormData({ ...formData, "ruc": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={formData.direccion || ""}
                onChange={(e) => setFormData({ ...formData, "direccion": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono(s)
              </Label>
              <Input
                id="telefono"
                value={formData.telefono || ""}
                onChange={(e) => setFormData({ ...formData, "telefono": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">
                Activo?
              </Label>
              <Input
                id="activo"
                value={formData.activo || "1"}
                onChange={(e) => setFormData({ ...formData, "activo": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "almacenes":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => setFormData({ ...formData, "codigo": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, "nombre": e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">
                Activo?
              </Label>
              <Input
                id="activo"
                value={formData.activo || "1"}
                onChange={(e) => setFormData({ ...formData, "activo": e.target.value })}
                className="col-span-3"
              />
            </div>
          </>
        )

      default:
        return <p>No hay campos configurados para este tipo de entidad.</p>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.length > 0 ? fields.map(field => (
            <div key={field.name} className="grid gap-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === 'select' ? (
                <Select
                  value={formData[field.name]?.toString() || ''}
                  onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}
                  disabled={field.readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'checkbox' ? (
                <Checkbox
                  id={field.name}
                  checked={formData[field.name] || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, [field.name]: checked })}
                  disabled={field.readOnly}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => {
                    if (field.onChange) {
                      field.onChange(e, formData, setFormData)
                    } else {
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                  }}
                  required={field.required}
                  readOnly={field.readOnly}
                  maxLength={field.maxLength}
                />
              )}
            </div>
          )) : renderFields()}
          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
