"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { TableToolbar } from "@/components/table-toolbar"
import { Pagination } from "@/components/pagination"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EditDialog } from "@/components/edit-dialog"
import { toast } from "sonner"

interface Presentacion {
  PRESENTACION: string
  NOMBRE: string
  ACTIVO: string | number
}

export default function PresentacionesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // Función para cargar presentaciones desde el backend
  const loadPresentaciones = async () => {
    setLoading(true)
    try {
      const skip = (currentPage - 1) * pageSize
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
      
      // Obtener presentaciones
      const response = await fetch(`/api/tablas/presentaciones?take=${pageSize}&skip=${skip}${searchParam}`)
      if (!response.ok) throw new Error('Error al cargar presentaciones')
      const data = await response.json()
      setPresentaciones(data)
      
      try {
        // Obtener total de presentaciones para paginación
        const countResponse = await fetch(`/api/tablas/presentaciones/count${searchParam ? `?${searchParam.substring(1)}` : ''}`)
        if (!countResponse.ok) {
          console.error('Error en la respuesta del conteo:', await countResponse.text())
          throw new Error('Error al obtener el conteo de presentaciones')
        }
        const { count } = await countResponse.json()
        setTotalItems(count)
      } catch (countError) {
        console.error('Error al obtener el conteo:', countError)
        // Si falla el conteo, usar la longitud de los datos como total
        setTotalItems(data.length)
      }
    } catch (error) {
      console.error('Error loading presentaciones:', error)
      toast.error('Error al cargar las presentaciones')
      setPresentaciones([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar presentaciones cuando cambia la página, el tamaño de página o el término de búsqueda
  useEffect(() => {
    loadPresentaciones()
  }, [currentPage, pageSize, searchTerm])

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(presentaciones.map((item) => item.PRESENTACION))
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
      if (selectedItems.length + 1 === presentaciones.length) {
        setSelectAll(true)
      }
    }
  }

  const handleRefresh = () => {
    setSearchTerm("")
    setSelectedItems([])
    setSelectAll(false)
    setCurrentPage(1)
    loadPresentaciones()
  }

  const handlePrint = () => {
    toast.success('Enviando documento a la impresora')
  }

  const handleExcel = () => {
    toast.success('Exportando datos a Excel')
  }

  const handleEdit = () => {
    if (selectedItems.length !== 1) return

    const itemToEdit = presentaciones.find((item) => item.PRESENTACION === selectedItems[0])
    if (itemToEdit) {
      setSelectedItem(itemToEdit.PRESENTACION)
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

  const handleSaveItem = async (data: any) => {
    try {
      if (selectedItem) {
        // Actualizar presentación existente
        const response = await fetch(`/api/tablas/presentaciones/${selectedItem}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        
        if (!response.ok) throw new Error('Error al actualizar la presentación')
        
        toast.success(`La presentación ${data.NOMBRE} ha sido actualizada correctamente`)
      } else {
        // Crear nueva presentación
        const response = await fetch('/api/tablas/presentaciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        
        if (!response.ok) throw new Error('Error al crear la presentación')
        
        toast.success(`La presentación ${data.NOMBRE} ha sido creada correctamente`)
      }
      
      // Recargar datos
      loadPresentaciones()
      setEditDialogOpen(false)
      setSelectedItem(null)
      setSelectedItems([])
    } catch (error) {
      console.error('Error saving presentacion:', error)
      toast.error(`Error al ${selectedItem ? 'actualizar' : 'crear'} la presentación`)
    }
  }

  const confirmDelete = async () => {
    try {
      // Si hay múltiples elementos seleccionados, eliminarlos todos
      if (selectedItems.length > 0) {
        const deletePromises = selectedItems.map(id => 
          fetch(`/api/tablas/presentaciones/${id}`, {
            method: 'DELETE',
          })
        )
        
        await Promise.all(deletePromises)
        
        toast.success(`Se han eliminado ${selectedItems.length} presentaciones correctamente`)
        loadPresentaciones()
      }
    } catch (error) {
      console.error('Error deleting presentaciones:', error)
      toast.error('Error al eliminar las presentaciones')
    }
    
    setSelectedItems([])
    setSelectAll(false)
    setConfirmDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <TableToolbar
        title="Tabla de Presentaciones"
        searchPlaceholder="Buscar por código o nombre..."
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPrint={handlePrint}
        onExport={handleExcel}
        backUrl="/dashboard/tablas"
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
                {loading ? (
                  <TableRow key="loading-row">
                    <TableCell colSpan={4} className="text-center py-8">
                      Cargando presentaciones...
                    </TableCell>
                  </TableRow>
                ) : presentaciones.length === 0 ? (
                  <TableRow key="empty-row">
                    <TableCell colSpan={4} className="text-center py-8">
                      No se encontraron presentaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  presentaciones.map((presentacion) => (
                    <TableRow
                      key={presentacion.PRESENTACION}
                      className={selectedItems.includes(presentacion.PRESENTACION) ? "bg-primary/10" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(presentacion.PRESENTACION)}
                          onCheckedChange={() => handleSelectItem(presentacion.PRESENTACION)}
                          aria-label={`Seleccionar presentación ${presentacion.PRESENTACION}`}
                        />
                      </TableCell>
                      <TableCell onClick={() => setSelectedItem(presentacion.PRESENTACION)}>{presentacion.PRESENTACION}</TableCell>
                      <TableCell onClick={() => setSelectedItem(presentacion.PRESENTACION)}>{presentacion.NOMBRE}</TableCell>
                      <TableCell onClick={() => setSelectedItem(presentacion.PRESENTACION)}>{presentacion.ACTIVO}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveItem}
        type="presentaciones"
        data={selectedItem ? presentaciones.find((item) => item.PRESENTACION === selectedItem) : undefined}
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
