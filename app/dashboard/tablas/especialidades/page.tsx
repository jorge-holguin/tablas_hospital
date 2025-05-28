"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

interface Especialidad {
  ESPECIALIDAD: string
  NOMBRE: string
  ACTIVO: number | string
  semprofesion?: string | null
}

const defaultValues: Partial<Especialidad> = {
  ESPECIALIDAD: "",
  NOMBRE: "",
  ACTIVO: 1,
  semprofesion: null
}

export default function EspecialidadesPage() {
  return (
    <DataProvider<Especialidad>
      apiEndpoint="especialidades"
      idField="ESPECIALIDAD"
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
        const columns: ColumnDef<Especialidad, unknown>[] = [
          {
            accessorKey: "ESPECIALIDAD",
            header: "Código"
          },
          {
            accessorKey: "NOMBRE",
            header: "Nombre"
          },
          {
            accessorKey: "ACTIVO",
            header: "Estado",
            cell: ({ row }) => {
              const activo = Number(row.getValue("ACTIVO"))
              return (
                <Badge variant={activo === 1 ? "default" : "secondary"} className={activo === 1 ? "bg-green-500 hover:bg-green-600" : ""}>
                  {activo === 1 ? "Activo" : "Inactivo"}
                </Badge>
              )
            }
          }
        ]

        return (
          <>
            <DataTable<Especialidad>
              title="Especialidades"
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
              idField="ESPECIALIDAD"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Especialidades",
                data: data,
                columns: [
                  { key: "ESPECIALIDAD", header: "Código" },
                  { key: "NOMBRE", header: "Nombre" },
                  { key: "ACTIVO", header: "Estado", format: (value) => Number(value) === 1 ? "Activo" : "Inactivo" }
                ]
              }}
              exportConfig={{
                filename: "especialidades",
                data: data,
                columns: [
                  { key: "ESPECIALIDAD", header: "Código" },
                  { key: "NOMBRE", header: "Nombre" },
                  { key: "ACTIVO", header: "Estado", format: (value) => Number(value) === 1 ? "Activo" : "Inactivo" }
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Especialidad" : "Nueva Especialidad"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "ESPECIALIDAD", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { name: "ACTIVO", label: "Activo", type: "checkbox", required: false, transform: { input: (value: any) => !!value && Number(value) === 1, output: (value: boolean) => value ? 1 : 0 } }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "especialidad" : "especialidades"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
