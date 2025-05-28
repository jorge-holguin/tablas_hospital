"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Personal {
  PERSONAL: string
  NOMBRE: string
  ACTIVO: boolean
  CARGO: string
  CONDICIONLABORAL: number
}

const defaultValues: Partial<Personal> = {
  PERSONAL: "",
  NOMBRE: "",
  ACTIVO: false,
  CARGO: "",
  CONDICIONLABORAL: 0
}

const columns: ColumnDef<Personal, unknown>[] = [
  {
    accessorKey: "PERSONAL",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO"
  },
  {
    accessorKey: "CARGO",
    header: "CARGO"
  },
  {
    accessorKey: "CONDICIONLABORAL",
    header: "CONDICIÓN LABORAL"
  },
]

export default function PersonalPage() {
  return (
    <DataProvider<Personal>
      apiEndpoint="personal"
      idField="PERSONAL"
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
        const columns: ColumnDef<Personal, unknown>[] = [
          {
            accessorKey: "PERSONAL",
            header: "CÓDIGO"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          },
          {
            accessorKey: "ACTIVO",
            header: "ACTIVO"
          },
          {
            accessorKey: "CARGO",
            header: "CARGO"
          },
          {
            accessorKey: "CONDICIONLABORAL",
            header: "CONDICIÓN LABORAL"
          }
        ]

        return (
          <>
            <DataTable<Personal>
              title="Tabla de Personal"
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
              idField="PERSONAL"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Personal",
                data: data,
                columns: [
                  { key: "PERSONAL", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "CARGO", header: "CARGO" },
                  { key: "CONDICIONLABORAL", header: "CONDICIÓN LABORAL" },
                ]
              }}
              exportConfig={{
                filename: "personal",
                data: data,
                columns: [
                  { key: "PERSONAL", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "CARGO", header: "CARGO" },
                  { key: "CONDICIONLABORAL", header: "CONDICIÓN LABORAL" },
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Personal" : "Nuevo Personal"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "PERSONAL", label: "Código", type: "text", required: true},
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { name: "ACTIVO", label: "Activo", type: "checkbox", required: true },
                { name: "CARGO", label: "CARGO", type: "text", required: true },
                { name: "CONDICIONLABORAL", label: "CONDICIÓN LABORAL", type: "text", required: true },
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "personal" : "personales"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}