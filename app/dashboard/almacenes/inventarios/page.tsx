"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  FilePlus,
  FileEdit,
  Play,
  X,
  Calendar,
  Printer,
  FileText,
  FileSpreadsheet,
  ArrowLeft,
  Search,
  RefreshCw,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/pagination"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Trash2 } from "lucide-react"

// Datos de ejemplo para la tabla
const inventariosData = [
  {
    id: 1,
    item: "INV-2025-001",
    nombre: "Inventario General Enero 2025",
    presentacion: "GENERAL",
    stock: 1254,
    stockf: 1254,
    costo: 45678.9,
    promedio: 36.43,
    precio: 65.75,
    estado: "CERRADO",
    fecha_inventario: "15/01/2025",
    usuario_insert: "JHOLGUN",
    usuario_edicion: "JHOLGUN",
    usuario_ejecuto: "JHOLGUN",
    usuario_kardex: "MALVAREZ",
  },
  {
    id: 2,
    item: "INV-2025-002",
    nombre: "Inventario Farmacia Febrero 2025",
    presentacion: "FARMACIA",
    stock: 876,
    stockf: 872,
    costo: 32456.78,
    promedio: 37.05,
    precio: 59.99,
    estado: "CERRADO",
    fecha_inventario: "15/02/2025",
    usuario_insert: "JHOLGUN",
    usuario_edicion: "EROMERO",
    usuario_ejecuto: "EROMERO",
    usuario_kardex: "MALVAREZ",
  },
  {
    id: 3,
    item: "INV-2025-003",
    nombre: "Inventario Almacén Central Marzo 2025",
    presentacion: "CENTRAL",
    stock: 1542,
    stockf: 1538,
    costo: 56789.12,
    promedio: 36.83,
    precio: 62.5,
    estado: "EJECUTADO",
    fecha_inventario: "15/03/2025",
    usuario_insert: "JHOLGUN",
    usuario_edicion: "JHOLGUN",
    usuario_ejecuto: "JHOLGUN",
    usuario_kardex: "",
  },
  {
    id: 4,
    item: "INV-2025-004",
    nombre: "Inventario Farmacia Abril 2025",
    presentacion: "FARMACIA",
    stock: 945,
    stockf: 0,
    costo: 38765.43,
    promedio: 41.02,
    precio: 68.75,
    estado: "EN PROCESO",
    fecha_inventario: "15/04/2025",
    usuario_insert: "JHOLGUN",
    usuario_edicion: "JHOLGUN",
    usuario_ejecuto: "",
    usuario_kardex: "",
  },
  {
    id: 5,
    item: "INV-2025-005",
    nombre: "Inventario Emergencia Abril 2025",
    presentacion: "EMERGENCIA",
    stock: 325,
    stockf: 0,
    costo: 15432.1,
    promedio: 47.48,
    precio: 72.25,
    estado: "NUEVO",
    fecha_inventario: "20/04/2025",
    usuario_insert: "JHOLGUN",
    usuario_edicion: "",
    usuario_ejecuto: "",
    usuario_kardex: "",
  },
  // Agregar más datos para probar la paginación
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    item: `INV-2025-${String(i + 6).padStart(3, "0")}`,
    nombre: `Inventario Prueba ${i + 1}`,
    presentacion: ["GENERAL", "FARMACIA", "CENTRAL", "EMERGENCIA"][i % 4],
    stock: Math.floor(Math.random() * 2000) + 100,
    stockf: Math.floor(Math.random() * 2000),
    costo: Math.random() * 50000 + 10000,
    promedio: Math.random() * 50 + 30,
    precio: Math.random() * 80 + 50,
    estado: ["NUEVO", "EN PROCESO", "EJECUTADO", "CERRADO"][i % 4],
    fecha_inventario: `${Math.floor(Math.random() * 28) + 1}/0${Math.floor(Math.random() * 9) + 1}/2025`,
    usuario_insert: ["JHOLGUN", "EROMERO", "MALVAREZ"][i % 3],
    usuario_edicion: ["JHOLGUN", "EROMERO", "MALVAREZ", ""][i % 4],
    usuario_ejecuto: ["JHOLGUN", "EROMERO", "MALVAREZ", ""][i % 4],
    usuario_kardex: ["JHOLGUN", "EROMERO", "MALVAREZ", ""][i % 4],
  })),
]

export default function InventariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInventario, setSelectedInventario] = useState(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // Filtrar datos según término de búsqueda
  const filteredData = inventariosData.filter(
    (inventario) =>
      inventario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventario.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventario.estado.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calcular datos paginados
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedData.map((item) => item.id))
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
      if (selectedItems.length + 1 === paginatedData.length) {
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
    console.log("Eliminando items:", selectedItems)
    // Aquí iría la lógica para eliminar los items seleccionados
    setSelectedItems([])
    setSelectAll(false)
    setConfirmDialogOpen(false)
  }

  // Verificar si hay elementos seleccionados
  const hasSelection = selectedItems.length > 0

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Almacenes</h1>
          <p className="text-muted-foreground">Gestión de almacenes, inventarios y movimientos de productos</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Inventarios</h2>
        <p className="text-muted-foreground">Gestione los inventarios de productos</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Primera fila: botones principales a la derecha */}
          <div className="flex justify-end mb-4 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                    <span className="hidden sm:inline">Actualizar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Actualizar datos</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Printer className="h-4 w-4 text-blue-500" />
                    <span className="hidden sm:inline">Imprimir</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Imprimir listado</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                    <span className="hidden sm:inline">Excel</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exportar a Excel</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-1" asChild>
                    <Link href="/dashboard/almacenes">
                      <ArrowLeft className="h-4 w-4 text-blue-500" />
                      <span className="hidden sm:inline">Volver</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Volver a Almacenes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Segunda fila: búsqueda a la izquierda, filtros y botones de acción a la derecha */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por documento, proveedor..."
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

              <Button className="gap-1">
                <FilePlus className="h-4 w-4" />
                Nuevo
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <MoreHorizontal className="h-4 w-4 text-blue-500" />
                    Acciones
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    disabled={!hasSelection}
                    onClick={() => console.log("Editar")}
                  >
                    <FileEdit className="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    disabled={!hasSelection}
                    onClick={() => console.log("Ejecutar")}
                  >
                    <Play className="h-4 w-4" />
                    Ejecutar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    disabled={!hasSelection}
                    onClick={() => console.log("Cerrar")}
                  >
                    <X className="h-4 w-4" />
                    Cerrar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4" />
                    Inventario a la Fecha
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    disabled={!hasSelection}
                    onClick={() => console.log("Modificar Datos")}
                  >
                    <FileText className="h-4 w-4" />
                    Modificar Datos
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-red-600"
                    disabled={!hasSelection}
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Seleccionar todos" />
                  </TableHead>
                  <TableHead>ITEM</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>PRESENTACION</TableHead>
                  <TableHead>STOCK</TableHead>
                  <TableHead>STOCKF</TableHead>
                  <TableHead>COSTO</TableHead>
                  <TableHead>PROMEDIO</TableHead>
                  <TableHead>PRECIO</TableHead>
                  <TableHead>ESTADO</TableHead>
                  <TableHead>FECHA_INVENTARIO</TableHead>
                  <TableHead>USUARIO_INSERT</TableHead>
                  <TableHead>USUARIO_EDICION</TableHead>
                  <TableHead>USUARIO_EJECUTO</TableHead>
                  <TableHead>USUARIO_KARDEX</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center h-24">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((inventario) => (
                    <TableRow
                      key={inventario.id}
                      className={selectedInventario === inventario.id ? "bg-primary/10" : ""}
                      onClick={() => setSelectedInventario(inventario.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.includes(inventario.id)}
                          onCheckedChange={() => handleSelectItem(inventario.id)}
                          aria-label={`Seleccionar inventario ${inventario.item}`}
                        />
                      </TableCell>
                      <TableCell>{inventario.item}</TableCell>
                      <TableCell>{inventario.nombre}</TableCell>
                      <TableCell>{inventario.presentacion}</TableCell>
                      <TableCell>{inventario.stock}</TableCell>
                      <TableCell>{inventario.stockf}</TableCell>
                      <TableCell>{inventario.costo.toFixed(2)}</TableCell>
                      <TableCell>{inventario.promedio.toFixed(2)}</TableCell>
                      <TableCell>{inventario.precio.toFixed(2)}</TableCell>
                      <TableCell>{inventario.estado}</TableCell>
                      <TableCell>{inventario.fecha_inventario}</TableCell>
                      <TableCell>{inventario.usuario_insert}</TableCell>
                      <TableCell>{inventario.usuario_edicion}</TableCell>
                      <TableCell>{inventario.usuario_ejecuto}</TableCell>
                      <TableCell>{inventario.usuario_kardex}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <Pagination
            totalItems={filteredData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="¿Está seguro de eliminar?"
        description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "inventario" : "inventarios"}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  )
}

