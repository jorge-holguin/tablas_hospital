"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { TableToolbar } from "@/components/table-toolbar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function ProveedoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentItem, setCurrentItem] = useState({
    codigo: "",
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    activo: "1",
  })

  // Datos de ejemplo
  const proveedores = [
    {
      id: 1,
      codigo: "NIPRO",
      nombre: "NIPRO MEDICAL CORPORATION SUCURSAL DEL PERU",
      ruc: "20504312403",
      direccion: "",
      telefono: "332-2100",
      activo: "1",
    },
    {
      id: 2,
      codigo: "SCHER",
      nombre: "SCHERING PERUANA S.A. **",
      ruc: "20100096421",
      direccion: "AV. PASEO DE LA REPU",
      telefono: "222-7020.",
      activo: "1",
    },
    {
      id: 3,
      codigo: "SERC",
      nombre: "TRAUMA SOLUTIONS S.A.C.",
      ruc: "20562724886",
      direccion: "AV. PEREZ ARANIBAR N",
      telefono: "5937310",
      activo: "1",
    },
    {
      id: 4,
      codigo: "SIGMA",
      nombre: "SIGMA ENTERPRISES PERU S.A.C. **",
      ruc: "20476029474",
      direccion: "AV. BENAVIDES N°4933",
      telefono: "247-4421.",
      activo: "1",
    },
    {
      id: 5,
      codigo: "KIMBER",
      nombre: "KIMBERLY-CLARK PERU S.A. **",
      ruc: "20100152941",
      direccion: "EL BUCARE N°598 - URB",
      telefono: "258-5000.",
      activo: "1",
    },
    {
      id: 6,
      codigo: "FREC",
      nombre: "INSTITUTO NACIONAL DE ENFERMEDADES NEOPLASICAS",
      ruc: "20292820489",
      direccion: "AV. ANGAMOS ESTE 25",
      telefono: "2016500",
      activo: "1",
    },
    {
      id: 7,
      codigo: "ARGOS",
      nombre: "ARGOS MEDICAL IMPORT S.R.L. **",
      ruc: "20501584623",
      direccion: "JR. ALTO DE LA LUNA N",
      telefono: "423-1201.",
      activo: "1",
    },
    {
      id: 8,
      codigo: "NEW",
      nombre: "NEW MEDIC S.R.L. **",
      ruc: "20384501070",
      direccion: "CENTRO COMERCIAL FI",
      telefono: "452-7691.",
      activo: "1",
    },
    {
      id: 9,
      codigo: "MGROCSA",
      nombre: "FIJADOR EXTERNO REUSABLE NACIONAL",
      ruc: "20476812195",
      direccion: "JR. LA MAR N° 106",
      telefono: "999631919",
      activo: "1",
    },
    {
      id: 10,
      codigo: "IVAX",
      nombre: "IVAX PERU S.A. **",
      ruc: "20106832979",
      direccion: "CALLE CAPPA N°193 -P",
      telefono: "348-5625.",
      activo: "1",
    },
  ]

  // Filtrar proveedores basado en el término de búsqueda
  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ruc.includes(searchTerm),
  )

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredProveedores.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar selección individual
  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === filteredProveedores.length) {
        setSelectAll(true)
      }
    }
  }

  // Funciones para la barra de herramientas
  const handleNew = () => {
    setDialogMode("add")
    setCurrentItem({
      codigo: "",
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      activo: "1",
    })
    setDialogOpen(true)
  }

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      const item = proveedores.find((p) => p.id === selectedItems[0])
      if (item) {
        setDialogMode("edit")
        setCurrentItem({
          codigo: item.codigo,
          nombre: item.nombre,
          ruc: item.ruc,
          direccion: item.direccion,
          telefono: item.telefono,
          activo: item.activo,
        })
        setDialogOpen(true)
      }
    }
  }

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      // Aquí iría la lógica para eliminar los elementos seleccionados
      alert(`Eliminando ${selectedItems.length} proveedores`)
    }
  }

  const handlePrint = () => {
    // Aquí iría la lógica para imprimir
    alert("Imprimiendo proveedores")
  }

  const handleExcel = () => {
    // Aquí iría la lógica para exportar a Excel
    alert("Exportando a Excel")
  }

  const handleRefresh = () => {
    setSearchTerm("")
    setSelectedItems([])
    setSelectAll(false)
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar
    if (dialogMode === "add") {
      alert(`Agregando nuevo proveedor: ${currentItem.codigo} - ${currentItem.nombre}`)
    } else {
      alert(`Editando proveedor: ${currentItem.codigo} - ${currentItem.nombre}`)
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <TableToolbar
        title="Tabla de Proveedores"
        searchPlaceholder="Buscar por código, nombre o RUC..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPrint={handlePrint}
        onExcel={handleExcel}
        backHref="/dashboard/tablas"
        disableEdit={selectedItems.length !== 1}
        disableDelete={selectedItems.length === 0}
        newButtonText="Nuevo Proveedor"
      />

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Seleccionar todos" />
                  </TableHead>
                  <TableHead>PROVEEDOR</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>RUC</TableHead>
                  <TableHead>DIRECCION</TableHead>
                  <TableHead>TELEFONO</TableHead>
                  <TableHead>ACTIVO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProveedores.length > 0 ? (
                  filteredProveedores.map((proveedor) => (
                    <TableRow
                      key={proveedor.id}
                      className={selectedItems.includes(proveedor.id) ? "bg-primary/10" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(proveedor.id)}
                          onCheckedChange={() => handleSelectItem(proveedor.id)}
                          aria-label={`Seleccionar proveedor ${proveedor.codigo}`}
                        />
                      </TableCell>
                      <TableCell onClick={() => setSelectedItem(proveedor.id)}>{proveedor.codigo}</TableCell>
                      <TableCell onClick={() => setSelectedItem(proveedor.id)}>{proveedor.nombre}</TableCell>
                      <TableCell onClick={() => setSelectedItem(proveedor.id)}>{proveedor.ruc}</TableCell>
                      <TableCell onClick={() => setSelectedItem(proveedor.id)}>{proveedor.direccion}</TableCell>
                      <TableCell onClick={() => setSelectedItem(proveedor.id)}>{proveedor.telefono}</TableCell>
                      <TableCell onClick={() => setSelectedItem(proveedor.id)}>{proveedor.activo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Nuevo Proveedor" : "Editar Proveedor"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código
              </Label>
              <Input
                id="codigo"
                value={currentItem.codigo}
                onChange={(e) => setCurrentItem({ ...currentItem, codigo: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={currentItem.nombre}
                onChange={(e) => setCurrentItem({ ...currentItem, nombre: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ruc" className="text-right">
                RUC
              </Label>
              <Input
                id="ruc"
                value={currentItem.ruc}
                onChange={(e) => setCurrentItem({ ...currentItem, ruc: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={currentItem.direccion}
                onChange={(e) => setCurrentItem({ ...currentItem, direccion: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={currentItem.telefono}
                onChange={(e) => setCurrentItem({ ...currentItem, telefono: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">
                Activo
              </Label>
              <Select
                value={currentItem.activo}
                onValueChange={(value) => setCurrentItem({ ...currentItem, activo: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sí</SelectItem>
                  <SelectItem value="0">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

