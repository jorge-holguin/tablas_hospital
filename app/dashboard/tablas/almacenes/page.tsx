"use client"
import { Pagination } from "@/components/pagination"
import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Pencil, Trash, FileSpreadsheet, ArrowLeft, Filter, RefreshCw, Printer } from "lucide-react"
import Link from "next/link"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { printData } from "@/components/utils/print-helper"
import { exportToCSV } from "@/components/utils/export-helper"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface Almacen {
  ALMACEN: string
  NOMBRE: string
  ACTIVO: number
}

const defaultValues: Partial<Almacen> = {
  ALMACEN: "",
  NOMBRE: "",
  ACTIVO: 1
}

const columns: ColumnDef<Almacen, unknown>[] = [
  {
    accessorKey: "ALMACEN",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO",
    cell: ({ row }) => (
      <span>{Number(row.getValue("ACTIVO")) === 1 ? "Sí" : "No"}</span>
    )
  }
]

export default function AlmacenesPage() {
  const { toast } = useToast()
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const handleRefreshData = (loadData: () => void) => {
    setCurrentPage(1)
    loadData()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tabla de Almacenes</h1>
      </div>

      <DataProvider<Almacen>
        apiEndpoint="almacenes"
        idField="ALMACEN"
        defaultValues={defaultValues}
      >
        {({
          data,
          loading,
          totalItems,
          currentPage: dataProviderCurrentPage,
          setCurrentPage: dataProviderSetCurrentPage,
          pageSize,
          setPageSize,
          searchTerm,
          setSearchTerm,
          filterActive,
          setFilterActive,
          selectedItems,
          setSelectedItems,
          selectAll,
          handleSelectAll,
          handleRefresh,
          handleNew,
          handleEdit,
          handleDelete,
          handleSaveItem,
          confirmDelete,
          editDialogOpen,
          setEditDialogOpen,
          confirmDialogOpen,
          setConfirmDialogOpen,
          loadData
        }) => (
          <>
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

              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros {filterActive !== null && <span className="ml-1 h-2 w-2 rounded-full bg-primary"></span>}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select 
                        value={filterActive !== null ? filterActive : 'all'} 
                        onValueChange={(value) => {
                          if (value === 'all') {
                            setFilterActive(null)
                          } else {
                            setFilterActive(value)
                          }
                        }}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">Activos</SelectItem>
                          <SelectItem value="0">Inactivos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={() => handleRefreshData(loadData)}>
                        Aplicar filtros
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Almacén
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

                <Button variant="outline" onClick={async () => {
                  try {
                    await printData({
                      title: "Tabla de Almacenes",
                      data,
                      columns: [
                        { key: "ALMACEN", header: "CÓDIGO" },
                        { key: "NOMBRE", header: "NOMBRE" },
                        { 
                          key: "ACTIVO", 
                          header: "ACTIVO",
                          format: (value: number) => Number(value) === 1 ? 'Sí' : 'No'
                        }
                      ]
                    })
                    toast({
                      title: "Imprimiendo",
                      description: "Enviando documento a la impresora",
                    })
                  } catch (error) {
                    console.error('Error al imprimir:', error)
                    toast({
                      title: "Error",
                      description: "Error al imprimir el documento",
                      variant: "destructive"
                    })
                  }
                }}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>

                <Button variant="outline" onClick={() => {
                  const success = exportToCSV({
                    filename: "almacenes",
                    data,
                    columns: [
                      { key: "ALMACEN", header: "CÓDIGO" },
                      { key: "NOMBRE", header: "NOMBRE" },
                      { 
                        key: "ACTIVO", 
                        header: "ACTIVO",
                        format: (value: number) => Number(value) === 1 ? 'Sí' : 'No'
                      }
                    ]
                  })
                  
                  if (success) {
                    toast({
                      title: "Exportando",
                      description: "Datos exportados a CSV correctamente",
                    })
                  } else {
                    toast({
                      title: "Error",
                      description: "Error al exportar los datos",
                      variant: "destructive"
                    })
                  }
                }}>
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
                          <Checkbox 
                            checked={selectAll} 
                            onCheckedChange={handleSelectAll} 
                            aria-label="Seleccionar todos" 
                          />
                        </TableHead>
                        <TableHead>CÓDIGO</TableHead>
                        <TableHead>NOMBRE</TableHead>
                        <TableHead>ACTIVO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Cargando...
                          </TableCell>
                        </TableRow>
                      ) : data.length > 0 ? (
                        data.map((almacen) => (
                          <TableRow 
                            key={almacen.ALMACEN} 
                            className={selectedItems.includes(almacen.ALMACEN) ? "bg-primary/10" : ""}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(almacen.ALMACEN)}
                                onCheckedChange={() => {
                                  if (selectedItems.includes(almacen.ALMACEN)) {
                                    setSelectedItems(selectedItems.filter(id => id !== almacen.ALMACEN))
                                  } else {
                                    setSelectedItems([...selectedItems, almacen.ALMACEN])
                                  }
                                }}
                                aria-label={`Seleccionar almacén ${almacen.ALMACEN}`}
                              />
                            </TableCell>
                            <TableCell>{almacen.ALMACEN}</TableCell>
                            <TableCell>{almacen.NOMBRE}</TableCell>
                            <TableCell>{Number(almacen.ACTIVO) === 1 ? "Sí" : "No"}</TableCell>
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
              totalItems={totalItems}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Almacén" : "Nuevo Almacén"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "ALMACEN", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
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
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "almacén" : "almacenes"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )}
      </DataProvider>
    </div>
  )
}
