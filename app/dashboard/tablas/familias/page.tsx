"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Familia {
  FAMILIA: string
  NOMBRE: string
  ACTIVO: string | number 
}

const defaultValues: Partial<Familia> = {
  FAMILIA: "",
  NOMBRE: "",
  ACTIVO: 1
}

const columns: ColumnDef<Familia, unknown>[] = [
  {
    accessorKey: "FAMILIA",
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

export default function FamiliasPage() {
  return (
    <DataProvider<Familia>
      apiEndpoint="familias"
      idField="FAMILIA"
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
        }) => { const columns: ColumnDef<Familia >[] = [
                  {
                    accessorKey: "FAMILIA",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "NOMBRE"
                  },
                  {
                    accessorKey: "ACTIVO",
                    header: "ACTIVO",
                    cell: ({ row }) => Number(row.original.ACTIVO) === 1 ? "Sí" : "No"
                  }
                ]
                return (
                          <>
                            <DataTable<Familia>
                              title="Tabla de Familias"
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
                              idField="FAMILIA"
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onNew={handleNew}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Familias",
                                data: data,
                                columns: [
                                  { key: "FAMILIA", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" }
                                ]
                              }}
                              exportConfig={{
                                filename: "familias",
                                data: data,
                                columns: [
                                  { key: "FAMILIA", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" }
                                ]
                              }}
                            />
              <EditDialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            title={selectedItems.length === 1 ? "Editar Familia" : "Nuevo Familia"}
                            defaultValues={defaultValues}
                            selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
                            onSave={handleSaveItem}
                            fields={[
                              { name: "FAMILIA", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                              { name: "NOMBRE", label: "Nombre", type: "text", required: true },
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
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "familia" : "familias"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
