import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash, FileSpreadsheet, ArrowLeft, Filter, RefreshCw, Printer } from "lucide-react"
import { ColumnDef, flexRender, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { Pagination } from "@/components/pagination"
import { printData } from "@/components/utils/print-helper"
import { exportToCSV } from "@/components/utils/export-helper"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'

export interface DataTableProps<T> {
  title: string
  columns: ColumnDef<T, unknown>[]
  data: T[]
  loading?: boolean
  totalItems: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  searchTerm?: string
  setSearchTerm?: (term: string) => void
  filterActive?: string | null
  setFilterActive?: (active: string | null) => void
  selectedRows?: string[]
  setSelectedRows?: (rows: string[]) => void
  selectAll?: boolean
  onSelectAll?: () => void
  idField?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onNew?: () => void
  onRefresh?: () => void
  onBack?: () => void
  backHref?: string
  printConfig?: {
    title: string
    data: T[]
    columns: Array<{
      key: string
      header: string
      format?: (value: any) => string
    }>
  }
  exportConfig?: {
    filename: string
    data: T[]
    columns: Array<{
      key: string
      header: string
      format?: (value: any) => string
    }>
  }
}

export function DataTable<T>({
  title,
  columns,
  data,
  loading = false,
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  searchTerm,
  setSearchTerm,
  filterActive,
  setFilterActive,
  selectedRows = [],
  setSelectedRows,
  selectAll = false,
  onSelectAll,
  idField,
  onEdit,
  onDelete,
  onNew,
  onRefresh,
  onBack,
  backHref,
  printConfig,
  exportConfig
}: DataTableProps<T>) {
  const { toast } = useToast()
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handlePrint = async () => {
    if (!printConfig) return

    try {
      await printData({
        title: printConfig.title,
        data: printConfig.data,
        columns: printConfig.columns
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
  }

  const handleExport = () => {
    if (!exportConfig) return

    const success = exportToCSV({
      filename: exportConfig.filename,
      data: exportConfig.data,
      columns: exportConfig.columns
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
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar por código o nombre..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm?.(e.target.value)}
          />
        </div>

        {setFilterActive && (
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
                    value={filterActive || "all"} 
                    onValueChange={(value) => {
                      setFilterActive(value === "all" ? null : value)
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
                  <Button onClick={() => {
                    onPageChange(1)
                    onRefresh?.()
                  }}>
                    Aplicar filtros
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {onNew && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo
            </Button>
          )}

          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(selectedRows[0])} disabled={selectedRows.length !== 1}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}

          {onDelete && (
            <Button variant="outline" onClick={() => onDelete(selectedRows[0])} disabled={selectedRows.length === 0}>
              <Trash className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          )}

          {printConfig && (
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          )}

          {exportConfig && (
            <Button variant="outline" onClick={handleExport}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
          )}

          {(onBack || backHref) && (
            backHref ? (
              <Link href={backHref}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            )
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {idField && onSelectAll && (
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectAll} 
                        onCheckedChange={onSelectAll} 
                        aria-label="Seleccionar todos" 
                      />
                    </TableHead>
                  )}
                  {table.getFlatHeaders().map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={idField ? columns.length + 1 : columns.length} className="text-center py-4">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={idField ? columns.length + 1 : columns.length} className="text-center py-4">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    const id = idField ? String((row.original as any)[idField]) : undefined
                    const isSelected = id && selectedRows?.includes(id)
                    
                    return (
                      <TableRow key={row.id} className={isSelected ? "bg-primary/10" : ""}>
                        {idField && setSelectedRows && (
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => {
                                if (id) {
                                  if (isSelected) {
                                    setSelectedRows(selectedRows.filter(itemId => itemId !== id))
                                  } else {
                                    setSelectedRows([...selectedRows, id])
                                  }
                                }
                              }}
                              aria-label={`Seleccionar fila ${id}`}
                            />
                          </TableCell>
                        )}
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
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
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
