"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useReadOnlyPermissions } from "@/hooks/useReadOnlyPermissions"

interface Turno {
  TURNO: string
  NOMBRE: string
  INICIO?: string | null
  FINAL?: string | null
  ACTIVO: number
}

const defaultValues: Partial<Turno> = {
  TURNO: "",
  NOMBRE: "",
  INICIO: "",
  FINAL: "",
  ACTIVO: 1
}

export default function TurnosPage() {
  const { isReadOnly, canPerformAction } = useReadOnlyPermissions()

  return (
    <DataProvider<Turno>
      apiEndpoint="turno"
      idField="TURNO"
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
        const columns: ColumnDef<Turno, unknown>[] = [
          {
            accessorKey: "TURNO",
            header: "ID"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          },
          {
            accessorKey: "INICIO",
            header: "HORA INICIO",
            cell: ({ row }) => {
              return row.original.INICIO || "-"
            }
          },
          {
            accessorKey: "FINAL",
            header: "HORA FIN",
            cell: ({ row }) => {
              return row.original.FINAL || "-"
            }
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
            <DataTable<Turno>
              title="Tabla de Turnos"
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
              idField="TURNO"
              onEdit={isReadOnly ? undefined : handleEdit}
              onDelete={isReadOnly ? undefined : handleDelete}
              onNew={isReadOnly ? undefined : handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Turnos",
                data: data,
                columns: [
                  { key: "TURNO", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { 
                    key: "INICIO", 
                    header: "HORA INICIO",
                    format: (value) => value || "-"
                  },
                  { 
                    key: "FINAL", 
                    header: "HORA FIN",
                    format: (value) => value || "-"
                  },
                  { 
                    key: "ACTIVO", 
                    header: "ESTADO",
                    format: (value) => value === 1 ? "Activo" : "Inactivo"
                  }
                ]
              }}
              exportConfig={{
                filename: "turnos",
                data: data,
                columns: [
                  { key: "TURNO", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "INICIO", header: "HORA INICIO" },
                  { key: "FINAL", header: "HORA FIN" },
                  { key: "ACTIVO", header: "ESTADO" }
                ]
              }}
            />

            <EditDialog
              title={selectedItems.length > 0 ? "Editar Turno" : "Nuevo Turno"}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onSave={handleSaveItem}
              fields={[
                {
                  name: "TURNO",
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
                  maxLength: 30
                },
                {
                  name: "INICIO",
                  label: "Hora Inicio",
                  type: "text",
                  maxLength: 5,
                  placeholder: "HH:MM",
                  description: "Formato 24 horas (ej: 08:00)"
                },
                {
                  name: "FINAL",
                  label: "Hora Fin",
                  type: "text",
                  maxLength: 5,
                  placeholder: "HH:MM",
                  description: "Formato 24 horas (ej: 14:00)"
                },
                {
                  name: "ACTIVO",
                  label: "Activo",
                  type: "checkbox"
                }
              ]}
            />

            <ConfirmDialog
              title="Eliminar Turno"
              description="¿Está seguro de que desea eliminar este turno? Esta acción no se puede deshacer."
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
