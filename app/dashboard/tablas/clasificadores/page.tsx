"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useReadOnlyPermissions } from "@/hooks/useReadOnlyPermissions"

interface Clasificador {
  CLASIFICADOR: string
  NOMBRE: string
  CONTABLEC: string
  CONTABLEA: string
  ABREVIATURA: string
  ACTIVO: number
}

const defaultValues: Partial<Clasificador> = {
  CLASIFICADOR: "",
  NOMBRE: "",
  CONTABLEC: " ",
  CONTABLEA: " ",
  ABREVIATURA: " ",
  ACTIVO: 1
}

export default function ClasificadoresPage() {
  const { isReadOnly, canPerformAction } = useReadOnlyPermissions()

  return (
    <DataProvider<Clasificador>
      apiEndpoint="clasificador"
      idField="CLASIFICADOR"
      defaultValues={defaultValues}
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
      }) => {
        const columns: ColumnDef<Clasificador, unknown>[] = [
          {
            accessorKey: "CLASIFICADOR",
            header: "ID"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          },
          {
            accessorKey: "CONTABLEC",
            header: "CUENTA CONTABLE C"
          },
          {
            accessorKey: "CONTABLEA",
            header: "CUENTA CONTABLE A"
          },
          {
            accessorKey: "ABREVIATURA",
            header: "ABREVIATURA"
          },
          {
            accessorKey: "ACTIVO",
            header: "ESTADO",
            cell: ({ row }) => {
              const activo = row.original.ACTIVO
              return (
                <Badge variant={activo === 1 ? "default" : "destructive"}>
                  {activo === 1 ? "Activo" : "Inactivo"}
                </Badge>
              )
            }
          }
        ]

        return (
          <>
            <DataTable<Clasificador>
              title="Tabla de Clasificadores"
              columns={columns}
              data={data}
              loading={loading}
              totalItems={totalItems}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterActive={filterActive}
              setFilterActive={setFilterActive}
              selectedRows={selectedItems}
              setSelectedRows={setSelectedItems}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              idField="CLASIFICADOR"
              onEdit={isReadOnly ? undefined : handleEdit}
              onDelete={isReadOnly ? undefined : handleDelete}
              onNew={isReadOnly ? undefined : handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Clasificadores",
                data: data,
                columns: [
                  { key: "CLASIFICADOR", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "CONTABLEC", header: "CUENTA CONTABLE C" },
                  { key: "CONTABLEA", header: "CUENTA CONTABLE A" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { 
                    key: "ACTIVO", 
                    header: "ESTADO",
                    format: (value) => value === 1 ? "Activo" : "Inactivo"
                  }
                ]
              }}
              exportConfig={{
                filename: "clasificadores",
                data: data,
                columns: [
                  { key: "CLASIFICADOR", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "CONTABLEC", header: "CUENTA CONTABLE C" },
                  { key: "CONTABLEA", header: "CUENTA CONTABLE A" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { key: "ACTIVO", header: "ESTADO" }
                ]
              }}
            />

            <EditDialog
              title={selectedItems.length > 0 ? "Editar Clasificador" : "Nuevo Clasificador"}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onSave={handleSaveItem}
              fields={[
                {
                  name: "CLASIFICADOR",
                  label: "ID",
                  type: "text",
                  required: true,
                  maxLength: 12,
                  disabled: selectedItems.length > 0,
                  description: "Máximo 12 caracteres"
                },
                {
                  name: "NOMBRE",
                  label: "Nombre",
                  type: "text",
                  required: true,
                  maxLength: 50
                },
                {
                  name: "CONTABLEC",
                  label: "Cuenta Contable C",
                  type: "text",
                  maxLength: 10
                },
                {
                  name: "CONTABLEA",
                  label: "Cuenta Contable A",
                  type: "text",
                  maxLength: 10
                },
                {
                  name: "ABREVIATURA",
                  label: "Abreviatura",
                  type: "text",
                  maxLength: 10
                },
                {
                  name: "ACTIVO",
                  label: "Activo",
                  type: "checkbox"
                }
              ]}
            />

            <ConfirmDialog
              title="Eliminar Clasificador"
              description="¿Está seguro de que desea eliminar este clasificador? Esta acción no se puede deshacer."
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
            />
          </>
        )
      }}
    </DataProvider>
  )
}
