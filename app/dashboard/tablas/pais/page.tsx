"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Pais {
  PAIS: string
  NOMBRE: string
  ACTIVO: number
  CODIGO: string
  CDC: string
}

const defaultValues: Partial<Pais> = {
  PAIS: "",
  NOMBRE: "",
  ACTIVO: 1,
  CODIGO: "",
  CDC: ""
}

const columns: ColumnDef<Pais, unknown>[] = [
  {
    accessorKey: "PAIS",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "PAIS"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO"
  },
  {
    accessorKey: "CODIGO",
    header: "CODIGO"
  },
  {
    accessorKey: "CDC",
    header: "CDC"
  }
]

export default function PaisPage() {
  return (
    <DataProvider<Pais>
      apiEndpoint="paises"
      idField="PAIS"
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
        }) => { const columns: ColumnDef<Pais, unknown>[] = [
                  {
                    accessorKey: "PAIS",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "PAIS"
                  },
                  {
                    accessorKey: "ACTIVO",
                    header: "ACTIVO"
                  },
                  {
                    accessorKey: "CODIGO",
                    header: "CODIGO"
                  },
                  {
                    accessorKey: "CDC",
                    header: "CDC"
                  }
                ]
                return (
                          <>
                            <DataTable<Pais>
                              title="Tabla de Paises"
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
                              idField="PAIS"
                              onEdit={undefined}
                              onDelete={undefined}
                              onNew={undefined}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Paises",
                                data: data,
                                columns: [
                                  { key: "PAIS", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "PAIS" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "CODIGO", header: "CODIGO" },
                                  { key: "CDC", header: "CDC" }
                                ]
                              }}
                              exportConfig={{
                                filename: "pais",
                                data: data,
                                columns: [
                                  { key: "PAIS", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "PAIS" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "CODIGO", header: "CODIGO" },
                                  { key: "CDC", header: "CDC" }
                                ]
                              }}
                            />
              <EditDialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            title={selectedItems.length === 1 ? "Editar Pais" : "Nuevo Pais"}
                            defaultValues={defaultValues}
                            selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
                            onSave={handleSaveItem}
                            fields={[
                              { name: "PAIS", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                              { name: "NOMBRE", label: "Pais", type: "text", required: true },
                              { name: "ACTIVO", label: "Activo", type: "number" },
                              { name: "CODIGO", label: "Codigo", type: "text" },
                              { name: "CDC", label: "CDC", type: "text" }
                            ]}
                          />

              <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "pais" : "paises"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
