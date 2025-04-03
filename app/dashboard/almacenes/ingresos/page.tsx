"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Edit,
  FileSpreadsheet,
  Filter,
  PackageCheck,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo para ingresos
const ingresosData = [
  {
    id: 1,
    documento: "ING-001",
    tipo: "COMPRA",
    nombre: "Ingreso de medicamentos",
    fecha: "2023-03-15",
    hora: "09:30",
    fecha_ph: "2023-03-15",
    hora_ph: "10:00",
    alm: "CENTRAL",
    total: 5280.5,
    usuario: "ADMIN",
    proveedor: "PROV001",
    nombre_proveedor: "Distribuidora Médica",
    observacion: "Ingreso por compra directa",
    referencia: "OC-2023-001",
    tipo_documento: "FACTURA",
    ppa: "SI",
  },
  {
    id: 2,
    documento: "ING-002",
    tipo: "DONACION",
    nombre: "Ingreso por donación",
    fecha: "2023-03-16",
    hora: "11:15",
    fecha_ph: "2023-03-16",
    hora_ph: "12:00",
    alm: "CENTRAL",
    total: 3150.0,
    usuario: "ADMIN",
    proveedor: "PROV003",
    nombre_proveedor: "Droguería Nacional",
    observacion: "Donación de medicamentos",
    referencia: "DON-2023-001",
    tipo_documento: "GUIA",
    ppa: "NO",
  },
  {
    id: 3,
    documento: "ING-003",
    tipo: "COMPRA",
    nombre: "Ingreso de insumos médicos",
    fecha: "2023-03-17",
    hora: "14:45",
    fecha_ph: "2023-03-17",
    hora_ph: "15:30",
    alm: "CENTRAL",
    total: 8750.25,
    usuario: "ADMIN",
    proveedor: "PROV002",
    nombre_proveedor: "Importadora Farmacéutica",
    observacion: "Compra programada mensual",
    referencia: "OC-2023-002",
    tipo_documento: "FACTURA",
    ppa: "SI",
  },
  {
    id: 4,
    documento: "ING-004",
    tipo: "TRANSFERENCIA",
    nombre: "Transferencia entre almacenes",
    fecha: "2023-03-18",
    hora: "10:20",
    fecha_ph: "2023-03-18",
    hora_ph: "11:00",
    alm: "FARMACIA",
    total: 4200.0,
    usuario: "ADMIN",
    proveedor: "",
    nombre_proveedor: "",
    observacion: "Transferencia desde almacén central",
    referencia: "TRANS-2023-001",
    tipo_documento: "GUIA",
    ppa: "NO",
  },
  {
    id: 5,
    documento: "ING-005",
    tipo: "COMPRA",
    nombre: "Ingreso de material quirúrgico",
    fecha: "2023-03-19",
    hora: "09:00",
    fecha_ph: "2023-03-19",
    hora_ph: "09:45",
    alm: "CENTRAL",
    total: 12500.75,
    usuario: "ADMIN",
    proveedor: "PROV004",
    nombre_proveedor: "Química Distribuidora",
    observacion: "Compra de emergencia",
    referencia: "OC-2023-003",
    tipo_documento: "FACTURA",
    ppa: "SI",
  },
]

// Datos de ejemplo para proveedores
const proveedoresData = [
  { id: 1, codigo: "PROV001", nombre: "Distribuidora Médica" },
  { id: 2, codigo: "PROV002", nombre: "Importadora Farmacéutica" },
  { id: 3, codigo: "PROV003", nombre: "Droguería Nacional" },
  { id: 4, codigo: "PROV004", nombre: "Química Distribuidora" },
  { id: 5, codigo: "PROV005", nombre: "Farma Importaciones" },
]

// Datos de ejemplo para almacenes
const almacenesData = [
  { id: 1, codigo: "CENTRAL", nombre: "Almacén Central" },
  { id: 2, codigo: "FARMACIA", nombre: "Farmacia" },
  { id: 3, codigo: "EMERGENCIA", nombre: "Emergencia" },
]

// Datos de ejemplo para tipos de documento
const tiposDocumentoData = [
  { id: 1, codigo: "FACTURA", nombre: "Factura" },
  { id: 2, codigo: "GUIA", nombre: "Guía de Remisión" },
  { id: 3, codigo: "BOLETA", nombre: "Boleta" },
  { id: 4, codigo: "MEMO", nombre: "Memorándum" },
]

// Datos de ejemplo para tipos de ingreso
const tiposIngresoData = [
  { id: 1, codigo: "COMPRA", nombre: "Compra" },
  { id: 2, codigo: "DONACION", nombre: "Donación" },
  { id: 3, codigo: "TRANSFERENCIA", nombre: "Transferencia" },
  { id: 4, codigo: "DEVOLUCION", nombre: "Devolución" },
]

export default function IngresosPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"add" | "edit" | "delete" | "process">("add")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [currentTab, setCurrentTab] = useState("listado")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleAddItem = () => {
    setDialogType("add")
    setSelectedItem(null)
    setOpenDialog(true)
  }

  const handleEditItem = () => {
    if (selectedItems.length !== 1) return
    const item = ingresosData.find((item) => item.id === selectedItems[0])
    setDialogType("edit")
    setSelectedItem(item)
    setOpenDialog(true)
  }

  const handleDeleteItem = () => {
    if (selectedItems.length === 0) return
    setDialogType("delete")
    setOpenDialog(true)
  }

  const handleProcessItem = () => {
    if (selectedItems.length === 0) return
    setDialogType("process")
    setOpenDialog(true)
  }

  const handleSaveItem = () => {
    // Aquí iría la lógica para guardar el ítem
    setOpenDialog(false)
  }

  const handleConfirmDelete = () => {
    // Aquí iría la lógica para eliminar el ítem
    setOpenDialog(false)
    setSelectedItems([])
  }

  const handleConfirmProcess = () => {
    // Aquí iría la lógica para procesar el stock
    setOpenDialog(false)
    setSelectedItems([])
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(ingresosData.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === ingresosData.length) {
        setSelectAll(true)
      }
    }
  }

  const renderDialogContent = () => {
    if (dialogType === "delete") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar{" "}
              {selectedItems.length > 1 ? `estos ${selectedItems.length} ingresos` : "este ingreso"}? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </>
      )
    }

    if (dialogType === "process") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Procesar Stock</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea procesar el stock para{" "}
              {selectedItems.length > 1 ? `estos ${selectedItems.length} ingresos` : "este ingreso"}? Esta acción
              actualizará el inventario.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmProcess}>Procesar</Button>
          </DialogFooter>
        </>
      )
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>{dialogType === "add" ? "Registrar nuevo ingreso" : "Editar ingreso"}</DialogTitle>
          <DialogDescription>
            Complete los campos para {dialogType === "add" ? "registrar un nuevo" : "actualizar el"} ingreso.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Datos Generales</TabsTrigger>
              <TabsTrigger value="detalle">Detalle de Productos</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">Documento</Label>
                  <Input id="documento" defaultValue={selectedItem?.documento || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Ingreso</Label>
                  <Select defaultValue={selectedItem?.tipo || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposIngresoData.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.codigo}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre/Descripción</Label>
                  <Input id="nombre" defaultValue={selectedItem?.nombre || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" type="date" defaultValue={selectedItem?.fecha || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="almacen">Almacén</Label>
                  <Select defaultValue={selectedItem?.alm || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar almacén" />
                    </SelectTrigger>
                    <SelectContent>
                      {almacenesData.map((alm) => (
                        <SelectItem key={alm.id} value={alm.codigo}>
                          {alm.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proveedor">Proveedor</Label>
                  <Select defaultValue={selectedItem?.proveedor || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedoresData.map((prov) => (
                        <SelectItem key={prov.id} value={prov.codigo}>
                          {prov.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                  <Select defaultValue={selectedItem?.tipo_documento || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDocumentoData.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.codigo}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencia">Referencia</Label>
                  <Input id="referencia" defaultValue={selectedItem?.referencia || ""} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="observacion">Observación</Label>
                  <Input id="observacion" defaultValue={selectedItem?.observacion || ""} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="detalle" className="space-y-4 mt-4">
              <div className="flex justify-between mb-4">
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Agregar Producto
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dialogType === "edit" ? (
                    <>
                      <TableRow>
                        <TableCell className="font-medium">MED001</TableCell>
                        <TableCell>Paracetamol 500mg</TableCell>
                        <TableCell className="text-right">1000</TableCell>
                        <TableCell className="text-right">0.50</TableCell>
                        <TableCell className="text-right">500.00</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">MED003</TableCell>
                        <TableCell>Amoxicilina 500mg</TableCell>
                        <TableCell className="text-right">500</TableCell>
                        <TableCell className="text-right">1.20</TableCell>
                        <TableCell className="text-right">600.00</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No hay productos agregados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>S/. 1,100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">IGV (18%):</span>
                    <span>S/. 198.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>S/. 1,298.00</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveItem}>{dialogType === "add" ? "Registrar" : "Guardar"}</Button>
        </DialogFooter>
      </>
    )
  }

  const renderFilterContent = () => {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-documento">Documento</Label>
            <Input id="filter-documento" placeholder="Filtrar por documento" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-tipo">Tipo de Ingreso</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {tiposIngresoData.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.codigo}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-fecha-desde">Fecha Desde</Label>
            <Input id="filter-fecha-desde" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-fecha-hasta">Fecha Hasta</Label>
            <Input id="filter-fecha-hasta" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-almacen">Almacén</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los almacenes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {almacenesData.map((alm) => (
                  <SelectItem key={alm.id} value={alm.codigo}>
                    {alm.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-proveedor">Proveedor</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los proveedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {proveedoresData.map((prov) => (
                  <SelectItem key={prov.id} value={prov.codigo}>
                    {prov.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowFilters(false)}>
            Cancelar
          </Button>
          <Button>Aplicar Filtros</Button>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ingresos a Almacén</h1>
          <p className="text-muted-foreground text-sm">Gestión de ingresos de productos al almacén</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/almacenes">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-1" size="sm" onClick={handleAddItem}>
            <Plus className="h-4 w-4" />
            Nuevo Ingreso
          </Button>
        </div>
      </div>

      <Tabs defaultValue="listado" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="listado">Listado de Ingresos</TabsTrigger>
          <TabsTrigger value="detalle">Detalle de Ingreso</TabsTrigger>
        </TabsList>

        <div className="flex items-center py-4 justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por documento, proveedor..." className="w-full pl-8" />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
              Filtros
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleProcessItem}
              disabled={selectedItems.length === 0}
            >
              <PackageCheck className="h-4 w-4" />
              Procesar Stock
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleEditItem}
              disabled={selectedItems.length !== 1}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleDeleteItem}
              disabled={selectedItems.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="mb-4">
            <CardContent className="pt-6">{renderFilterContent()}</CardContent>
          </Card>
        )}

        <TabsContent value="listado" className="border rounded-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} aria-label="Seleccionar todos" />
                  </TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Total (S/.)</TableHead>
                  <TableHead>Referencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingresosData.map((ingreso) => (
                  <TableRow key={ingreso.id} className={selectedItems.includes(ingreso.id) ? "bg-primary/10" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(ingreso.id)}
                        onCheckedChange={() => toggleSelectItem(ingreso.id)}
                        aria-label={`Seleccionar ingreso ${ingreso.documento}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{ingreso.documento}</TableCell>
                    <TableCell>{ingreso.tipo}</TableCell>
                    <TableCell>{ingreso.fecha}</TableCell>
                    <TableCell>{ingreso.alm}</TableCell>
                    <TableCell>{ingreso.nombre_proveedor}</TableCell>
                    <TableCell className="text-right">{ingreso.total.toFixed(2)}</TableCell>
                    <TableCell>{ingreso.referencia}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="detalle">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Información del Ingreso</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Documento:</div>
                    <div>ING-001</div>
                    <div className="text-muted-foreground">Tipo:</div>
                    <div>COMPRA</div>
                    <div className="text-muted-foreground">Fecha:</div>
                    <div>2023-03-15</div>
                    <div className="text-muted-foreground">Almacén:</div>
                    <div>CENTRAL</div>
                    <div className="text-muted-foreground">Usuario:</div>
                    <div>ADMIN</div>
                    <div className="text-muted-foreground">Referencia:</div>
                    <div>OC-2023-001</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Información del Proveedor</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Código:</div>
                    <div>PROV001</div>
                    <div className="text-muted-foreground">Nombre:</div>
                    <div>Distribuidora Médica</div>
                    <div className="text-muted-foreground">Tipo Documento:</div>
                    <div>FACTURA</div>
                    <div className="text-muted-foreground">Observación:</div>
                    <div>Ingreso por compra directa</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Detalle de Productos</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">MED001</TableCell>
                      <TableCell>Paracetamol 500mg</TableCell>
                      <TableCell className="text-right">1000</TableCell>
                      <TableCell className="text-right">0.50</TableCell>
                      <TableCell className="text-right">500.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">MED003</TableCell>
                      <TableCell>Amoxicilina 500mg</TableCell>
                      <TableCell className="text-right">500</TableCell>
                      <TableCell className="text-right">1.20</TableCell>
                      <TableCell className="text-right">600.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">MED005</TableCell>
                      <TableCell>Omeprazol 20mg</TableCell>
                      <TableCell className="text-right">200</TableCell>
                      <TableCell className="text-right">1.50</TableCell>
                      <TableCell className="text-right">300.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>S/. 1,400.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">IGV (18%):</span>
                    <span>S/. 252.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>S/. 1,652.00</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl">{renderDialogContent()}</DialogContent>
      </Dialog>
    </div>
  )
}

