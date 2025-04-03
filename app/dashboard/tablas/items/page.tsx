"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableToolbar } from "@/components/table-toolbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/pagination"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EditDialog } from "@/components/edit-dialog"
import { toast } from "sonner"

// Interfaces para los tipos de datos
interface Item {
  ITEM: string
  NOMBRE?: string
  ABREVIATURA?: string
  PRESENTACION?: string
  FAMILIA?: string
  CLASE?: string
  GENERICO?: string
  LABORATORIO?: string
  STOCK?: number
  ACTIVO?: number | string
  [key: string]: any
}

interface Precio {
  IDRECORD: string
  ITEM: string
  FECHA: string
  PRECIOA: number
  PRECIOB: number
  PRECIOC: number
  COSTO?: number
  UTILIDAD?: number
  [key: string]: any
}

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("items")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [preciosPageSize, setPreciosPageSize] = useState(10)
  const [preciosCurrentPage, setPreciosCurrentPage] = useState(1)
  const [editPrecioDialogOpen, setEditPrecioDialogOpen] = useState(false)
  const [selectedPrecio, setSelectedPrecio] = useState<string | null>(null)
  
  // Estados para almacenar los datos del backend
  const [items, setItems] = useState<Item[]>([])
  const [precios, setPrecios] = useState<Precio[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrecios, setTotalPrecios] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingPrecios, setLoadingPrecios] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null)
  const [precioToEdit, setPrecioToEdit] = useState<Precio | null>(null)

  // Función para cargar los items desde el backend
  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tablas/items?take=${pageSize}&skip=${(currentPage - 1) * pageSize}${searchQuery ? `&search=${searchQuery}` : ''}`)
      if (!response.ok) {
        throw new Error('Error al cargar los items')
      }
      const data = await response.json()
      setItems(data)
      
      // Obtener el total de items para la paginación
      const countResponse = await fetch('/api/tablas/items/count')
      if (countResponse.ok) {
        const { count } = await countResponse.json()
        setTotalItems(count)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Error al cargar los items')
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar los precios desde el backend
  const fetchPrecios = async () => {
    if (!selectedItem) return
    
    setLoadingPrecios(true)
    try {
      const response = await fetch(`/api/tablas/precios?take=${preciosPageSize}&skip=${(preciosCurrentPage - 1) * preciosPageSize}&item=${selectedItem}`)
      if (!response.ok) {
        throw new Error('Error al cargar los precios')
      }
      const data = await response.json()
      setPrecios(data)
      
      // Obtener el total de precios para la paginación
      const countResponse = await fetch(`/api/tablas/precios/count?item=${selectedItem}`)
      if (countResponse.ok) {
        const { count } = await countResponse.json()
        setTotalPrecios(count)
      }
    } catch (error) {
      console.error('Error fetching precios:', error)
      toast.error('Error al cargar los precios')
    } finally {
      setLoadingPrecios(false)
    }
  }

  // Cargar items al montar el componente o cambiar la paginación/búsqueda
  useEffect(() => {
    fetchItems()
  }, [currentPage, pageSize, searchQuery])

  // Cargar precios cuando se selecciona un item
  useEffect(() => {
    if (selectedItem) {
      fetchPrecios()
    }
  }, [selectedItem, preciosCurrentPage, preciosPageSize])

  // Manejar la selección de todos los items
  useEffect(() => {
    if (selectAll) {
      setSelectedItems(items.map((item) => item.ITEM))
    } else {
      setSelectedItems([])
    }
  }, [selectAll, items])

  // Función para eliminar un item
  const handleDeleteItem = async () => {
    if (!selectedItem) return
    
    try {
      const response = await fetch(`/api/tablas/items/${selectedItem}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Error al eliminar el item')
      }
      
      toast.success('Item eliminado correctamente')
      fetchItems()
      setSelectedItem(null)
      setSelectedItems(selectedItems.filter(id => id !== selectedItem))
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Error al eliminar el item')
    } finally {
      setConfirmDialogOpen(false)
    }
  }

  // Función para guardar cambios en un item
  const handleSaveItem = async (formData: any) => {
    try {
      const method = itemToEdit ? 'PUT' : 'POST'
      const url = itemToEdit ? `/api/tablas/items/${itemToEdit.ITEM}` : '/api/tablas/items'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error(`Error al ${itemToEdit ? 'actualizar' : 'crear'} el item`)
      }
      
      toast.success(`Item ${itemToEdit ? 'actualizado' : 'creado'} correctamente`)
      fetchItems()
      setEditDialogOpen(false)
      setItemToEdit(null)
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error(`Error al ${itemToEdit ? 'actualizar' : 'crear'} el item`)
    }
  }

  // Función para guardar cambios en un precio
  const handleSavePrecio = async (formData: any) => {
    try {
      const method = precioToEdit ? 'PUT' : 'POST'
      const url = precioToEdit ? `/api/tablas/precios/${precioToEdit.IDRECORD}` : '/api/tablas/precios'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error(`Error al ${precioToEdit ? 'actualizar' : 'crear'} el precio`)
      }
      
      toast.success(`Precio ${precioToEdit ? 'actualizado' : 'creado'} correctamente`)
      fetchPrecios()
      setEditPrecioDialogOpen(false)
      setPrecioToEdit(null)
    } catch (error) {
      console.error('Error saving precio:', error)
      toast.error(`Error al ${precioToEdit ? 'actualizar' : 'crear'} el precio`)
    }
  }

  // Función para manejar la edición de un item
  const handleEditItem = (item: Item) => {
    setItemToEdit(item)
    setEditDialogOpen(true)
  }

  // Función para manejar la edición de un precio
  const handleEditPrecio = (precio: Precio) => {
    setPrecioToEdit(precio)
    setEditPrecioDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="precios" disabled={!selectedItem}>
              Precios
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setItemToEdit(null)
                setEditDialogOpen(true)
              }}
            >
              Nuevo Item
            </Button>
            {activeTab === "precios" && selectedItem && (
              <Button
                variant="outline"
                onClick={() => {
                  setPrecioToEdit(null)
                  setEditPrecioDialogOpen(true)
                }}
              >
                Nuevo Precio
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Items</CardTitle>
              <TableToolbar
                searchPlaceholder="Buscar por código o descripción..."
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={(checked) => setSelectAll(!!checked)}
                        />
                      </TableHead>
                      <TableHead className="w-28">Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Presentación</TableHead>
                      <TableHead>Familia</TableHead>
                      <TableHead>Clase</TableHead>
                      <TableHead>Genérico</TableHead>
                      <TableHead>Laboratorio</TableHead>
                      <TableHead className="w-20">Stock</TableHead>
                      <TableHead className="w-20">Estado</TableHead>
                      <TableHead className="w-28">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8">
                          Cargando items...
                        </TableCell>
                      </TableRow>
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8">
                          No se encontraron items
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow
                          key={item.ITEM}
                          className={selectedItem === item.ITEM ? "bg-muted/50" : undefined}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.ITEM)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems([...selectedItems, item.ITEM])
                                } else {
                                  setSelectedItems(selectedItems.filter((id) => id !== item.ITEM))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.ITEM}</TableCell>
                          <TableCell>{item.NOMBRE || '-'}</TableCell>
                          <TableCell>{item.PRESENTACION || '-'}</TableCell>
                          <TableCell>{item.FAMILIA || '-'}</TableCell>
                          <TableCell>{item.CLASE || '-'}</TableCell>
                          <TableCell>{item.GENERICO || '-'}</TableCell>
                          <TableCell>{item.LABORATORIO || '-'}</TableCell>
                          <TableCell>{item.STOCK || 0}</TableCell>
                          <TableCell>
                            {Number(item.ACTIVO) === 1 ? "Activo" : "Inactivo"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedItem(item.ITEM)
                                  setActiveTab("precios")
                                }}
                              >
                                $
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditItem(item)}
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedItem(item.ITEM)
                                  setConfirmDialogOpen(true)
                                }}
                              >
                                🗑️
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                totalItems={totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precios">
          <Card>
            <CardHeader>
              <CardTitle>
                Precios del Item: {selectedItem} - {items.find((item) => item.ITEM === selectedItem)?.NOMBRE}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-28">ID</TableHead>
                      <TableHead className="w-28">Código Item</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Precio A</TableHead>
                      <TableHead>Precio B</TableHead>
                      <TableHead>Precio C</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead>Utilidad</TableHead>
                      <TableHead className="w-28">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingPrecios ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Cargando precios...
                        </TableCell>
                      </TableRow>
                    ) : precios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          No se encontraron precios para este item
                        </TableCell>
                      </TableRow>
                    ) : (
                      precios.map((precio) => (
                        <TableRow
                          key={precio.IDRECORD}
                          className={selectedPrecio === precio.IDRECORD ? "bg-muted/50" : undefined}
                        >
                          <TableCell className="font-medium">{precio.IDRECORD}</TableCell>
                          <TableCell>{precio.ITEM}</TableCell>
                          <TableCell>{new Date(precio.FECHA).toLocaleDateString()}</TableCell>
                          <TableCell>{precio.PRECIOA.toFixed(2)}</TableCell>
                          <TableCell>{precio.PRECIOB.toFixed(2)}</TableCell>
                          <TableCell>{precio.PRECIOC.toFixed(2)}</TableCell>
                          <TableCell>{precio.COSTO ? precio.COSTO.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{precio.UTILIDAD ? precio.UTILIDAD.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditPrecio(precio)}
                              >
                                ✏️
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                totalItems={totalPrecios}
                pageSize={preciosPageSize}
                currentPage={preciosCurrentPage}
                onPageChange={setPreciosCurrentPage}
                onPageSizeChange={setPreciosPageSize}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación para eliminar item */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Eliminar Item"
        description="¿Está seguro que desea eliminar este item? Esta acción no se puede deshacer."
        onConfirm={handleDeleteItem}
      />

      {/* Diálogo para editar/crear item */}
      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={itemToEdit ? "Editar Item" : "Nuevo Item"}
        onSave={handleSaveItem}
        defaultValues={itemToEdit || {
          ITEM: "",
          NOMBRE: "",
          ABREVIATURA: "",
          PRESENTACION: "",
          FAMILIA: "",
          CLASE: "",
          GENERICO: "",
          LABORATORIO: "",
          STOCK: 0,
          ACTIVO: 1,
        }}
        fields={[
          { name: "ITEM", label: "Código", type: "text", required: true, readOnly: !!itemToEdit },
          { name: "NOMBRE", label: "Descripción", type: "text", required: true },
          { name: "ABREVIATURA", label: "Abreviatura", type: "text" },
          { name: "PRESENTACION", label: "Presentación", type: "text" },
          { name: "FAMILIA", label: "Familia", type: "text" },
          { name: "CLASE", label: "Clase", type: "text" },
          { name: "GENERICO", label: "Genérico", type: "text" },
          { name: "LABORATORIO", label: "Laboratorio", type: "text" },
          { name: "STOCK", label: "Stock", type: "number" },
          { 
            name: "ACTIVO", 
            label: "Estado", 
            type: "select", 
            options: [
              { value: "1", label: "Activo" },
              { value: "0", label: "Inactivo" },
            ]
          },
        ]}
      />

      {/* Diálogo para editar/crear precio */}
      <EditDialog
        open={editPrecioDialogOpen}
        onOpenChange={setEditPrecioDialogOpen}
        title={precioToEdit ? "Editar Precio" : "Nuevo Precio"}
        onSave={handleSavePrecio}
        defaultValues={precioToEdit || {
          ITEM: selectedItem,
          PRECIOA: 0,
          PRECIOB: 0,
          PRECIOC: 0,
          COSTO: 0,
          UTILIDAD: 0,
        }}
        fields={[
          { name: "ITEM", label: "Código Item", type: "text", required: true, readOnly: true },
          { name: "PRECIOA", label: "Precio A", type: "number", required: true },
          { name: "PRECIOB", label: "Precio B", type: "number", required: true },
          { name: "PRECIOC", label: "Precio C", type: "number", required: true },
          { name: "COSTO", label: "Costo", type: "number" },
          { name: "UTILIDAD", label: "Utilidad", type: "number" },
        ]}
      />
    </div>
  )
}
