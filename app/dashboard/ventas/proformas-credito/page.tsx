"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Copy,
  Edit,
  FileSpreadsheet,
  Filter,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
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

// Datos de ejemplo para items
const itemsData = [
  {
    id: 1,
    codigo: "MED001",
    nombre: "(P.S/M) CLOZAPINA 100 MG",
    presentacion: "TAB",
    precio: 0.17,
    costo: 0.17,
    stock: 103,
  },
  {
    id: 2,
    codigo: "MED002",
    nombre: "(P.S/M) CIPROFLOXACINA (COMO MALEATO) 100 mg",
    presentacion: "TAB",
    precio: 1.84,
    costo: 1.84,
    stock: 433,
  },
  {
    id: 3,
    codigo: "MED003",
    nombre: "(P.S/M) METILFENIDATO CLORHIDRATO 10 mg",
    presentacion: "TAB",
    precio: 0.73,
    costo: 0.73,
    stock: 30,
  },
  {
    id: 4,
    codigo: "MED004",
    nombre: "(P.S/M) SULPIRIDA 200 mg",
    presentacion: "TAB",
    precio: 0.48,
    costo: 0.48,
    stock: 426,
  },
  {
    id: 5,
    codigo: "MED005",
    nombre: "AC. POLIGLACTIN 1 MR 30 (S)",
    presentacion: "UNI",
    precio: 5.99,
    costo: 4.8,
    stock: 32,
  },
  {
    id: 6,
    codigo: "MED006",
    nombre: "AC. POLIGLACTIN 1 MR 35",
    presentacion: "UNI",
    precio: 6.28,
    costo: 5.03,
    stock: 32,
  },
  {
    id: 7,
    codigo: "MED007",
    nombre: "AC. POLIGLACTIN 1 MR 40 MM",
    presentacion: "UNI",
    precio: 6.28,
    costo: 5.03,
    stock: 38,
  },
  {
    id: 8,
    codigo: "MED008",
    nombre: "AC.POLIGLACTIN 3/0 MR 20 MM X 70 CM",
    presentacion: "UNI",
    precio: 4.99,
    costo: 4.0,
    stock: 17,
  },
  {
    id: 9,
    codigo: "MED009",
    nombre: "AC.POLIGLACTIN 3/0 MR 25 MM (S)",
    presentacion: "UNI",
    precio: 9.24,
    costo: 7.4,
    stock: 47,
  },
  {
    id: 10,
    codigo: "MED010",
    nombre: "ACETAZOLAMIDA 250 MG TAB",
    presentacion: "TAB",
    precio: 0.46,
    costo: 0.37,
    stock: 85,
  },
]

// Datos de ejemplo para proformas
const proformasData = [
  {
    id: 1,
    numero: "PRF-C001",
    fecha: "28/03/2025",
    hora: "11:04:59",
    usuario: "JHOLGUIN",
    farmacia: "FARMACIA",
    items: [
      {
        id: 1,
        codigo: "MED001",
        nombre: "(P.S/M) CLOZAPINA 100 MG",
        presentacion: "TAB",
        cantidad: 10,
        precio: 0.17,
        descuento: 0,
        importe: 1.7,
        tipo: "N",
      },
      {
        id: 2,
        codigo: "MED003",
        nombre: "(P.S/M) METILFENIDATO CLORHIDRATO 10 mg",
        presentacion: "TAB",
        cantidad: 5,
        precio: 0.73,
        descuento: 0,
        importe: 3.65,
        tipo: "N",
      },
    ],
    total: 5.35,
    estado: "ACTIVO",
  },
  {
    id: 2,
    numero: "PRF-C002",
    fecha: "28/03/2025",
    hora: "11:15:23",
    usuario: "JHOLGUIN",
    farmacia: "FARMACIA",
    items: [
      {
        id: 1,
        codigo: "MED005",
        nombre: "AC. POLIGLACTIN 1 MR 30 (S)",
        presentacion: "UNI",
        cantidad: 2,
        precio: 5.99,
        descuento: 0,
        importe: 11.98,
        tipo: "N",
      },
    ],
    total: 11.98,
    estado: "ACTIVO",
  },
]

export default function ProformasCreditoPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [currentTab, setCurrentTab] = useState("nueva")
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(itemsData)
  const [cantidad, setCantidad] = useState(1)
  const [precio, setPrecio] = useState(0)
  const [descuento, setDescuento] = useState(0)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showItemSearch, setShowItemSearch] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [conStock, setConStock] = useState(true)
  const [userName, setUserName] = useState("JHOLGUIN")
  const [almacen, setAlmacen] = useState("FARMACIA")
  const periodo = "Marzo 2025"

  // Actualizar fecha y hora
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const formattedDate = now
        .toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "/")

      const formattedTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })

      setCurrentDate(formattedDate)
      setCurrentTime(formattedTime)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    // Obtener información del usuario del localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("hospital-user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name || "JHOLGUIN")
      }
    }

    return () => clearInterval(interval)
  }, [])

  // Filtrar items basado en búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = itemsData.filter(
        (item) =>
          item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(itemsData)
    }
  }, [searchTerm])

  // Filtrar por stock si es necesario
  useEffect(() => {
    if (conStock) {
      setFilteredItems((prev) => prev.filter((item) => item.stock > 0))
    } else {
      if (searchTerm) {
        const filtered = itemsData.filter(
          (item) =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredItems(filtered)
      } else {
        setFilteredItems(itemsData)
      }
    }
  }, [conStock, searchTerm])

  const handleAddItem = (item: any) => {
    setPrecio(item.precio)
    setSelectedItem(item)
    setCantidad(1)
    setDescuento(0)
  }

  const handleConfirmAddItem = () => {
    if (selectedItem) {
      const newItem = {
        id: selectedItems.length + 1,
        codigo: selectedItem.codigo,
        nombre: selectedItem.nombre,
        presentacion: selectedItem.presentacion,
        cantidad: cantidad,
        precio: precio,
        descuento: descuento,
        importe: cantidad * precio - descuento,
        tipo: "N",
      }

      setSelectedItems([...selectedItems, newItem])
      setSelectedItem(null)
      setCantidad(1)
      setPrecio(0)
      setDescuento(0)
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...selectedItems]
    newItems.splice(index, 1)
    setSelectedItems(newItems)
  }

  const handleEditItem = (index: number) => {
    const item = selectedItems[index]
    setSelectedItem({
      ...item,
      stock: itemsData.find((i) => i.codigo === item.codigo)?.stock || 0,
    })
    setCantidad(item.cantidad)
    setPrecio(item.precio)
    setDescuento(item.descuento)

    // Eliminar el item de la lista
    const newItems = [...selectedItems]
    newItems.splice(index, 1)
    setSelectedItems(newItems)
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.importe, 0)
  }

  const handleSaveProforma = () => {
    // Aquí iría la lógica para guardar la proforma
    alert("Proforma a crédito guardada correctamente")
    setSelectedItems([])
  }

  const handleCopyProforma = () => {
    // Aquí iría la lógica para copiar una proforma existente
    alert("Seleccione una proforma para copiar")
  }

  const handlePaquetes = () => {
    // Aquí iría la lógica para seleccionar paquetes
    alert("Funcionalidad de paquetes")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proformas Crédito</h1>
          <p className="text-muted-foreground text-sm">Registro y gestión de proformas a crédito</p>
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
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
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

      <Tabs defaultValue="nueva" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="nueva">Nueva Proforma</TabsTrigger>
          <TabsTrigger value="listado">Listado de Proformas</TabsTrigger>
        </TabsList>

        <TabsContent value="nueva" className="space-y-4">
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="p-4">
              <div className="text-center font-bold text-lg border-b pb-2 mb-4">** NUEVA PROFORMA CRÉDITO **</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuario:</Label>
                  <Input id="usuario" value={userName} readOnly className="bg-yellow-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmacia">Farmacia:</Label>
                  <Input id="farmacia" value={almacen} readOnly className="bg-yellow-50" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha:</Label>
                    <Input id="fecha" value={currentDate} readOnly className="bg-yellow-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora:</Label>
                    <Input id="hora" value={currentTime} readOnly className="bg-yellow-50" />
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-blue-100">
                    <TableRow>
                      <TableHead className="w-12">ITEM</TableHead>
                      <TableHead>NOMBRE</TableHead>
                      <TableHead>PRESENTACIÓN</TableHead>
                      <TableHead className="text-right">CANTIDAD</TableHead>
                      <TableHead className="text-right">PRECIO</TableHead>
                      <TableHead className="text-right">DESCUENTO</TableHead>
                      <TableHead className="text-right">IMPORTE</TableHead>
                      <TableHead className="w-12">TIPO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItems.length > 0 ? (
                      selectedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell>{item.presentacion}</TableCell>
                          <TableCell className="text-right">{item.cantidad}</TableCell>
                          <TableCell className="text-right">{item.precio.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.descuento.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.importe.toFixed(2)}</TableCell>
                          <TableCell>{item.tipo}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No hay items agregados a la proforma
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1 bg-red-100 hover:bg-red-200 text-red-800"
                    onClick={() => setShowItemSearch(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Editar Item [F3]
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1 bg-red-100 hover:bg-red-200 text-red-800"
                    onClick={() => selectedItems.length > 0 && handleRemoveItem(selectedItems.length - 1)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar Item [F4]
                  </Button>
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border rounded-md">
                    <span className="font-medium">NRO ITEMS:</span>
                    <span className="font-bold">{selectedItems.length}</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                    onClick={handlePaquetes}
                  >
                    <Package className="h-4 w-4" />
                    Paquetes
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800"
                    onClick={handleCopyProforma}
                  >
                    <Copy className="h-4 w-4" />
                    Copiar Prof.
                  </Button>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="receta">Receta:</Label>
                    <Input id="receta" className="w-40" />
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border rounded-md">
                  <span className="font-medium">Total S/.</span>
                  <span className="font-bold text-xl">{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowItemSearch(true)}>
                    <Plus className="h-4 w-4" />
                    Ingreso de Items
                  </Button>

                  <div className="flex items-center gap-2 ml-auto">
                    <Checkbox
                      id="conStock"
                      checked={conStock}
                      onCheckedChange={(checked) => setConStock(checked as boolean)}
                    />
                    <Label htmlFor="conStock">Con Stock</Label>
                  </div>
                </div>

                {selectedItem && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50">
                    <div className="space-y-1">
                      <Label htmlFor="item-nombre">Item:</Label>
                      <div id="item-nombre" className="font-medium text-sm">
                        {selectedItem.nombre}
                      </div>
                      <div className="text-xs text-muted-foreground">Stock: {selectedItem.stock}</div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cantidad">Cantidad:</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="precio">Precio:</Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        value={precio}
                        onChange={(e) => setPrecio(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="descuento">Descuento:</Label>
                      <Input
                        id="descuento"
                        type="number"
                        step="0.01"
                        value={descuento}
                        onChange={(e) => setDescuento(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-full flex justify-end">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Importe S/.</span>
                        <span className="font-bold">{(cantidad * precio - descuento).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="col-span-full flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleConfirmAddItem}>
                        Agregar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowItemSearch(true)}>
                    <Search className="h-4 w-4" />
                    Buscar Item [INSERT]
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    Ir a Items [F2]
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setSelectedItems([])}>
                    <Plus className="h-4 w-4" />
                    Nuevo [F6]
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={handleSaveProforma}
                    disabled={selectedItems.length === 0}
                  >
                    <Save className="h-4 w-4" />
                    Grabar [F5]
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listado" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar proforma..." className="w-full pl-8" />
            </div>

            <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filter-fecha-desde">Fecha Desde</Label>
                    <Input id="filter-fecha-desde" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-fecha-hasta">Fecha Hasta</Label>
                    <Input id="filter-fecha-hasta" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-usuario">Usuario</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los usuarios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="JHOLGUIN">JHOLGUIN</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-estado">Estado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ACTIVO">ACTIVO</SelectItem>
                        <SelectItem value="ANULADO">ANULADO</SelectItem>
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
              </CardContent>
            </Card>
          )}

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Farmacia</TableHead>
                  <TableHead className="text-right">Total (S/.)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proformasData.map((proforma) => (
                  <TableRow key={proforma.id}>
                    <TableCell className="font-medium">{proforma.numero}</TableCell>
                    <TableCell>{proforma.fecha}</TableCell>
                    <TableCell>{proforma.hora}</TableCell>
                    <TableCell>{proforma.usuario}</TableCell>
                    <TableCell>{proforma.farmacia}</TableCell>
                    <TableCell className="text-right">{proforma.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proforma.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {proforma.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Imprimir">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Anular">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de búsqueda de items */}
      <Dialog open={showItemSearch} onOpenChange={setShowItemSearch}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Búsqueda de Items</DialogTitle>
            <DialogDescription>Busque y seleccione los items para agregar a la proforma</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="dialog-conStock"
                  checked={conStock}
                  onCheckedChange={(checked) => setConStock(checked as boolean)}
                />
                <Label htmlFor="dialog-conStock">Con Stock</Label>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Presentación</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleAddItem(item)}
                      >
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>{item.presentacion}</TableCell>
                        <TableCell className="text-right">{item.precio.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.stock}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddItem(item)
                            }}
                          >
                            Seleccionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No se encontraron items
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemSearch(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

