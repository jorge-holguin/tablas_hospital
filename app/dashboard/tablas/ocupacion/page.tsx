"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Ocupacion {
  OCUPACION: string
  NOMBRE: string
  ACTIVO: number
}

const defaultValues: Partial<Ocupacion> = {
  OCUPACION: "",
  NOMBRE: "",
  ACTIVO: 1
}

const columns: ColumnDef<Ocupacion, unknown>[] = [
  {
    accessorKey: "OCUPACION",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO"
  }
]

export default function OcupacionPage() {
  return (
    <DataProvider
      apiEndpoint="ocupacion"
      idField="OCUPACION"
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
      }) => (
        <>
          <DataTable
            title="Ocupaciones"
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
            idField="OCUPACION"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            onRefresh={handleRefresh}
            backHref="/dashboard/tablas"
            printConfig={{
              title: "Reporte de Ocupaciones",
              data: data,
              columns: [
                { key: "OCUPACION", header: "CÓDIGO" },
                { key: "NOMBRE", header: "NOMBRE" },
                { key: "ACTIVO", header: "ACTIVO" }
              ]
            }}
            exportConfig={{
              filename: "ocupaciones",
              data: data,
              columns: [
                { key: "OCUPACION", header: "CÓDIGO" },
                { key: "NOMBRE", header: "NOMBRE" },
                { key: "ACTIVO", header: "ACTIVO" }
              ]
            }}
          />
          <EditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSave={handleSaveItem}
            title={selectedItems.length === 1 ? "Editar Ocupación" : "Nueva Ocupación"}
            fields={[
              {
                name: "OCUPACION",
                label: "Código",
                type: "text",
                required: true
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
                type: "checkbox"
              }
            ]}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            onConfirm={confirmDelete}
            title="¿Está seguro de eliminar?"
            description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "ocupación" : "ocupaciones"}. Esta acción no se puede deshacer.`}
          />
        </>
      )}
    </DataProvider>
  )
}

