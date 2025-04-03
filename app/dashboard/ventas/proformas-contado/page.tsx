"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/pagination"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  Search,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Copy,
  Package,
  FileText,
  Filter,
  ShoppingCart,
  User,
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para proformas
const proformasData = [
  {
    id: 1,
    numero: "PRO-001",
    fecha: "03/04/2025",
    hora: "10:44:23",
    cliente: "JUAN PEREZ",
    total: 125.5,
    estado: "Pendiente",
    usuario: "JHOLGUIN",
    farmacia: "FARMACIA CENTRAL",
  },
  {
    id: 2,
    numero: "PRO-002",
    fecha: "03/04/2025",
    hora: "11:15:07",
    cliente: "MARIA RODRIGUEZ",
    total: 78.2,
    estado: "Completada",
    usuario: "JHOLGUIN",
    farmacia: "FARMACIA CENTRAL",
  },
  {
    id: 3,
    numero: "PRO-003",
    fecha: "03/04/2025",
    hora: "12:30:45",
    cliente: "CARLOS GOMEZ",
    total: 203.75,
    estado: "Pendiente",
    usuario: "ALOPEZ",
    farmacia: "FARMACIA EMERGENCIA",
  },
  // Agregar más datos para probar la paginación
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 4,
    numero: `PRO-${String(i + 4).padStart(3, "0")}`,
    fecha: "03/04/2025",
    hora: `${Math.floor(Math.random() * 12 + 8)
      .toString()
      .padStart(2, "0")}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")}`,
    cliente: `CLIENTE ${i + 4}`,
    total: Math.round(Math.random() * 500 * 100) / 100,
    estado: Math.random() > 0.5 ? "Pendiente" : "Completada",
    usuario: Math.random() > 0.5 ? "JHOLGUIN" : "ALOPEZ",
    farmacia: Math.random() > 0.3 ? "FARMACIA CENTRAL" : "FARMACIA EMERGENCIA",
  })),
]

// Datos de ejemplo para items de proforma
const itemsData = [
  {
    id: 1,
    codigo: "MED001",
    nombre: "(P.S/M) CLOZAPINA 100 MG",
    presentacion: "TAB",
    cantidad: 2,
    precio: 0.17,
    costo: 0.17,
    descuento: 0,
    importe: 0.34,
    stock: 103,
  },
  {
    id: 2,
    codigo: "MED002",
    nombre: "(P.S/M) LEVOMEPROMAZINA (COMO MALEATO) 100 mg",
    presentacion: "TAB",
    cantidad: 1,
    precio: 1.84,
    costo: 1.84,
    descuento: 0,
    importe: 1.84,
    stock: 433,
  },
  {
    id: 3,
    codigo: "MED003",
    nombre: "(P.S/M) METILFENIDATO CLORHIDRATO 10 mg",
    presentacion: "TAB",
    cantidad: 3,
    precio: 0.73,
    costo: 0.73,
    descuento: 0,
    importe: 2.19,
    stock: 30,
  },
  {
    id: 4,
    codigo: "MED004",
    nombre: "(P.S/M) SULPIRIDA 200 mg",
    presentacion: "TAB",
    cantidad: 2,
    precio: 0.48,
    costo: 0.48,
    descuento: 0,
    importe: 0.96,
    stock: 426,
  },
  {
    id: 5,
    codigo: "MED005",
    nombre: "AC. POLIGLACTIN 1 MR 30 (S)",
    presentacion: "UNI",
    cantidad: 1,
    precio: 5.99,
    costo: 4.8,
    descuento: 0,
    importe: 5.99,
    stock: 44,
  },
]

export default function ProformasContadoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProforma, setSelectedProforma] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [newProformaDialogOpen, setNewProformaDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("proformas")
  const [newItem, setNewItem] = useState({
    codigo: "",
    nombre: "",
    presentacion: "",
    cantidad: 1,
    precio: 0,
    descuento: 0,
  })
  const [proformaItems, setProformaItems] = useState<typeof itemsData>([])
  const [conStock, setConStock] = useState(true)

  // Filtrar datos según término de búsqueda
  const filteredProformas = proformasData.filter(
    (proforma) =>
      proforma.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proforma.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proforma.usuario.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calcular datos paginados
  const paginatedProformas = filteredProformas.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedProformas.map((item) => item.id))
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
      if (selectedItems.length + 1 === paginatedProformas.length) {
        setSelectAll(true)
      }
    }
  }

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectAll(false)
    setSelectedItems([])
  }

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
    setSelectAll(false)
    setSelectedItems([])
  }

  // Manejar eliminación
  const handleDelete = () => {
    setConfirmDialogOpen(true)
  }

  // Confirmar eliminación
  const confirmDelete = () => {
    console.log("Eliminando proformas:", selectedItems)
    // Aquí iría la lógica para eliminar las proformas seleccionadas
    setSelectedItems([])
    setSelectAll(false)
    setConfirmDialogOpen(false)
  }

  // Manejar nueva proforma
  const handleNewProforma = () => {
    setProformaItems([])
    setNewProformaDialogOpen(true)
  }

  // Agregar item a la proforma
  const handleAddItem = () => {
    // Buscar el item en los datos de ejemplo
    const itemToAdd = itemsData.find(
      (item) =>
        item.codigo.toLowerCase() === newItem.codigo.toLowerCase() ||
        item.nombre.toLowerCase().includes(newItem.nombre.toLowerCase()),
    )

    if (itemToAdd) {
      const newProformaItem = {
        ...itemToAdd,
        cantidad: newItem.cantidad,
        descuento: newItem.descuento,
        importe: itemToAdd.precio * newItem.cantidad * (1 - newItem.descuento / 100),
      }

      setProformaItems([...proformaItems, newProformaItem])
      setNewItem({
        codigo: "",
        nombre: "",
        presentacion: "",
        cantidad: 1,
        precio: 0,
        descuento: 0,
      })
    }
  }

  // Eliminar item de la proforma
  const handleRemoveItem = (id: number) => {
    setProformaItems(proformaItems.filter((item) => item.id !== id))
  }

  // Calcular total de la proforma
  const calculateTotal = () => {
    return proformaItems.reduce((total, item) => total + item.importe, 0)
  }

  // Verificar si hay elementos seleccionados
  const hasSelection = selectedItems.length > 0

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proformas al Contado</h1>
          <p className="text-muted-foreground">Gestión de proformas de venta al contado</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="proformas">Proformas</TabsTrigger>
          <TabsTrigger value="detalle" disabled={!selectedProforma}>
            Detalle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proformas">
          <Card>
            <CardContent className="p-6">
              {/* Primera fila: botones principales a la derecha */}
              <div className="flex justify-end mb-4 gap-2">
                <Button variant="outline" className="gap-1">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                  Actualizar
                </Button>
                <Button variant="outline" className="gap-1">
                  <Printer className="h-4 w-4 text-blue-500" />
                  Imprimir
                </Button>
                <Button variant="outline" className="gap-1">
                  <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                  Excel
                </Button>
                <Button variant="outline" className="gap-1" asChild>
                  <Link href="/dashboard/ventas">
                    <ArrowLeft className="h-4 w-4 text-blue-500" />
                    Volver
                  </Link>
                </Button>
              </div>

              {/* Segunda fila: búsqueda a la izquierda, filtros y botones de acción a la derecha */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, cliente o usuario..."
                    className="w-full md:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4 text-blue-500" />
                    Filtros
                  </Button>
                  <Button className="gap-1" onClick={handleNewProforma}>
                    <Plus className="h-4 w-4" />
                    Nueva Proforma
                  </Button>
                  <Button variant={hasSelection ? "default" : "outline"} className="gap-1" disabled={!hasSelection}>
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant={hasSelection ? "destructive" : "outline"}
                    className="gap-1"
                    disabled={!hasSelection}
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          aria-label="Seleccionar todos"
                        />
                      </TableHead>
                      <TableHead>NÚMERO</TableHead>
                      <TableHead>FECHA</TableHead>
                      <TableHead>HORA</TableHead>
                      <TableHead>CLIENTE</TableHead>
                      <TableHead>TOTAL</TableHead>
                      <TableHead>ESTADO</TableHead>
                      <TableHead>USUARIO</TableHead>
                      <TableHead>FARMACIA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProformas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center h-24">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedProformas.map((proforma) => (
                        <TableRow
                          key={proforma.id}
                          className={selectedProforma === proforma.id ? "bg-primary/10" : ""}
                          onClick={() => {
                            setSelectedProforma(proforma.id)
                            setActiveTab("detalle")
                          }}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedItems.includes(proforma.id)}
                              onCheckedChange={() => handleSelectItem(proforma.id)}
                              aria-label={`Seleccionar proforma ${proforma.numero}`}
                            />
                          </TableCell>
                          <TableCell>{proforma.numero}</TableCell>
                          <TableCell>{proforma.fecha}</TableCell>
                          <TableCell>{proforma.hora}</TableCell>
                          <TableCell>{proforma.cliente}</TableCell>
                          <TableCell>S/. {proforma.total.toFixed(2)}</TableCell>
                          <TableCell>{proforma.estado}</TableCell>
                          <TableCell>{proforma.usuario}</TableCell>
                          <TableCell>{proforma.farmacia}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              <Pagination
                totalItems={filteredProformas.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalle">
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Proforma</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedProforma && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Número de Proforma</Label>
                      <div className="font-medium">{proformasData.find((p) => p.id === selectedProforma)?.numero}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha y Hora</Label>
                      <div className="font-medium">
                        {proformasData.find((p) => p.id === selectedProforma)?.fecha}{" "}
                        {proformasData.find((p) => p.id === selectedProforma)?.hora}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cliente</Label>
                      <div className="font-medium">{proformasData.find((p) => p.id === selectedProforma)?.cliente}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Usuario</Label>
                      <div className="font-medium">{proformasData.find((p) => p.id === selectedProforma)?.usuario}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Farmacia</Label>
                      <div className="font-medium">
                        {proformasData.find((p) => p.id === selectedProforma)?.farmacia}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <div className="font-medium">{proformasData.find((p) => p.id === selectedProforma)?.estado}</div>
                    </div>
                  </div>

                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>CÓDIGO</TableHead>
                          <TableHead>NOMBRE</TableHead>
                          <TableHead>PRESENTACIÓN</TableHead>
                          <TableHead className="text-right">CANTIDAD</TableHead>
                          <TableHead className="text-right">PRECIO</TableHead>
                          <TableHead className="text-right">DESCUENTO</TableHead>
                          <TableHead className="text-right">IMPORTE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemsData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.codigo}</TableCell>
                            <TableCell>{item.nombre}</TableCell>
                            <TableCell>{item.presentacion}</TableCell>
                            <TableCell className="text-right">{item.cantidad}</TableCell>
                            <TableCell className="text-right">S/. {item.precio.toFixed(2)}</TableCell>
                            <TableCell className="text-right">0.00</TableCell>
                            <TableCell className="text-right">S/. {item.importe.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={() => setActiveTab("proformas")}>
                      Volver a Proformas
                    </Button>
                    <div className="text-xl font-bold">
                      Total: S/. {proformasData.find((p) => p.id === selectedProforma)?.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="¿Está seguro de eliminar?"
        description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "proforma" : "proformas"}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />

      {/* Diálogo para nueva proforma */}
      <Dialog open={newProformaDialogOpen} onOpenChange={setNewProformaDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>** NUEVA PROFORMA **</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="usuario">User:</Label>
              <Input id="usuario" value="JHOLGUIN" readOnly className="bg-yellow-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmacia">Farmacia:</Label>
              <Input id="farmacia" value="FARMACIA" readOnly className="bg-yellow-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha:</Label>
              <Input id="fecha" value="03/04/2025" readOnly className="bg-yellow-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Hora:</Label>
              <Input id="hora" value="10:44:23" readOnly className="bg-yellow-50" />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto mb-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ITEM</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>PRESENTACIÓN</TableHead>
                  <TableHead className="text-right">CANTIDAD</TableHead>
                  <TableHead className="text-right">PRECIO</TableHead>
                  <TableHead className="text-right">DESCUENTO</TableHead>
                  <TableHead className="text-right">IMPORTE</TableHead>
                  <TableHead className="text-right">TIPO</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proformaItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center h-16">
                      No hay items agregados
                    </TableCell>
                  </TableRow>
                ) : (
                  proformaItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.codigo}</TableCell>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.presentacion}</TableCell>
                      <TableCell className="text-right">{item.cantidad}</TableCell>
                      <TableCell className="text-right">S/. {item.precio.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.descuento}%</TableCell>
                      <TableCell className="text-right">S/. {item.importe.toFixed(2)}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Editar ítem [F3]
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Eliminar ítem [F4]
              </Button>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md">NRO ITEMS: {proformaItems.length}</div>
              <Button variant="outline" size="sm" className="gap-1">
                <Package className="h-4 w-4" />
                Paquetes
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Copy className="h-4 w-4" />
                Copiar Prof.
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="receta">Receta:</Label>
              <Input id="receta" className="w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="total" className="text-lg font-bold">
                Total S/.
              </Label>
              <Input
                id="total"
                value={calculateTotal().toFixed(2)}
                readOnly
                className="w-32 text-right font-bold bg-yellow-50"
              />
            </div>
          </div>

          <div className="border p-4 rounded-md bg-yellow-50 mb-4">
            <h3 className="font-bold mb-2">Ingreso de Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="item-codigo">Código:</Label>
                <Input
                  id="item-codigo"
                  value={newItem.codigo}
                  onChange={(e) => setNewItem({ ...newItem, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-nombre">Nombre:</Label>
                <Input
                  id="item-nombre"
                  value={newItem.nombre}
                  onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-presentacion">Presentación:</Label>
                <Input
                  id="item-presentacion"
                  value={newItem.presentacion}
                  onChange={(e) => setNewItem({ ...newItem, presentacion: e.target.value })}
                  readOnly
                />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto mb-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Presentación</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Costo</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsData
                    .filter(
                      (item) =>
                        item.codigo.toLowerCase().includes(newItem.codigo.toLowerCase()) ||
                        item.nombre.toLowerCase().includes(newItem.nombre.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          setNewItem({
                            ...newItem,
                            codigo: item.codigo,
                            nombre: item.nombre,
                            presentacion: item.presentacion,
                            precio: item.precio,
                          })
                        }
                      >
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>{item.presentacion}</TableCell>
                        <TableCell className="text-right">{item.precio.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.costo.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.stock}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-cantidad">Cantidad:</Label>
                  <Input
                    id="item-cantidad"
                    type="number"
                    min="1"
                    value={newItem.cantidad}
                    onChange={(e) => setNewItem({ ...newItem, cantidad: Number.parseInt(e.target.value) || 1 })}
                    className="w-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-precio">Precio:</Label>
                  <Input
                    id="item-precio"
                    type="number"
                    step="0.01"
                    value={newItem.precio}
                    onChange={(e) => setNewItem({ ...newItem, precio: Number.parseFloat(e.target.value) || 0 })}
                    className="w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-descuento">Descuento:</Label>
                  <Input
                    id="item-descuento"
                    type="number"
                    min="0"
                    max="100"
                    value={newItem.descuento}
                    onChange={(e) => setNewItem({ ...newItem, descuento: Number.parseFloat(e.target.value) || 0 })}
                    className="w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-importe">Importe S/:</Label>
                  <Input
                    id="item-importe"
                    value={(newItem.precio * newItem.cantidad * (1 - newItem.descuento / 100)).toFixed(2)}
                    readOnly
                    className="w-24"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="con-stock"
                  checked={conStock}
                  onCheckedChange={(checked) => setConStock(checked as boolean)}
                />
                <Label htmlFor="con-stock" className="ml-2">
                  Con Stock
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Search className="h-4 w-4" />
                Buscar Item [INSERT]
              </Button>
              <Button variant="outline" className="gap-1">
                <ShoppingCart className="h-4 w-4" />
                Ir a Items [F2]
              </Button>
              <Button className="gap-1">
                <FileText className="h-4 w-4" />
                Grabar [F5]
              </Button>
              <Button variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Nuevo [F6]
              </Button>
              <Button variant="outline" className="gap-1">
                <Copy className="h-4 w-4" />
                Proforma [F7]
              </Button>
              <Button variant="outline" className="gap-1">
                <Package className="h-4 w-4" />
                Stocks [F8]
              </Button>
              <Button variant="outline" className="gap-1">
                <User className="h-4 w-4" />
                Usuario [F9]
              </Button>
            </div>
            <Button variant="outline" onClick={() => setNewProformaDialogOpen(false)}>
              Salir [ESC]
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

