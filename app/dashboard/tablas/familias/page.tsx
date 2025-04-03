"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash, FileSpreadsheet, ArrowLeft, Filter, RefreshCw, Printer } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Pagination } from "@/components/pagination"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function FamiliasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Datos de ejemplo
  const familias = [
    { id: 1, codigo: "0", nombre: "Ninguno", activo: "1" },
    { id: 2, codigo: "0000001", nombre: "ANTITROMBOTICO,ANTINFLA.ANALGESICO", activo: "0" },
    { id: 3, codigo: "0008495", nombre: "POLIENZIMA DIG,SIMETICONA,DEHI", activo: "0" },
    { id: 4, codigo: "0030000", nombre: "ALCOHOLISMO, TRATAMIENTO DEL", activo: "0" },
    { id: 5, codigo: "0050000", nombre: "USO SIS", activo: "1" },
    { id: 6, codigo: "0050100", nombre: "ESTRATEGIAS", activo: "1" },
    { id: 7, codigo: "0050200", nombre: "ALIMENTACION INFANTIL LACTEA", activo: "0" },
    { id: 8, codigo: "0050300", nombre: "ALIMENTACION INFANTIL NO LACTE", activo: "0" },
    { id: 9, codigo: "0050400", nombre: "ALIMENTACION PARENTERAL", activo: "0" },
    { id: 10, codigo: "0070000", nombre: "AMEBICIDAS", activo: "0" },
    // Agregar más datos para probar la paginación
    ...Array.from({ length: 30 }, (_, i) => ({
      id: i + 11,
      codigo: `00${70000 + i * 1000}`,
      nombre: `FAMILIA DE PRUEBA ${i + 1}`,
      activo: i % 3 === 0 ? "0" : "1",
    })),
  ]

  // Filtrar familias basado en el término de búsqueda
  const filteredFamilias = familias.filter(
    (familia) =>
      familia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      familia.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calcular datos paginados
  const paginatedFamilias = filteredFamilias.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedFamilias.map((item) => item.id))
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
      if (selectedItems.length + 1 === paginatedFamilias.length) {
        setSelectAll(true)
      }
    }
  }

  const handleRefresh = () => {
    setSearchTerm("")
    setSelectedItems([])
    setSelectAll(false)
    setCurrentPage(1)
    toast({
      title: "Actualizado",
      description: "La lista ha sido actualizada",
    })
  }

  const handlePrint = () => {
    toast({
      title: "Imprimiendo",
      description: "Enviando documento a la impresora",
    })
  }

  const handleExport = () => {
    toast({
      title: "Exportando",
      description: "Exportando datos a Excel",
    })
  }

  const handleEdit = () => {
    if (selectedItems.length !== 1) return

    const itemToEdit = familias.find((item) => item.id === selectedItems[0])
    if (itemToEdit) {
      setSelectedItem(itemToEdit.id)
      setEditDialogOpen(true)
    }
  }

  const handleNew = () => {
    setSelectedItem(null)
    setEditDialogOpen(true)
  }

  const handleDelete = () => {
    if (selectedItems.length === 0) return
    setConfirmDialogOpen(true)
  }

  const handleSaveItem = (data: any) => {
    if (selectedItem) {
      toast({
        title: "Familia actualizada",
        description: `La familia ${data.nombre} ha sido actualizada correctamente`,
      })
    } else {
      toast({
        title: "Familia creada",
        description: `La familia ${data.nombre} ha sido creada correctamente`,
      })
    }
    setEditDialogOpen(false)
  }

  const confirmDelete = () => {
    toast({
      title: "Familias eliminadas",
      description: `Se han eliminado ${selectedItems.length} familias correctamente`,
    })
    setSelectedItems([])
    setSelectAll(false)
    setConfirmDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Tabla de Familias</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar por código o nombre..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Familia
          </Button>

          <Button variant="outline" onClick={handleEdit} disabled={selectedItems.length !== 1}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>

          <Button variant="outline" onClick={handleDelete} disabled={selectedItems.length === 0}>
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>

          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>

          <Link href="/dashboard/tablas">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Seleccionar todos" />
                  </TableHead>
                  <TableHead>FAMILIA</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>ACTIVO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFamilias.length > 0 ? (
                  paginatedFamilias.map((familia) => (
                    <TableRow key={familia.id} className={selectedItems.includes(familia.id) ? "bg-primary/10" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(familia.id)}
                          onCheckedChange={() => handleSelectItem(familia.id)}
                          aria-label={`Seleccionar familia ${familia.codigo}`}
                        />
                      </TableCell>
                      <TableCell onClick={() => setSelectedItem(familia.id)}>{familia.codigo}</TableCell>
                      <TableCell onClick={() => setSelectedItem(familia.id)}>{familia.nombre}</TableCell>
                      <TableCell onClick={() => setSelectedItem(familia.id)}>{familia.activo}</TableCell>
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
        totalItems={filteredFamilias.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveItem}
        type="familias"
        data={selectedItem ? familias.find((item) => item.id === selectedItem) : undefined}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="¿Está seguro de eliminar?"
        description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "familia" : "familias"}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  )
}

