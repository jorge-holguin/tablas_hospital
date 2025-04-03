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

export default function GenericosPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Datos de ejemplo para genéricos
  const genericosData = [
    { id: "0001301", nombre: "ETILFRINA AMP", activo: "1" },
    { id: "0001304", nombre: "ETINILESTRADIOL-LEVONORGESTREL 0.03/0.15MG CAJA", activo: "1" },
    { id: "0001305", nombre: "ETIONAMIDA", activo: "1" },
    { id: "0001307", nombre: "ETOPOSIDO", activo: "1" },
    { id: "0001310", nombre: "EUCALIPTOL", activo: "1" },
    { id: "0001312", nombre: "FEBUPROL", activo: "1" },
    { id: "0001314", nombre: "FENILAMINARSÁN", activo: "1" },
    { id: "0001316", nombre: "FENILAZODIAMINOPIRIDINA,CLORHI", activo: "1" },
    { id: "0001317", nombre: "FENILEFRINA", activo: "1" },
    { id: "0001324", nombre: "FENITOINA 250MG AMP", activo: "1" },
    { id: "0001326", nombre: "FENOLFTALEINA", activo: "1" },
    { id: "0001333", nombre: "SULFATO FERROSO GOTAS", activo: "1" },
    { id: "0001335", nombre: "FLAVOXATO,CLORHIDRATO DE", activo: "1" },
    { id: "0001337", nombre: "FLOROGLUCINOL", activo: "1" },
    { id: "0001340", nombre: "FLUFENAMICO,ACIDO", activo: "1" },
    // Agregar más datos para probar la paginación
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `000${1350 + i}`,
      nombre: `GENÉRICO DE PRUEBA ${i + 1}`,
      activo: i % 3 === 0 ? "0" : "1",
    })),
  ]

  // Filtrar genéricos basado en el término de búsqueda
  const filteredGenericos = genericosData.filter(
    (generico) =>
      generico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      generico.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calcular datos paginados
  const paginatedGenericos = filteredGenericos.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedGenericos.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar selección individual
  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === paginatedGenericos.length) {
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

    const itemToEdit = genericosData.find((item) => item.id === selectedItems[0])
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
        title: "Genérico actualizado",
        description: `El genérico ${data.nombre} ha sido actualizado correctamente`,
      })
    } else {
      toast({
        title: "Genérico creado",
        description: `El genérico ${data.nombre} ha sido creado correctamente`,
      })
    }
    setEditDialogOpen(false)
  }

  const confirmDelete = () => {
    toast({
      title: "Genéricos eliminados",
      description: `Se han eliminado ${selectedItems.length} genéricos correctamente`,
    })
    setSelectedItems([])
    setSelectAll(false)
    setConfirmDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Genéricos</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
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
            Nuevo
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
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Seleccionar todos" />
                  </TableHead>
                  <TableHead className="w-[100px]">GENERICO</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead className="w-[80px]">ACTIVO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGenericos.length > 0 ? (
                  paginatedGenericos.map((generico) => (
                    <TableRow key={generico.id} className={selectedItems.includes(generico.id) ? "bg-primary/10" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(generico.id)}
                          onCheckedChange={() => handleSelectItem(generico.id)}
                          aria-label={`Seleccionar genérico ${generico.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{generico.id}</TableCell>
                      <TableCell>{generico.nombre}</TableCell>
                      <TableCell>{generico.activo}</TableCell>
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
        totalItems={filteredGenericos.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveItem}
        type="genericos"
        data={selectedItem ? genericosData.find((item) => item.id === selectedItem) : undefined}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="¿Está seguro de eliminar?"
        description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "genérico" : "genéricos"}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  )
}

