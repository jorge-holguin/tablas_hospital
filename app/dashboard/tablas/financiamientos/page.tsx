"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Financiamiento {
  FINANCIA: string
  NOMBRE: string
}

const defaultValues: Partial<Financiamiento> = {
  FINANCIA: "",
  NOMBRE: ""
}

export default function FinanciamientosPage() {
  return (
    <DataProvider<Financiamiento>
      apiEndpoint="financiamientos"
      idField="FINANCIA"
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
        const columns: ColumnDef<Financiamiento, unknown>[] = [
          {
            accessorKey: "FINANCIA",
            header: "CÓDIGO"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          }
        ]
        
        return (
          <>
            <DataTable<Financiamiento>
              title="Tabla de Financiamientos"
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
              idField="FINANCIA"
              onEdit={undefined}
              onDelete={undefined}
              onNew={undefined}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Financiamientos",
                data: data,
                columns: [
                  { key: "FINANCIA", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" }
                ]
              }}
              exportConfig={{
                filename: "financiamientos",
                data: data,
                columns: [
                  { key: "FINANCIA", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" }
                ]
              }}
            />
            
            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Financiamiento" : "Nuevo Financiamiento"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "FINANCIA", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1, maxLength: 2 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true, maxLength: 15 }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "financiamiento" : "financiamientos"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
