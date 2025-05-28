"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Religion {
  RELIGION: string
  NOMBRE: string
}

const defaultValues: Partial<Religion> = {
  RELIGION: "",
  NOMBRE: "",
}

const columns: ColumnDef<Religion, unknown>[] = [
  {
    accessorKey: "RELIGION",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  }
]

export default function ReligionPage() {
  return (
    <DataProvider
      apiEndpoint="religion"
      idField="RELIGION"
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
            title="Religiones"
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
            idField="RELIGION"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            onRefresh={handleRefresh}
            backHref="/dashboard/tablas"
            printConfig={{
              title: "Reporte de Religiones",
              data: data,
              columns: [
                { key: "RELIGION", header: "CÓDIGO" },
                { key: "NOMBRE", header: "NOMBRE" }
              ]
            }}
            exportConfig={{
              filename: "religiones",
              data: data,
              columns: [
                { key: "RELIGION", header: "CÓDIGO" },
                { key: "NOMBRE", header: "NOMBRE" }
              ]
            }}
          />
          <EditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSave={handleSaveItem}
            title={selectedItems.length === 1 ? "Editar Religión" : "Nueva Religión"}
            fields={[
              {
                name: "RELIGION",
                label: "Código",
                type: "text",
                required: true
              },
              {
                name: "NOMBRE",
                label: "Nombre",
                type: "text",
                required: true
              }
            ]}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            onConfirm={confirmDelete}
            title="¿Está seguro de eliminar?"
            description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "religión" : "religiones"}. Esta acción no se puede deshacer.`}
          />
        </>
      )}
    </DataProvider>
  )
}

