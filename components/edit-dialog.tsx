"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
  type: string
  data?: any
}

export function EditDialog({ open, onOpenChange, onSave, type, data }: EditDialogProps) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (data) {
      setFormData({ ...data })
    } else {
      // Valores por defecto según el tipo
      switch (type) {
        case "genericos":
          setFormData({ id: "", nombre: "", activo: "1" })
          break
        case "laboratorios":
          setFormData({ codigo: "", nombre: "", ruc: "", direccion: "", telefono: "", activo: "1" })
          break
        case "tipoAtencion":
          setFormData({ codigo: "", nombre: "", activo: "1" })
          break
        case "items":
          setFormData({
            codigo: "",
            nombre: "",
            codigoSismed: "",
            tipoPrograma: "",
            aplicaDescuento: "S",
            formaFarmaceutica: "",
            clase: "",
            presentacion: "",
            concentracion: "",
            familia: "",
          })
          break
        case "familias":
          setFormData({ codigo: "", nombre: "", activo: "1" })
          break
        case "presentaciones":
          setFormData({ codigo: "", nombre: "", activo: "1" })
          break
        case "precios":
          setFormData({
            item: data?.item || "",
            nombre: data?.nombre || "",
            fecha: new Date().toLocaleDateString("es-ES"),
            hora: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            costo: "0",
            utilidad: "0",
            precioPub: "0",
            descuento: "0",
            precioVenta: "0",
          })
          break
        case "clases":
          setFormData({ codigo: "", nombre: "", activo: "1" })
          break
        case "proveedores":
          setFormData({ codigo: "", nombre: "", ruc: "", direccion: "", telefono: "", activo: "1" })
          break
        case "almacenes":
          setFormData({ codigo: "", nombre: "", activo: "1" })
          break
        default:
          setFormData({})
      }
    }
  }, [data, type, open])

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    onSave(formData)
  }

  const renderFields = () => {
    switch (type) {
      case "genericos":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.id || ""}
                onChange={(e) => handleChange("id", e.target.value)}
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
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
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
                onChange={(e) => handleChange("codigo", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razonSocial" className="text-right">
                Razón Social
              </Label>
              <Input
                id="razonSocial"
                value={formData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("ruc", e.target.value)}
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
                onChange={(e) => handleChange("direccion", e.target.value)}
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
                onChange={(e) => handleChange("telefono", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
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
                onChange={(e) => handleChange("codigo", e.target.value)}
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
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "items":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigoInterno" className="text-right">
                Código Interno
              </Label>
              <Input
                id="codigoInterno"
                value={formData.codigo || ""}
                onChange={(e) => handleChange("codigo", e.target.value)}
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
                onChange={(e) => handleChange("codigoSismed", e.target.value)}
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
                onChange={(e) => handleChange("tipoPrograma", e.target.value)}
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
                onChange={(e) => handleChange("aplicaDescuento", e.target.value)}
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
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("formaFarmaceutica", e.target.value)}
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
                onChange={(e) => handleChange("clase", e.target.value)}
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
                onChange={(e) => handleChange("presentacion", e.target.value)}
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
                onChange={(e) => handleChange("concentracion", e.target.value)}
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
                onChange={(e) => handleChange("familia", e.target.value)}
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
                onChange={(e) => handleChange("codigo", e.target.value)}
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
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
                className="col-span-3"
              />
            </div>
          </>
        )

      case "presentaciones":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={formData.codigo || ""}
                onChange={(e) => handleChange("codigo", e.target.value)}
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
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
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
                    onChange={(e) => handleChange("fecha", e.target.value)}
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
                    onChange={(e) => handleChange("hora", e.target.value)}
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
                    onChange={(e) => handleChange("costo", e.target.value)}
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
                    onChange={(e) => handleChange("utilidad", e.target.value)}
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
                    onChange={(e) => handleChange("precioPub", e.target.value)}
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
                    onChange={(e) => handleChange("descuento", e.target.value)}
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
                    onChange={(e) => handleChange("precioVenta", e.target.value)}
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
                onChange={(e) => handleChange("codigo", e.target.value)}
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
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
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
                onChange={(e) => handleChange("codigo", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razonSocial" className="text-right">
                Razón Social
              </Label>
              <Input
                id="razonSocial"
                value={formData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("ruc", e.target.value)}
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
                onChange={(e) => handleChange("direccion", e.target.value)}
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
                onChange={(e) => handleChange("telefono", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
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
                onChange={(e) => handleChange("codigo", e.target.value)}
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
                onChange={(e) => handleChange("nombre", e.target.value)}
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
                onChange={(e) => handleChange("activo", e.target.value)}
                className="col-span-3"
              />
            </div>
          </>
        )

      default:
        return <p>No hay campos configurados para este tipo de entidad.</p>
    }
  }

  const getDialogTitle = () => {
    const action = data ? "Editar" : "Nuevo"
    switch (type) {
      case "genericos":
        return `${action} Genérico`
      case "laboratorios":
        return `${action} Laboratorio`
      case "tipoAtencion":
        return `${action} Tipo de Atención`
      case "items":
        return `${action} Item`
      case "familias":
        return `${action} Familia`
      case "presentaciones":
        return `${action} Presentación`
      case "precios":
        return `${action} Precio`
      case "clases":
        return `${action} Clase`
      case "proveedores":
        return `${action} Proveedor`
      case "almacenes":
        return `${action} Almacén`
      default:
        return `${action} Registro`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">{renderFields()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Aceptar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

