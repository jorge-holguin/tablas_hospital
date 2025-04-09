import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination, PaginationProps } from "@/components/ui/pagination"
import { ColumnDef, flexRender, useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw, Printer, FileSpreadsheet, Filter } from "lucide-react"

export interface DataTableProps<T> extends Pick<PaginationProps, 'pageCount' | 'pageSize' | 'pageIndex' | 'setPageIndex' | 'setPageSize'> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  loading?: boolean
  selectedRows?: string[]
  setSelectedRows?: (rows: string[]) => void
  selectAll?: boolean
  onSelectAll?: () => void
  idField?: string
  searchTerm?: string
  setSearchTerm?: (term: string) => void
  filterActive?: boolean
  setFilterActive?: (active: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onNew?: () => void
  onRefresh?: () => void
  onPrint?: () => void
  onExport?: () => void
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  pageCount,
  pageSize,
  pageIndex,
  setPageIndex,
  setPageSize,
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
  onPrint,
  onExport
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {onNew && (
              <Button variant="outline" size="sm" onClick={onNew}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo
              </Button>
            )}
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
            )}
            {onPrint && (
              <Button variant="outline" size="sm" onClick={onPrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {setSearchTerm && (
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            )}
            {setFilterActive && (
              <Button
                variant={filterActive ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterActive(!filterActive)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {filterActive ? "Activos" : "Todos"}
              </Button>
            )}
          </div>
        </div>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.column.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <Pagination
            pageCount={pageCount}
            pageSize={pageSize}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
          />
        </div>
      </CardContent>
    </Card>
  )
}
