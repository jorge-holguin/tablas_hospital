"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableToolbar } from "@/components/table-toolbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/pagination"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EditDialog } from "@/components/edit-dialog"

// Datos de ejemplo para la tabla de items
const itemsData = [
  {
    id: 1,
    codigo: "MED001",
    descripcion: "Paracetamol 500mg",
    presentacion: "Tableta",
    familia: "Analgésicos",
    clase: "Medicamentos",
    generico: "Paracetamol",
    laboratorio: "Farmacorp",
    stock: 1500,
    precio: 2.5,
  },
  {
    id: 2,
    codigo: "MED002",
    descripcion: "Ibuprofeno 400mg",
    presentacion: "Tableta",
    familia: "Antiinflamatorios",
    clase: "Medicamentos",
    generico: "Ibuprofeno",
    laboratorio: "Bayer",
    stock: 1200,
    precio: 3.75,
  },
  {
    id: 3,
    codigo: "MED003",
    descripcion: "Amoxicilina 500mg",
    presentacion: "Cápsula",
    familia: "Antibióticos",
    clase: "Medicamentos",
    generico: "Amoxicilina",
    laboratorio: "Genfar",
    stock: 800,
    precio: 5.25,
  },
  {
    id: 4,
    codigo: "MED004",
    descripcion: "Loratadina 10mg",
    presentacion: "Tableta",
    familia: "Antialérgicos",
    clase: "Medicamentos",
    generico: "Loratadina",
    laboratorio: "Farmacorp",
    stock: 950,
    precio: 3.0,
  },
  {
    id: 5,
    codigo: "MED005",
    descripcion: "Omeprazol 20mg",
    presentacion: "Cápsula",
    familia: "Antiácidos",
    clase: "Medicamentos",
    generico: "Omeprazol",
    laboratorio: "Bayer",
    stock: 750,
    precio: 4.5,
  },
  // Agregar más datos para probar la paginación
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    codigo: `MED${String(i + 6).padStart(3, "0")}`,
    descripcion: `Medicamento de prueba ${i + 1}`,
    presentacion: ["Tableta", "Cápsula", "Jarabe", "Ampolla"][i % 4],
    familia: ["Analgésicos", "Antiinflamatorios", "Antibióticos", "Antialérgicos", "Antiácidos"][i % 5],
    clase: "Medicamentos",
    generico: `Genérico ${i + 1}`,
    laboratorio: ["Farmacorp", "Bayer", "Genfar", "Pfizer"][i % 4],
    stock: Math.floor(Math.random() * 2000) + 100,
    precio: Math.round((Math.random() * 10 + 1) * 100) / 100,
  })),
]

// Datos de ejemplo para la tabla de precios
const preciosData = [
  {
    id: 1,
    codigo: "PRE001",
    descripcion: "Precio Paracetamol 500mg",
    item: "MED001",
    precio_venta: 2.5,
    precio_compra: 1.2,
    margen: 1.3,
    porcentaje: 108.33,
    fecha_vigencia: "01/01/2025",
  },
  {
    id: 2,
    codigo: "PRE002",
    descripcion: "Precio Ibuprofeno 400mg",
    item: "MED002",
    precio_venta: 3.75,
    precio_compra: 1.8,
    margen: 1.95,
    porcentaje: 108.33,
    fecha_vigencia: "01/01/2025",
  },
  {
    id: 3,
    codigo: "PRE003",
    descripcion: "Precio Amoxicilina 500mg",
    item: "MED003",
    precio_venta: 5.25,
    precio_compra: 2.5,
    margen: 2.75,
    porcentaje: 110.0,
    fecha_vigencia: "01/01/2025",
  },
  {
    id: 4,
    codigo: "PRE004",
    descripcion: "Precio Loratadina 10mg",
    item: "MED004",
    precio_venta: 3.0,
    precio_compra: 1.4,
    margen: 1.6,
    porcentaje: 114.29,
    fecha_vigencia: "01/01/2025",
  },
  {
    id: 5,
    codigo: "PRE005",
    descripcion: "Precio Omeprazol 20mg",
    item: "MED005",
    precio_venta: 4.5,
    precio_compra: 2.1,
    margen: 2.4,
    porcentaje: 114.29,
    fecha_vigencia: "01/01/2025",
  },
  // Agregar más datos para probar la paginación
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    codigo: `PRE${String(i + 6).padStart(3, "0")}`,
    descripcion: `Precio de prueba ${i + 1}`,
    item: `MED${String(i + 6).padStart(3, "0")}`,
    precio_venta: Math.round((Math.random() * 10 + 2) * 100) / 100,
    precio_compra: Math.round((Math.random() * 5 + 1) * 100) / 100,
    margen: 0, // Se calculará
    porcentaje: 0, // Se calculará
    fecha_vigencia: "01/01/2025",
  })).map((item) => {
    const margen = Math.round((item.precio_venta - item.precio_compra) * 100) / 100
    const porcentaje = Math.round((margen / item.precio_compra) * 100 * 100) / 100
    return { ...item, margen, porcentaje }
  }),
]

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("items")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [preciosPageSize, setPreciosPageSize] = useState(10)
  const [preciosCurrentPage, setPreciosCurrentPage] = useState(1)
  const [editPrecioDialogOpen, setEditPrecioDialogOpen] = useState(false)
  const [selectedPrecio, setSelectedPrecio] = useState<number | null>(null)

  // Filtrar datos según término de búsqueda
  const filteredItems = itemsData.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filtrar precios según el item seleccionado
  const filteredPrecios = selectedItem
    ? preciosData.filter((precio) => precio.item === itemsData.find((item) => item.id === selectedItem)?.codigo)
    : preciosData

  // Calcular datos paginados
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const paginatedPrecios = filteredPrecios.slice(
    (preciosCurrentPage - 1) * preciosPageSize,
    preciosCurrentPage * preciosPageSize,
  )

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedItems.map((item) => item.id))
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
      if (selectedItems.length + 1 === paginatedItems.length) {
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

  // Manejar cambio de página para precios
  const handlePreciosPageChange = (page: number) => {
    setPreciosCurrentPage(page)
  }

  // Manejar cambio de tamaño de página para precios
  const handlePreciosPageSizeChange = (size: number) => {
    setPreciosPageSize(size)
    setPreciosCurrentPage(1)
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

  // Manejar edición
  const handleEdit = () => {
    if (selectedItems.length === 1) {
      setEditDialogOpen(true)
    }
  }

  // Manejar edición de precio
  const handleEditPrecio = (id: number) => {
    setSelectedPrecio(id)
    setEditPrecioDialogOpen(true)
  }

  // Manejar guardado de item
  const handleSaveItem = (data: any) => {
    console.log("Guardando item:", data)
    setEditDialogOpen(false)
  }

  // Manejar guardado de precio
  const handleSavePrecio = (data: any) => {
    console.log("Guardando precio:", data)
    setEditPrecioDialogOpen(false)
  }

  // Manejar clic en item para mostrar precios
  const handleItemClick = (id: number) => {
    setSelectedItem(id)
    setActiveTab("precios")
  }

  // Verificar si hay elementos seleccionados
  const hasSelection = selectedItems.length > 0

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Items</CardTitle>
        </CardHeader>
        <CardContent>
          <TableToolbar
            searchPlaceholder="Buscar por código o descripción..."
            onSearch={setSearchQuery}
            onRefresh={() => {
              setSearchQuery("")
              setCurrentPage(1)
              setSelectedItems([])
              setSelectAll(false)
            }}
            onNew={() => {
              setSelectedItem(null)
              setEditDialogOpen(true)
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPrint={() => console.log("Imprimir")}
            onExport={() => console.log("Exportar")}
            onFilter={() => console.log("Filtrar")}
            disableEdit={!hasSelection}
            disableDelete={!hasSelection}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="precios" disabled={!selectedItem}>
                Precios
              </TabsTrigger>
            </TabsList>
            <TabsContent value="items" className="mt-4">
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
                      <TableHead>CÓDIGO</TableHead>
                      <TableHead>DESCRIPCIÓN</TableHead>
                      <TableHead>PRESENTACIÓN</TableHead>
                      <TableHead>FAMILIA</TableHead>
                      <TableHead>CLASE</TableHead>
                      <TableHead>GENÉRICO</TableHead>
                      <TableHead>LABORATORIO</TableHead>
                      <TableHead>STOCK</TableHead>
                      <TableHead>PRECIO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center h-24">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((item) => (
                        <TableRow
                          key={item.id}
                          className={selectedItem === item.id ? "bg-primary/10" : ""}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                              aria-label={`Seleccionar item ${item.codigo}`}
                            />
                          </TableCell>
                          <TableCell>{item.codigo}</TableCell>
                          <TableCell>{item.descripcion}</TableCell>
                          <TableCell>{item.presentacion}</TableCell>
                          <TableCell>{item.familia}</TableCell>
                          <TableCell>{item.clase}</TableCell>
                          <TableCell>{item.generico}</TableCell>
                          <TableCell>{item.laboratorio}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>${item.precio.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación para Items */}
              <Pagination
                totalItems={filteredItems.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </TabsContent>
            <TabsContent value="precios" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>CÓDIGO</TableHead>
                      <TableHead>DESCRIPCIÓN</TableHead>
                      <TableHead>ITEM</TableHead>
                      <TableHead>PRECIO VENTA</TableHead>
                      <TableHead>PRECIO COMPRA</TableHead>
                      <TableHead>MARGEN</TableHead>
                      <TableHead>PORCENTAJE</TableHead>
                      <TableHead>FECHA VIGENCIA</TableHead>
                      <TableHead className="text-right">ACCIONES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPrecios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center h-24">
                          No se encontraron precios para este item.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedPrecios.map((precio) => (
                        <TableRow key={precio.id}>
                          <TableCell>{precio.codigo}</TableCell>
                          <TableCell>{precio.descripcion}</TableCell>
                          <TableCell>{precio.item}</TableCell>
                          <TableCell>${precio.precio_venta.toFixed(2)}</TableCell>
                          <TableCell>${precio.precio_compra.toFixed(2)}</TableCell>
                          <TableCell>${precio.margen.toFixed(2)}</TableCell>
                          <TableCell>{precio.porcentaje.toFixed(2)}%</TableCell>
                          <TableCell>{precio.fecha_vigencia}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPrecio(precio.id)}>
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación para Precios */}
              <Pagination
                totalItems={filteredPrecios.length}
                pageSize={preciosPageSize}
                currentPage={preciosCurrentPage}
                onPageChange={handlePreciosPageChange}
                onPageSizeChange={handlePreciosPageSizeChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="¿Está seguro de eliminar?"
        description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "item" : "items"}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />

      {/* Diálogo para editar item */}
      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveItem}
        type="items"
        data={selectedItems.length === 1 ? itemsData.find((item) => item.id === selectedItems[0]) : undefined}
      />

      {/* Diálogo para editar precio */}
      <EditDialog
        open={editPrecioDialogOpen}
        onOpenChange={setEditPrecioDialogOpen}
        onSave={handleSavePrecio}
        type="precios"
        data={
          selectedPrecio
            ? {
                ...preciosData.find((precio) => precio.id === selectedPrecio),
                item: itemsData.find((item) => item.id === selectedItem)?.codigo,
                nombre: itemsData.find((item) => item.id === selectedItem)?.descripcion,
              }
            : undefined
        }
      />
    </div>
  )
}

