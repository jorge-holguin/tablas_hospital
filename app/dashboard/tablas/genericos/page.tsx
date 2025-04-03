"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash, FileSpreadsheet, ArrowLeft, Filter, RefreshCw, Printer } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Pagination } from "@/components/pagination"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { TableToolbar } from "@/components/table-toolbar"

interface Generico {
  GENERICO: string
  NOMBRE: string
  ACTIVO: string | number
}

export default function GenericosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [genericos, setGenericos] = useState<Generico[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // Función para cargar genéricos desde el backend
  const loadGenericos = async () => {
    setLoading(true)
    try {
      const skip = (currentPage - 1) * pageSize
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
      
      // Obtener genéricos
      const response = await fetch(`/api/tablas/genericos?take=${pageSize}&skip=${skip}${searchParam}`)
      if (!response.ok) throw new Error('Error al cargar genéricos')
      const data = await response.json()
      setGenericos(data)
      
      try {
        // Obtener total de genéricos para paginación
        const countResponse = await fetch(`/api/tablas/genericos/count${searchParam ? `?${searchParam.substring(1)}` : ''}`)
        if (!countResponse.ok) {
          console.error('Error en la respuesta del conteo:', await countResponse.text())
          throw new Error('Error al obtener el conteo de genéricos')
        }
        const { count } = await countResponse.json()
        setTotalItems(count)
      } catch (countError) {
        console.error('Error al obtener el conteo:', countError)
        // Si falla el conteo, usar la longitud de los datos como total
        setTotalItems(data.length)
      }
    } catch (error) {
      console.error('Error loading genericos:', error)
      toast.error('Error al cargar los genéricos')
      setGenericos([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar genéricos cuando cambia la página, el tamaño de página o el término de búsqueda
  useEffect(() => {
    loadGenericos()
  }, [currentPage, pageSize, searchTerm])

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(genericos.map((item) => item.GENERICO))
    }
    setSelectAll(!selectAll)
  }

  // Manejar selección individual
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleRefresh = () => {
    setSearchTerm("")
    setSelectedItems([])
    setSelectAll(false)
    setCurrentPage(1)
    loadGenericos()
  }

  const handlePrint = () => {
    toast.success('Enviando documento a la impresora')
  }

  const handleExport = () => {
    toast.success('Exportando datos a Excel')
  }

  const handleEdit = () => {
    if (selectedItems.length !== 1) return

    const itemToEdit = genericos.find((item) => item.GENERICO === selectedItems[0])
    if (itemToEdit) {
      setSelectedItem(itemToEdit.GENERICO)
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
        // Actualizar genérico existente
        const response = await fetch(`/api/tablas/genericos/${selectedItem}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        
        if (!response.ok) throw new Error('Error al actualizar el genérico')
        
        toast.success(`El genérico ${data.NOMBRE} ha sido actualizado correctamente`)
      } else {
        // Crear nuevo genérico
        const response = await fetch('/api/tablas/genericos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        
        if (!response.ok) throw new Error('Error al crear el genérico')
        
        toast.success(`El genérico ${data.NOMBRE} ha sido creado correctamente`)
      }
      
      // Recargar datos
      loadGenericos()
      setEditDialogOpen(false)
      setSelectedItem(null)
      setSelectedItems([])
    } catch (error) {
      console.error('Error saving generico:', error)
      toast.error(`Error al ${selectedItem ? 'actualizar' : 'crear'} el genérico`)
    }
  }

  const confirmDelete = async () => {
    try {
      // Si hay múltiples elementos seleccionados, eliminarlos todos
      if (selectedItems.length > 0) {
        const deletePromises = selectedItems.map(id => 
          fetch(`/api/tablas/genericos/${id}`, {
            method: 'DELETE',
          })
        )
        
        const results = await Promise.all(deletePromises)
        
        // Verificar si todas las eliminaciones fueron exitosas
        if (results.every(res => res.ok)) {
          toast.success(`Se han eliminado ${selectedItems.length} genéricos correctamente`)
          loadGenericos()
        } else {
          toast.error('Hubo errores al eliminar algunos genéricos')
        }
      }
    } catch (error) {
      console.error('Error deleting genericos:', error)
      toast.error('Error al eliminar los genéricos')
    }
    
    setSelectedItems([])
    setSelectAll(false)
    setConfirmDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <TableToolbar
        title="Tabla de Genéricos"
        searchPlaceholder="Buscar por código o nombre..."
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPrint={handlePrint}
        onExport={handleExport}
        backUrl="/dashboard/tablas"
        disableEdit={selectedItems.length !== 1}
        disableDelete={selectedItems.length === 0}
        newButtonText="Nuevo Genérico"
      />

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
                {loading ? (
                  <TableRow key="loading-row">
                    <TableCell colSpan={4} className="text-center py-8">
                      Cargando genéricos...
                    </TableCell>
                  </TableRow>
                ) : genericos.length === 0 ? (
                  <TableRow key="empty-row">
                    <TableCell colSpan={4} className="text-center py-8">
                      No se encontraron genéricos
                    </TableCell>
                  </TableRow>
                ) : (
                  genericos.map((generico) => (
                    <TableRow key={generico.GENERICO} className={selectedItems.includes(generico.GENERICO) ? "bg-primary/10" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(generico.GENERICO)}
                          onCheckedChange={() => handleSelectItem(generico.GENERICO)}
                          aria-label={`Seleccionar genérico ${generico.GENERICO}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{generico.GENERICO}</TableCell>
                      <TableCell>{generico.NOMBRE}</TableCell>
                      <TableCell>{Number(generico.ACTIVO) === 1 ? "Sí" : "No"}</TableCell>
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
        title={selectedItem ? "Editar Genérico" : "Nuevo Genérico"}
        fields={[
          {
            name: "GENERICO",
            label: "Código",
            type: "text",
            required: true,
            readOnly: !!selectedItem
          },
          {
            name: "NOMBRE",
            label: "Nombre",
            type: "text",
            required: true
          },
          {
            name: "ACTIVO",
            label: "Activo",
            type: "select",
            options: [
              { value: "1", label: "Sí" },
              { value: "0", label: "No" }
            ]
          }
        ]}
        data={selectedItem ? genericos.find((item) => item.GENERICO === selectedItem) : undefined}
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
