"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useReadOnlyPermissions } from "@/hooks/useReadOnlyPermissions"

interface GrupoLiquidacion {
  GRUPO_LIQUIDACION: string
  NOMBRE: string
  ACTIVO: number
  ITEM?: string | null
  DESCUENTO?: string | null
}

const defaultValues: Partial<GrupoLiquidacion> = {
  GRUPO_LIQUIDACION: "",
  NOMBRE: "",
  ACTIVO: 1,
  ITEM: "",
  DESCUENTO: "1"
}

export default function GruposLiquidacionPage() {
  const { isReadOnly, canPerformAction } = useReadOnlyPermissions()
  return (
    <DataProvider<GrupoLiquidacion>
      apiEndpoint="grupo-liquidacion"
      idField="GRUPO_LIQUIDACION"
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
        const columns: ColumnDef<GrupoLiquidacion, unknown>[] = [
          {
            accessorKey: "GRUPO_LIQUIDACION",
            header: "ID"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
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
          },
          {
            accessorKey: "ITEM",
            header: "ITEM",
            cell: ({ row }) => {
              return row.original.ITEM || "-"
            }
          },
          {
            accessorKey: "DESCUENTO",
            header: "DESCUENTO",
            cell: ({ row }) => {
              const descuento = row.original.DESCUENTO
              return descuento === "1" ? "Sí" : "No"
            }
          }
        ]
        return (
          <>
            <DataTable<GrupoLiquidacion>
              title="Tabla de Grupos de Liquidación"
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
              idField="GRUPO_LIQUIDACION"
              onEdit={isReadOnly ? undefined : handleEdit}
              onDelete={isReadOnly ? undefined : handleDelete}
              onNew={isReadOnly ? undefined : handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Grupos de Liquidación",
                data: data,
                columns: [
                  { key: "GRUPO_LIQUIDACION", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { 
                    key: "ACTIVO", 
                    header: "ESTADO",
                    format: (value) => value === 1 ? "Activo" : "Inactivo"
                  },
                  { 
                    key: "ITEM", 
                    header: "ITEM",
                    format: (value) => value || "-"
                  },
                  { 
                    key: "DESCUENTO", 
                    header: "DESCUENTO",
                    format: (value) => value === "1" ? "Sí" : "No"
                  }
                ]
              }}
              exportConfig={{
                filename: "grupos-liquidacion",
                data: data,
                columns: [
                  { key: "GRUPO_LIQUIDACION", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ESTADO" },
                  { key: "ITEM", header: "ITEM" },
                  { key: "DESCUENTO", header: "DESCUENTO" }
                ]
              }}
            />

            <EditDialog
              title={selectedItems.length > 0 ? "Editar Grupo de Liquidación" : "Nuevo Grupo de Liquidación"}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onSave={handleSaveItem}
              fields={[
                {
                  name: "GRUPO_LIQUIDACION",
                  label: "ID",
                  type: "text",
                  required: true,
                  maxLength: 2,
                  disabled: selectedItems.length > 0,
                  description: "Máximo 2 caracteres"
                },
                {
                  name: "NOMBRE",
                  label: "Nombre",
                  type: "text",
                  required: true,
                  maxLength: 50
                },
                {
                  name: "ITEM",
                  label: "Item",
                  type: "text",
                  maxLength: 10,
                  placeholder: "Opcional"
                },
                {
                  name: "DESCUENTO",
                  label: "Descuento",
                  type: "select",
                  options: [
                    { value: "1", label: "Sí" },
                    { value: "0", label: "No" }
                  ]
                },
                {
                  name: "ACTIVO",
                  label: "Activo",
                  type: "checkbox"
                }
              ]}
            />

            <ConfirmDialog
              title="Eliminar Grupo de Liquidación"
              description="¿Está seguro de que desea eliminar este grupo de liquidación? Esta acción no se puede deshacer."
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
