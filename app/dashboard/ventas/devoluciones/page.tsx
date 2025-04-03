"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, FileSpreadsheet, Filter, PackageCheck, Plus, RefreshCw, Search, Trash2 } from "lucide-react"
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

// Datos de ejemplo para devoluciones
const devolucionesData = [
  {
    id: 1,
    ingresoId: "25008211",
    documento: "1725043521",
    paciente: "GONZALES NOVOA RUTH KARINA",
    tipo: "Ingreso por Devolución",
    fecha: "28/03/2025",
    hora: "09:18:45",
    fecha_proceso: "28/03/2025",
    hora_proceso: "09:18:49",
    almacen: "F",
    usuario: "MLAURA",
    motivo: "OTROS",
    observacion: "DEVOLUCIÓN",
  },
  {
    id: 2,
    ingresoId: "25008210",
    documento: "1725050402",
    paciente: "SANCHEZ PERALTA LUCEMA",
    tipo: "Ingreso por Devolución",
    fecha: "28/03/2025",
    hora: "09:13:41",
    fecha_proceso: "28/03/2025",
    hora_proceso: "09:13:58",
    almacen: "F",
    usuario: "MLAURA",
    motivo: "OTROS",
    observacion: "DEVOLUCIÓN",
  },
  {
    id: 3,
    ingresoId: "25008209",
    documento: "1725050506",
    paciente: "MANRIQUE RAMOS DANIEL FIDEL",
    tipo: "Ingreso por Devolución",
    fecha: "28/03/2025",
    hora: "09:08:15",
    fecha_proceso: "28/03/2025",
    hora_proceso: "09:08:22",
    almacen: "F",
    usuario: "MLAURA",
    motivo: "OTROS",
    observacion: "DEVOLUCIÓN",
  },
  {
    id: 4,
    ingresoId: "25008207",
    documento: "1725050527",
    paciente: "ALARMAN GARCÍA GUILLIANA",
    tipo: "Ingreso por Devolución",
    fecha: "28/03/2025",
    hora: "07:06:10",
    fecha_proceso: "28/03/2025",
    hora_proceso: "07:06:14",
    almacen: "F",
    usuario: "NEUSTILLOS",
    motivo: "OTROS",
    observacion: "NO SE USO",
  },
  {
    id: 5,
    ingresoId: "25008206",
    documento: "1725050575",
    paciente: "UZURIAGA JARAMILLO JUDITH",
    tipo: "Ingreso por Devolución",
    fecha: "27/03/2025",
    hora: "22:59:45",
    fecha_proceso: "27/03/2025",
    hora_proceso: "22:59:49",
    almacen: "F",
    usuario: "NEUSTILLOS",
    motivo: "OTROS",
    observacion: "NO SE USO",
  },
]

// Datos de ejemplo para items de devolución
const itemsDevolucionData = [
  {
    id: 1,
    codigo: "172501",
    nombre: "(P-DIAB) INSULINA ISOFANA HUMANA (NPH) ADN RECOMBINANTE 100 UI/ML",
    presentacion: "INY",
    cantidad: 1,
    precio: 13.5,
    importe: 13.5,
    almacen: "F",
    estado: 2,
    fecha_proceso: "28/03/2025",
    tipo_transaccion: "IDE",
  },
]

// Datos de ejemplo para motivos
const motivosData = [
  { id: 1, codigo: "OTROS", nombre: "OTROS" },
  { id: 2, codigo: "ERROR_PRESCRIPCION", nombre: "ERROR DE PRESCRIPCIÓN" },
  { id: 3, codigo: "NO_SE_USO", nombre: "NO SE USO" },
  { id: 4, codigo: "TRATAMIENTO", nombre: "TIENE TRATAMIENTO" },
]

export default function DevolucionesPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"add" | "edit" | "delete" | "process">("add")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [currentTab, setCurrentTab] = useState("listado")
  const [userName, setUserName] = useState("JHOLGUIN")
  const [currentDate, setCurrentDate] = useState("")
  const [almacen, setAlmacen] = useState("FARMACIA")
  const periodo = "Marzo 2025"

  // Actualizar fecha
  useEffect(() => {
    const now = new Date()
    const formattedDate = now
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/")

    setCurrentDate(formattedDate)

    // Obtener información del usuario del localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("hospital-user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name || "JHOLGUIN")
      }
    }
  }, [])

  const handleAddItem = () => {
    setDialogType("add")
    setSelectedItem(null)
    setOpenDialog(true)
  }

  const handleEditItem = (item: any) => {
    setDialogType("edit")
    setSelectedItem(item)
    setOpenDialog(true)
  }

  const handleDeleteItem = (item: any) => {
    setDialogType("delete")
    setSelectedItem(item)
    setOpenDialog(true)
  }

  const handleProcessItem = (item: any) => {
    setDialogType("process")
    setSelectedItem(item)
    setOpenDialog(true)
  }

  const handleSaveItem = () => {
    // Aquí iría la lógica para guardar el ítem
    setOpenDialog(false)
  }

  const handleConfirmDelete = () => {
    // Aquí iría la lógica para eliminar el ítem
    setOpenDialog(false)
  }

  const handleConfirmProcess = () => {
    // Aquí iría la lógica para procesar el stock
    setOpenDialog(false)
  }

  const renderDialogContent = () => {
    if (dialogType === "delete") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta devolución? Esta acción no se puede deshacer.
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
              ¿Está seguro que desea procesar el stock para esta devolución? Esta acción actualizará el inventario.
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
          <DialogTitle>{dialogType === "add" ? "Registrar nueva devolución" : "Editar devolución"}</DialogTitle>
          <DialogDescription>
            Complete los campos para {dialogType === "add" ? "registrar una nueva" : "actualizar la"} devolución.
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
                  <Label htmlFor="paciente">Paciente</Label>
                  <Input id="paciente" defaultValue={selectedItem?.paciente || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" type="date" defaultValue={selectedItem?.fecha || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="almacen">Almacén</Label>
                  <Select defaultValue={selectedItem?.almacen || "F"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar almacén" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">FARMACIA</SelectItem>
                      <SelectItem value="C">CENTRAL</SelectItem>
                      <SelectItem value="E">EMERGENCIA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Select defaultValue={selectedItem?.motivo || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {motivosData.map((motivo) => (
                        <SelectItem key={motivo.id} value={motivo.codigo}>
                          {motivo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        <TableCell className="font-medium">172501</TableCell>
                        <TableCell>(P-DIAB) INSULINA ISOFANA HUMANA (NPH) ADN RECOMBINANTE 100 UI/ML</TableCell>
                        <TableCell className="text-right">1</TableCell>
                        <TableCell className="text-right">13.50</TableCell>
                        <TableCell className="text-right">13.50</TableCell>
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
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>S/. 13.50</span>
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
            <Label htmlFor="filter-paciente">Paciente</Label>
            <Input id="filter-paciente" placeholder="Filtrar por paciente" />
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
            <Label htmlFor="filter-motivo">Motivo</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los motivos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {motivosData.map((motivo) => (
                  <SelectItem key={motivo.id} value={motivo.codigo}>
                    {motivo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-usuario">Usuario</Label>
            <Input id="filter-usuario" placeholder="Filtrar por usuario" />
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
          <h1 className="text-2xl font-bold tracking-tight">Devoluciones</h1>
          <p className="text-muted-foreground text-sm">Gestión de devoluciones de productos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/ventas">
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
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-1" size="sm" onClick={handleAddItem}>
            <Plus className="h-4 w-4" />
            Nueva Devolución
          </Button>
        </div>
      </div>

      {/* Información de usuario, fecha, almacén y periodo */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md flex flex-wrap justify-between">
        <div>
          Usuario: <span className="font-medium">{userName}</span>
        </div>
        <div>
          Fecha: <span className="font-medium">{currentDate}</span>
        </div>
        <div>
          Almacén: <span className="font-medium">{almacen}</span>
        </div>
        <div>
          Periodo: <span className="font-medium">{periodo}</span>
        </div>
      </div>

      <Tabs defaultValue="listado" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="listado">Listado de Devoluciones</TabsTrigger>
          <TabsTrigger value="detalle">Detalle de Devolución</TabsTrigger>
        </TabsList>

        <div className="flex items-center py-4 justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por documento, paciente..." className="w-full pl-8" />
          </div>

          <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Observación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devolucionesData.map((devolucion) => (
                  <TableRow key={devolucion.id}>
                    <TableCell className="font-medium">{devolucion.ingresoId}</TableCell>
                    <TableCell>{devolucion.documento}</TableCell>
                    <TableCell>{devolucion.paciente}</TableCell>
                    <TableCell>{devolucion.tipo}</TableCell>
                    <TableCell>{devolucion.fecha}</TableCell>
                    <TableCell>{devolucion.hora}</TableCell>
                    <TableCell>{devolucion.almacen}</TableCell>
                    <TableCell>{devolucion.usuario}</TableCell>
                    <TableCell>{devolucion.motivo}</TableCell>
                    <TableCell>{devolucion.observacion}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleProcessItem(devolucion)}>
                          <PackageCheck className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditItem(devolucion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(devolucion)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
                  <h3 className="text-lg font-medium">Información de la Devolución</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">ID:</div>
                    <div>25008211</div>
                    <div className="text-muted-foreground">Documento:</div>
                    <div>1725043521</div>
                    <div className="text-muted-foreground">Paciente:</div>
                    <div>GONZALES NOVOA RUTH KARINA</div>
                    <div className="text-muted-foreground">Fecha:</div>
                    <div>28/03/2025</div>
                    <div className="text-muted-foreground">Hora:</div>
                    <div>09:18:45</div>
                    <div className="text-muted-foreground">Almacén:</div>
                    <div>FARMACIA</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Información Adicional</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Usuario:</div>
                    <div>MLAURA</div>
                    <div className="text-muted-foreground">Motivo:</div>
                    <div>OTROS</div>
                    <div className="text-muted-foreground">Observación:</div>
                    <div>DEVOLUCIÓN</div>
                    <div className="text-muted-foreground">Fecha Proceso:</div>
                    <div>28/03/2025</div>
                    <div className="text-muted-foreground">Hora Proceso:</div>
                    <div>09:18:49</div>
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
                      <TableCell className="font-medium">172501</TableCell>
                      <TableCell>(P-DIAB) INSULINA ISOFANA HUMANA (NPH) ADN RECOMBINANTE 100 UI/ML</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">13.50</TableCell>
                      <TableCell className="text-right">13.50</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>S/. 13.50</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
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

