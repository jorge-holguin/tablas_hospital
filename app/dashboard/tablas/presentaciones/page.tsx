"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { TableToolbar } from "@/components/table-toolbar"
import { Pagination } from "@/components/pagination"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EditDialog } from "@/components/edit-dialog"

export default function PresentacionesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [currentItem, setCurrentItem] = useState({ codigo: "", nombre: "", activo: "1" })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Datos de ejemplo
  const presentaciones = [
    { id: 1, codigo: "0", nombre: "NINGUNO", activo: "1" },
    { id: 2, codigo: "AER", nombre: "AEROSOL", activo: "1" },
    { id: 3, codigo: "PCH", nombre: "PARCHE", activo: "1" },
    { id: 4, codigo: "GRA", nombre: "GRANULOS", activo: "1" },
    { id: 5, codigo: "BAR", nombre: "BARRA", activo: "1" },
    { id: 6, codigo: "CHM", nombre: "CHAMPU", activo: "1" },
    { id: 7, codigo: "CRM", nombre: "CREMA", activo: "1" },
    { id: 8, codigo: "ELX", nombre: "ELIXIR", activo: "1" },
    { id: 9, codigo: "GAS", nombre: "GAS", activo: "1" },
    { id: 10, codigo: "GEL", nombre: "GEL", activo: "1" },
    // Agregar más datos para probar la paginación
    ...Array.from({ length: 30 }, (_, i) => ({
      id: i + 11,
      codigo: `COD${i + 1}`,
      nombre: `PRESENTACIÓN ${i + 1}`,
      activo: i % 3 === 0 ? "0" : "1",
    })),
  ]

  // Filtrar presentaciones basado en el término de búsqueda
  const filteredPresentaciones = presentaciones.filter(
    (presentacion) =>
      presentacion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presentacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calcular datos paginados
  const paginatedPresentaciones = filteredPresentaciones.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedPresentaciones.map((item) => item.id))
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
      if (selectedItems.length + 1 === paginatedPresentaciones.length) {
        setSelectAll(true)
      }
    }
  }

  // Funciones para la barra de herramientas
  const handleNew = () => {
    setDialogMode("add")
    setCurrentItem({ codigo: "", nombre: "", activo: "1" })
    setEditDialogOpen(true)
  }

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      const item = presentaciones.find((p) => p.id === selectedItems[0])
      if (item) {
        setDialogMode("edit")
        setCurrentItem({
          codigo: item.codigo,
          nombre: item.nombre,
          activo: item.activo,
        })
        setEditDialogOpen(true)
      }
    }
  }

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      setConfirmDialogOpen(true)
    }
  }

  const confirmDelete = () => {
    // Aquí iría la lógica para eliminar los elementos seleccionados
    console.log(`Eliminando ${selectedItems.length} presentaciones`)
    setSelectedItems([])
    setSelectAll(false)
    setConfirmDialogOpen(false)
  }

  const handlePrint = () => {
    // Aquí iría la lógica para imprimir
    alert("Imprimiendo presentaciones")
  }

  const handleExcel = () => {
    // Aquí iría la lógica para exportar a Excel
    alert("Exportando a Excel")
  }

  const handleRefresh = () => {
    setSearchTerm("")
    setSelectedItems([])
    setSelectAll(false)
    setCurrentPage(1)
  }

  const handleSave = (data: any) => {
    // Aquí iría la lógica para guardar
    if (dialogMode === "add") {
      alert(`Agregando nueva presentación: ${data.codigo} - ${data.nombre}`)
    } else {
      alert(`Editando presentación: ${data.codigo} - ${data.nombre}`)
    }
    setEditDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <TableToolbar
        title="Tabla de Presentaciones"
        searchPlaceholder="Buscar por código o nombre..."
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
        newButtonText="Nueva Presentación"
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
                  <TableHead>PRESENTACION</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>ACTIVO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPresentaciones.length > 0 ? (
                  paginatedPresentaciones.map((presentacion) => (
                    <TableRow
                      key={presentacion.id}
                      className={selectedItems.includes(presentacion.id) ? "bg-primary/10" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(presentacion.id)}
                          onCheckedChange={() => handleSelectItem(presentacion.id)}
                          aria-label={`Seleccionar presentación ${presentacion.codigo}`}
                        />
                      </TableCell>
                      <TableCell onClick={() => setSelectedItem(presentacion.id)}>{presentacion.codigo}</TableCell>
                      <TableCell onClick={() => setSelectedItem(presentacion.id)}>{presentacion.nombre}</TableCell>
                      <TableCell onClick={() => setSelectedItem(presentacion.id)}>{presentacion.activo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Pagination
        totalItems={filteredPresentaciones.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
        type="presentaciones"
        data={dialogMode === "edit" ? currentItem : undefined}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="¿Está seguro de eliminar?"
        description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "presentación" : "presentaciones"}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  )
}

