"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, FileEdit, FileSpreadsheet, Printer } from "lucide-react"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"

// Define interfaces for the data structures
interface Item {
  id: number
  codigo: string
  descripcion: string
  presentacion: string
  tipo_producto: string
  concentracion: string
  cod_sismed: string
  nom_sismed: string
  fraccion: string
  variable: string
  activo: string
  modulo: string
}

interface Precio {
  IDRECORD: number
  ITEM: string
  FECHA: string
  HORA: string
  PROMEDIO: number | string
  COSTO: number | string
  UTILIDAD: number | string
  PRECIOPUB: number | string
  DESCUENTO: number | string
  PRECIO: number | string
  SYSINSERT: string
  SYSUPDATE: string | null
  INGRESOID: string
  DOCUMENTO: string
}

export default function PreciosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<string | null>("172091") // Default to item with codigo 172091
  const [activeTab, setActiveTab] = useState("precios") // Default to precios tab
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingPrecios, setLoadingPrecios] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [precios, setPrecios] = useState<Precio[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrecios, setTotalPrecios] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true)
      try {
        const skip = (currentPage - 1) * itemsPerPage
        const response = await fetch(`/api/tablas/items?skip=${skip}&take=${itemsPerPage}&search=${searchTerm}`)
        const data = await response.json()
        
        // Transform the data to match our Item interface
        const transformedItems: Item[] = data.map((item: any) => ({
          id: Number(item.IDRECORD),
          codigo: item.ITEM || '',
          descripcion: item.DESCRIPCION || '',
          presentacion: item.PRESENTACION || '',
          tipo_producto: item.TIPO_PRODUCTO || '',
          concentracion: item.CONCENTRACION || '',
          cod_sismed: item.INTERFASE2 || '', // COD_SISMED
          nom_sismed: item.NOM_SISMED || '',
          fraccion: item.FRACCION ? item.FRACCION.toString() : '',
          variable: item.VARIABLE || '',
          activo: item.ACTIVO ? item.ACTIVO.toString() : '',
          modulo: item.MODULO || '',
        }))
        
        setItems(transformedItems)
        
        // Fetch total count for pagination
        const countResponse = await fetch(`/api/tablas/items/count?search=${searchTerm}`)
        const countData = await countResponse.json()
        setTotalItems(countData.count)
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setLoadingItems(false)
      }
    }
    
    fetchItems()
  }, [searchTerm, currentPage, itemsPerPage])

  // Fetch precios for the selected item
  useEffect(() => {
    if (selectedItem && activeTab === "precios") {
      const fetchPrecios = async () => {
        setLoadingPrecios(true)
        try {
          const skip = (currentPage - 1) * itemsPerPage
          const response = await fetch(`/api/tablas/precios?item=${selectedItem}&skip=${skip}&take=${itemsPerPage}`)
          const data = await response.json()
          setPrecios(data)
          
          // Fetch total count for pagination if needed
          const countResponse = await fetch(`/api/tablas/precios/count?item=${selectedItem}`)
          const countData = await countResponse.json()
          setTotalPrecios(countData.count)
        } catch (error) {
          console.error("Error fetching precios:", error)
        } finally {
          setLoadingPrecios(false)
        }
      }
      
      fetchPrecios()
    }
  }, [selectedItem, activeTab, currentPage, itemsPerPage])

  // Filtrar items basado en el término de búsqueda (client-side filtering for already fetched items)
  const filteredItems = items.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cod_sismed.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar selección individual de item
  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Encontrar el item seleccionado para mostrar sus detalles
  const selectedItemDetails = items.find((item) => item.codigo === selectedItem)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Precios de Items</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="precios" disabled={!selectedItem}>
            Precios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-1">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </Button>
                  <Link href="/dashboard/tablas">
                    <Button variant="outline" className="gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      Regresar
                    </Button>
                  </Link>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por código o descripción..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          aria-label="Seleccionar todos"
                        />
                      </TableHead>
                      <TableHead>ITEM</TableHead>
                      <TableHead>NOMBRE</TableHead>
                      <TableHead>PRESENTACION</TableHead>
                      <TableHead>TIPO_PRODUCTO</TableHead>
                      <TableHead>CONCENTRACION</TableHead>
                      <TableHead>COD_SISMED</TableHead>
                      <TableHead>NOM_SISMED</TableHead>
                      <TableHead>FRACCION</TableHead>
                      <TableHead>VARIABLE</TableHead>
                      <TableHead>ACTIVO</TableHead>
                      <TableHead>MODULO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingItems ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">
                          Cargando items...
                        </TableCell>
                      </TableRow>
                    ) : filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id} className={selectedItem === item.codigo ? "bg-primary/10" : ""}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                              aria-label={`Seleccionar item ${item.codigo}`}
                            />
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.codigo}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.descripcion}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.presentacion}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.tipo_producto}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.concentracion}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.cod_sismed}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.nom_sismed}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.fraccion}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.variable}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.activo}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.codigo)
                              setActiveTab("precios")
                            }}
                          >
                            {item.modulo}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalItems > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center justify-center px-3 py-1 bg-muted rounded-md text-sm">
                      Página {currentPage} de {Math.ceil(totalItems / itemsPerPage)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precios">
          <Card>
            <CardHeader>
              <CardTitle>Precios del Item</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                {selectedItemDetails && (
                  <>
                    <p><strong>Código:</strong> {selectedItemDetails.codigo}</p>
                    <p><strong>Descripción:</strong> {selectedItemDetails.descripcion}</p>
                    <p><strong>Presentación:</strong> {selectedItemDetails.presentacion}</p>
                    <p><strong>Concentración:</strong> {selectedItemDetails.concentracion || '-'}</p>
                  </>
                )}
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
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
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingPrecios ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8">
                          Cargando precios...
                        </TableCell>
                      </TableRow>
                    ) : precios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8">
                          No se encontraron precios para este item
                        </TableCell>
                      </TableRow>
                    ) : (
                      precios.map((precio) => (
                        <TableRow key={precio.IDRECORD}>
                          <TableCell>{precio.FECHA}</TableCell>
                          <TableCell>{precio.HORA}</TableCell>
                          <TableCell>{Number(precio.PROMEDIO).toFixed(3)}</TableCell>
                          <TableCell>{Number(precio.COSTO).toFixed(1)}</TableCell>
                          <TableCell>{Number(precio.UTILIDAD).toFixed(1)}</TableCell>
                          <TableCell>{Number(precio.PRECIOPUB).toFixed(3)}</TableCell>
                          <TableCell>{Number(precio.DESCUENTO).toFixed(2)}</TableCell>
                          <TableCell>{Number(precio.PRECIO).toFixed(3)}</TableCell>
                          <TableCell>{precio.SYSINSERT}</TableCell>
                          <TableCell>{precio.SYSUPDATE || '-'}</TableCell>
                          <TableCell>{precio.INGRESOID}</TableCell>
                          <TableCell>{precio.DOCUMENTO}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileEdit className="h-4 w-4 text-blue-500" />
                              <span className="sr-only">Editar precio</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setActiveTab("items")}>
                  Volver a Items
                </Button>
              </div>
              {totalPrecios > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center justify-center px-3 py-1 bg-muted rounded-md text-sm">
                      Página {currentPage} de {Math.ceil(totalPrecios / itemsPerPage)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalPrecios / itemsPerPage)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
