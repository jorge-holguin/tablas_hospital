"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { printData } from "@/components/utils/print-helper"
import { exportToCSV } from "@/components/utils/export-helper"
import { useToast } from "@/hooks/use-toast"

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

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tabla de Almacenes</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/tablas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      <DataProvider<Almacen>
        apiEndpoint="almacenes"
        idField="ALMACEN"
        defaultValues={defaultValues}
        onPrint={async (data) => {
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
        }}
        onExport={(data) => {
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
        }}
      >
        {({
          data,
          loading,
          totalItems,
          currentPage,
          setCurrentPage,
          pageSize,
          setPageSize,
          searchTerm,
          setSearchTerm,
          filterActive,
          setFilterActive,
          selectedItems,
          setSelectedItems,
          selectedItem,
          setSelectedItem,
          selectAll,
          setSelectAll,
          handleSelectAll,
          handleSelectItem,
          handleRefresh,
          handleNew,
          handleEdit,
          handleDelete,
          handleSaveItem,
          confirmDelete,
          editDialogOpen,
          setEditDialogOpen,
          confirmDialogOpen,
          setConfirmDialogOpen
        }) => (
          <>
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              pageCount={Math.ceil(totalItems / pageSize)}
              pageSize={pageSize}
              pageIndex={currentPage - 1}
              setPageIndex={(page) => setCurrentPage(page + 1)}
              setPageSize={setPageSize}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterActive={filterActive === "1"}
              setFilterActive={(active) => setFilterActive(active ? "1" : "0")}
              selectedRows={selectedItems}
              setSelectedRows={setSelectedItems}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              idField="ALMACEN"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItem ? "Editar Almacén" : "Nuevo Almacén"}
              defaultValues={defaultValues}
              selectedItem={selectedItem}
              data={data}
              onSave={handleSaveItem}
              fields={[
                {
                  name: "ALMACEN",
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
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              title="Eliminar Almacén"
              description="¿Está seguro que desea eliminar este almacén?"
              onConfirm={confirmDelete}
            />
          </>
        )}
      </DataProvider>
    </div>
  )
}
