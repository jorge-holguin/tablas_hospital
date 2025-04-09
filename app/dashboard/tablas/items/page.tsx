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
import { 
  RefreshCw, 
  FilePlus, 
  Pencil, 
  Trash2, 
  Printer, 
  FileSpreadsheet 
} from "lucide-react"

// Interfaces para los tipos de datos
interface Item {
  ITEM: string
  NOMBRE?: string
  PRESENTACION?: string
  TIPO_PRODUCTO?: string
  TIPO_PRODUCTO_DESC?: string
  CONCENTRACION?: string
  INTERFASE2?: string // COD_SISMED
  NOM_SISMED?: string
  FRACCION?: number
  VARIABLE?: number
  ACTIVO?: number | string
  MODULO?: string
  [key: string]: any
}

interface Precio {
  IDRECORD: string
  ITEM: string
  FECHA: string
  HORA?: string
  PROMEDIO?: number
  COSTO?: number
  UTILIDAD?: number
  PRECIOPUB?: number
  DESCUENTO?: number
  PRECIO?: number
  SYSINSERT?: string
  SYSUPDATE?: string
  INGRESOID?: string
  DOCUMENTO?: string
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
  const [activeFilter, setActiveFilter] = useState<number | null>(null)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  
  // Estados para almacenar los datos del backend
  const [items, setItems] = useState<Item[]>([])
  const [precios, setPrecios] = useState<Precio[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrecios, setTotalPrecios] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingPrecios, setLoadingPrecios] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null)
  const [precioToEdit, setPrecioToEdit] = useState<Precio | null>(null)
  const [documentoInfo, setDocumentoInfo] = useState<{[key: string]: string}>({})

  // Función para cargar los items desde el backend
  const fetchItems = async () => {
    setLoading(true)
    try {
      let queryParams = `take=${pageSize}&skip=${(currentPage - 1) * pageSize}`;
      
      if (searchQuery) {
        queryParams += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      if (activeFilter !== null) {
        queryParams += `&activeFilter=${activeFilter}`;
      }
      
      // Ordenar por ACTIVO (descendente) y NOMBRE (ascendente)
      queryParams += `&orderBy=ACTIVO:desc,NOMBRE:asc`;
      
      const response = await fetch(`/api/tablas/items?${queryParams}`)
      if (!response.ok) {
        throw new Error('Error al cargar los items')
      }
      const data = await response.json()
      setItems(data)
      
      // Actualizar el contador con los mismos filtros
      let countQueryParams = '';
      if (searchQuery) {
        countQueryParams += `${countQueryParams ? '&' : '?'}search=${encodeURIComponent(searchQuery)}`;
      }
      
      if (activeFilter !== null) {
        countQueryParams += `${countQueryParams ? '&' : '?'}activeFilter=${activeFilter}`;
      }
      
      const countResponse = await fetch(`/api/tablas/items/count${countQueryParams}`)
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
      
      // Obtener información de documentos para cada precio con IngresoID
      const ingresoIds = data
        .filter((precio: Precio) => precio.INGRESOID)
        .map((precio: Precio) => precio.INGRESOID)
      
      if (ingresoIds.length > 0) {
        const documentoInfoTemp: {[key: string]: string} = {}
        
        await Promise.all(
          ingresoIds.map(async (ingresoId: string) => {
            if (ingresoId) {
              try {
                const ingresoResponse = await fetch(`/api/almacenes/ingresos/${ingresoId}`)
                if (ingresoResponse.ok) {
                  const ingresoData = await ingresoResponse.json()
                  documentoInfoTemp[ingresoId] = ingresoData.DOCUMENTO || '-'
                }
              } catch (error) {
                console.error(`Error fetching ingreso ${ingresoId}:`, error)
              }
            }
          })
        )
        
        setDocumentoInfo(documentoInfoTemp)
      }
      
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
  }, [currentPage, pageSize, searchQuery, activeFilter])

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

  // Función para guardar un precio (crear o actualizar)
  const handleSavePrecio = async (data: any) => {
    try {
      // Establecer la fecha y hora actuales
      const now = new Date();
      data.FECHA = now.toISOString().split('T')[0];
      data.HORA = now.toTimeString().slice(0, 5);
      
      // Calcular PRECIOPUB y PRECIO basado en las fórmulas correctas
      const costo = parseFloat(data.COSTO) || 0;
      const utilidad = parseFloat(data.UTILIDAD) || 0;
      const descuento = parseFloat(data.DESCUENTO) || 0;
      
      // Precio Publico = Costo * (1 + porcentaje de utilidad)
      data.PRECIOPUB = costo * (1 + (utilidad / 100));
      
      // Precio Venta = Precio Publico * (1 - porcentaje de descuento)
      data.PRECIO = data.PRECIOPUB * (1 - (descuento / 100));
      
      if (precioToEdit) {
        // Actualizar precio existente
        await fetch(`/api/tablas/precios/${precioToEdit.IDRECORD}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        toast.success('Precio actualizado correctamente')
      } else {
        // Crear nuevo precio
        await fetch('/api/tablas/precios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        toast.success('Precio creado correctamente')
      }
      
      // Actualizar la lista de precios
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

  const handleFilterAll = () => {
    setActiveFilter(null);
    setCurrentPage(1);
  }

  const handleFilterActive = () => {
    setActiveFilter(1);
    setCurrentPage(1);
  }

  const handleFilterInactive = () => {
    setActiveFilter(0);
    setCurrentPage(1);
  }

  // Función para actualizar la lista de items
  const handleRefresh = () => {
    fetchItems();
    toast.success("Lista de items actualizada");
  };

  // Función para crear un nuevo item
  const handleNewItem = () => {
    setItemToEdit(null);
    setEditDialogOpen(true);
  };

  // Función para editar un item seleccionado
  const handleEditItemSelected = () => {
    if (!selectedItem) {
      toast.error("Debe seleccionar un item para editar");
      return;
    }
    
    const item = items.find((item) => item.ITEM === selectedItem);
    if (item) {
      setItemToEdit(item);
      setEditDialogOpen(true);
    }
  };

  // Función para confirmar la eliminación de un item
  const handleConfirmDelete = () => {
    if (!selectedItem) {
      toast.error("Debe seleccionar un item para eliminar");
      return;
    }
    
    setConfirmDialogOpen(true);
  };

  // Función para exportar a Excel
  const handleExportToExcel = async () => {
    try {
      // Construir los parámetros de consulta con los mismos filtros que la vista actual
      let queryParams = '';
      
      if (searchQuery) {
        queryParams += `${queryParams ? '&' : '?'}search=${encodeURIComponent(searchQuery)}`;
      }
      
      if (activeFilter !== null) {
        queryParams += `${queryParams ? '&' : '?'}activeFilter=${activeFilter}`;
      }
      
      // Ordenar por ACTIVO (descendente) y NOMBRE (ascendente)
      queryParams += `${queryParams ? '&' : '?'}orderBy=ACTIVO:desc,NOMBRE:asc`;
      
      // Obtener todos los items para exportar (sin paginación)
      const response = await fetch(`/api/tablas/items/export${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al exportar los items');
      }
      
      // Descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'items.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Archivo Excel generado correctamente');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Error al exportar a Excel');
    }
  };

  // Función para imprimir la lista de items
  const handlePrint = () => {
    // Crear una ventana de impresión
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes para esta página.');
      return;
    }
    
    // Crear el contenido HTML para imprimir
    const itemsToShow = items.map(item => ({
      ITEM: item.ITEM,
      NOMBRE: item.NOMBRE || '',
      PRESENTACION: item.PRESENTACION || '',
      TIPO_PRODUCTO_DESC: item.TIPO_PRODUCTO_DESC || item.TIPO_PRODUCTO || '',
      CONCENTRACION: item.CONCENTRACION || '',
      ACTIVO: Number(item.ACTIVO) === 1 ? 'Sí' : 'No'
    }));
    
    // Generar el HTML para la impresión
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Listado de Items</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .date { text-align: right; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Listado de Items</h1>
          <div class="date">Fecha: ${new Date().toLocaleDateString()}</div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Presentación</th>
                <th>Tipo Producto</th>
                <th>Concentración</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              ${itemsToShow.map(item => `
                <tr>
                  <td>${item.ITEM}</td>
                  <td>${item.NOMBRE}</td>
                  <td>${item.PRESENTACION}</td>
                  <td>${item.TIPO_PRODUCTO_DESC}</td>
                  <td>${item.CONCENTRACION}</td>
                  <td>${item.ACTIVO}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    // Escribir el HTML en la ventana de impresión
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Esperar a que se carguen los estilos y luego imprimir
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Función para manejar el filtro
  const handleFilter = () => {
    setFilterDialogOpen(true);
  };

  // Función para aplicar el filtro
  const handleApplyFilter = (filter: number | null) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

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
          {/* Botones superiores desactivados - funcionalidad movida a botones inferiores */}
        </div>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Items</CardTitle>
              <TableToolbar
                searchPlaceholder="Buscar por código o descripción..."
                searchQuery={searchQuery}
                onSearchChange={(query) => setSearchQuery(query)}
                onRefresh={handleRefresh}
                onNew={handleNewItem}
                onEdit={handleEditItemSelected}
                onDelete={handleConfirmDelete}
                onPrint={handlePrint}
                onExport={handleExportToExcel}
                disableEdit={!selectedItem}
                disableDelete={!selectedItem}
                showFilterButton={true}
                onFilter={handleFilter}
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
                      <TableHead className="w-28">Item</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Presentacion</TableHead>
                      <TableHead>Tipo Producto</TableHead>
                      <TableHead>Concentracion</TableHead>
                      <TableHead>COD_SISMED</TableHead>
                      <TableHead>NOM_SISMED</TableHead>
                      <TableHead>Fraccion</TableHead>
                      <TableHead>Variable</TableHead>
                      <TableHead>Activo</TableHead>
                      <TableHead>Modulo</TableHead>
                      <TableHead className="w-28">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">
                          Cargando items...
                        </TableCell>
                      </TableRow>
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">
                          No se encontraron items
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow
                          key={item.ITEM}
                          className={selectedItem === item.ITEM ? "bg-muted/50" : undefined}
                          onClick={() => {
                            setSelectedItem(item.ITEM)
                          }}
                          style={{ cursor: 'pointer' }}
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
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.ITEM}</TableCell>
                          <TableCell>{item.NOMBRE || '-'}</TableCell>
                          <TableCell>{item.PRESENTACION || '-'}</TableCell>
                          <TableCell>{item.TIPO_PRODUCTO_DESC || item.TIPO_PRODUCTO || '-'}</TableCell>
                          <TableCell>{item.CONCENTRACION || '-'}</TableCell>
                          <TableCell>{item.INTERFASE2 || '-'}</TableCell>
                          <TableCell>{item.NOM_SISMED || '-'}</TableCell>
                          <TableCell>{item.FRACCION || 0}</TableCell>
                          <TableCell>{item.VARIABLE || 0}</TableCell>
                          <TableCell>
                            {Number(item.ACTIVO) === 1 ? "Activo" : "Inactivo"}
                          </TableCell>
                          <TableCell>{item.MODULO || '-'}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(item.ITEM);
                                  setActiveTab("precios");
                                }}
                                title="Ver precios"
                              >
                                💰
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
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPrecioToEdit(null);
                    setEditPrecioDialogOpen(true);
                  }}
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  Nuevo Precio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fetchPrecios();
                    toast.success("Lista de precios actualizada");
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ITEM</TableHead>
                      <TableHead>FECHA</TableHead>
                      <TableHead>HORA</TableHead>
                      <TableHead>PROMEDIO</TableHead>
                      <TableHead>COSTO</TableHead>
                      <TableHead>UTILIDAD</TableHead>
                      <TableHead>PRECIOPUB</TableHead>
                      <TableHead>DESCUENTO</TableHead>
                      <TableHead>PRECIO</TableHead>
                      <TableHead>SYSINSERT</TableHead>
                      <TableHead>SYSUPDATE</TableHead>
                      <TableHead>INGRESOID</TableHead>
                      <TableHead>DOCUMENTO</TableHead>
                      <TableHead className="w-28">ACCIONES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingPrecios ? (
                      <TableRow>
                        <TableCell colSpan={14} className="text-center py-8">
                          Cargando precios...
                        </TableCell>
                      </TableRow>
                    ) : precios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={14} className="text-center py-8">
                          No se encontraron precios para este item
                        </TableCell>
                      </TableRow>
                    ) : (
                      precios.map((precio) => (
                        <TableRow
                          key={precio.IDRECORD}
                          className={selectedPrecio === precio.IDRECORD ? "bg-muted/50" : undefined}
                        >
                          <TableCell>{precio.ITEM}</TableCell>
                          <TableCell>{new Date(precio.FECHA).toLocaleDateString()}</TableCell>
                          <TableCell>{precio.HORA || '-'}</TableCell>
                          <TableCell>{precio.PROMEDIO ? precio.PROMEDIO.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{precio.COSTO ? precio.COSTO.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{precio.UTILIDAD ? precio.UTILIDAD.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{precio.PRECIOPUB ? precio.PRECIOPUB.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{precio.DESCUENTO ? precio.DESCUENTO.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{precio.PRECIO ? precio.PRECIO.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>{precio.SYSINSERT || '-'}</TableCell>
                          <TableCell>{precio.SYSUPDATE || '-'}</TableCell>
                          <TableCell>{precio.INGRESOID || '-'}</TableCell>
                          <TableCell>{precio.INGRESOID && documentoInfo[precio.INGRESOID] ? documentoInfo[precio.INGRESOID] : '-'}</TableCell>
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
          PRESENTACION: "",
          TIPO_PRODUCTO: "",
          TIPO_PRODUCTO_DESC: "",
          CONCENTRACION: "",
          INTERFASE2: "",
          NOM_SISMED: "",
          FRACCION: 0,
          VARIABLE: 0,
          ACTIVO: 1,
          MODULO: "",
        }}
        fields={[
          { name: "ITEM", label: "Código", type: "text", required: true, readOnly: !!itemToEdit },
          { name: "NOMBRE", label: "Descripción", type: "text", required: true },
          { name: "PRESENTACION", label: "Presentación", type: "text" },
          { name: "TIPO_PRODUCTO", label: "Tipo de Producto", type: "text" },
          { name: "TIPO_PRODUCTO_DESC", label: "Descripción del Tipo de Producto", type: "text" },
          { name: "CONCENTRACION", label: "Concentración", type: "text" },
          { name: "INTERFASE2", label: "Cod. Sisméd", type: "text" },
          { name: "NOM_SISMED", label: "Nombre Sisméd", type: "text" },
          { name: "FRACCION", label: "Fracción", type: "number" },
          { name: "VARIABLE", label: "Variable", type: "number" },
          { 
            name: "ACTIVO", 
            label: "Estado", 
            type: "select", 
            options: [
              { value: "1", label: "Activo" },
              { value: "0", label: "Inactivo" },
            ]
          },
          { name: "MODULO", label: "Módulo", type: "text" },
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
          PROMEDIO: 0,
          COSTO: 0,
          UTILIDAD: 0,
          PRECIOPUB: 0,
          DESCUENTO: 0,
          PRECIO: 0
        }}
        fields={[
          { name: "ITEM", label: "Código Item", type: "text", required: true, readOnly: true },
          { 
            name: "PROMEDIO", 
            label: "Promedio", 
            type: "number", 
            required: true,
          },
          { 
            name: "COSTO", 
            label: "Costo", 
            type: "number", 
            required: true,
            onChange: (e, formData, setFormData) => {
              const costo = parseFloat(e.target.value) || 0;
              const utilidad = parseFloat(formData.UTILIDAD) || 0;
              // Precio Publico = Costo * (1 + porcentaje de utilidad)
              const preciopub = costo * (1 + (utilidad / 100));
              const descuento = parseFloat(formData.DESCUENTO) || 0;
              // Precio Venta = Precio Publico * (1 - porcentaje de descuento)
              const precio = preciopub * (1 - (descuento / 100));
              
              setFormData({
                ...formData,
                COSTO: costo,
                PRECIOPUB: preciopub,
                PRECIO: precio
              });
            }
          },
          { 
            name: "UTILIDAD", 
            label: "% de Utilidad", 
            type: "number", 
            required: true,
            onChange: (e, formData, setFormData) => {
              const costo = parseFloat(formData.COSTO) || 0;
              const utilidad = parseFloat(e.target.value) || 0;
              // Precio Publico = Costo * (1 + porcentaje de utilidad)
              const preciopub = costo * (1 + (utilidad / 100));
              const descuento = parseFloat(formData.DESCUENTO) || 0;
              // Precio Venta = Precio Publico * (1 - porcentaje de descuento)
              const precio = preciopub * (1 - (descuento / 100));
              
              setFormData({
                ...formData,
                UTILIDAD: utilidad,
                PRECIOPUB: preciopub,
                PRECIO: precio
              });
            }
          },
          { 
            name: "PRECIOPUB", 
            label: "Precio Público", 
            type: "number", 
            required: true,
            readOnly: true
          },
          { 
            name: "DESCUENTO", 
            label: "% Descuento", 
            type: "number", 
            required: true,
            onChange: (e, formData, setFormData) => {
              const preciopub = parseFloat(formData.PRECIOPUB) || 0;
              const descuento = parseFloat(e.target.value) || 0;
              // Precio Venta = Precio Publico * (1 - porcentaje de descuento)
              const precio = preciopub * (1 - (descuento / 100));
              
              setFormData({
                ...formData,
                DESCUENTO: descuento,
                PRECIO: precio
              });
            }
          },
          { 
            name: "PRECIO", 
            label: "Precio Venta", 
            type: "number", 
            required: true,
            readOnly: true
          }
        ]}
      />

      {/* Diálogo para filtrar items */}
      <ConfirmDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        title="Filtrar Items"
        description="Seleccione el tipo de items que desea visualizar."
        confirmText="Aplicar"
        cancelText="Cancelar"
        onConfirm={() => {}}
      >
        <div className="flex flex-col gap-4 py-4">
          <Button 
            variant={activeFilter === null ? "default" : "outline"} 
            onClick={() => handleApplyFilter(null)}
            className="w-full"
          >
            Todos los Items
          </Button>
          <Button 
            variant={activeFilter === 1 ? "default" : "outline"} 
            onClick={() => handleApplyFilter(1)}
            className="w-full"
          >
            Items Activos
          </Button>
          <Button 
            variant={activeFilter === 0 ? "default" : "outline"} 
            onClick={() => handleApplyFilter(0)}
            className="w-full"
          >
            Items Inactivos
          </Button>
        </div>
      </ConfirmDialog>
    </div>
  )
}
