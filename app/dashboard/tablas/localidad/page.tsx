"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Localidad {
  Localidad: string
  Nombre: string
  Activo: number
  Ubigeo: string
}

const defaultValues: Partial<Localidad> = {
  Localidad: "",
  Nombre: "",
  Activo: 1,
  Ubigeo: ""
}

const columns: ColumnDef<Localidad, unknown>[] = [
  {
    accessorKey: "Localidad",
    header: "CÓDIGO"
  },
  {
    accessorKey: "Nombre",
    header: "LOCALIDAD"
  },
  {
    accessorKey: "Activo",
    header: "ACTIVO"
  },
  {
    accessorKey: "Ubigeo",
    header: "UBIGEO"
  }
]

export default function LocalidadPage() {
  return (
    <DataProvider<Localidad>
      apiEndpoint="localidades"
      idField="Localidad"
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
        }) => { const columns: ColumnDef<Localidad, unknown>[] = [
                  {
                    accessorKey: "Localidad",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "Nombre",
                    header: "LOCALIDAD"
                  },
                  {
                    accessorKey: "Activo",
                    header: "ACTIVO"
                  },
                  {
                    accessorKey: "Ubigeo",
                    header: "UBIGEO"
                  }
                ]
                return (
                          <>
                            <DataTable<Localidad>
                              title="Tabla de Localidades"
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
                              idField="Localidad"
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onNew={handleNew}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Localidades",
                                data: data,
                                columns: [
                                  { key: "Localidad", header: "CÓDIGO" },
                                  { key: "Nombre", header: "LOCALIDAD" },
                                  { key: "Activo", header: "ACTIVO" },
                                  { key: "Ubigeo", header: "UBIGEO" }
                                ]
                              }}
                              exportConfig={{
                                filename: "localidad",
                                data: data,
                                columns: [
                                  { key: "Localidad", header: "CÓDIGO" },
                                  { key: "Nombre", header: "LOCALIDAD" },
                                  { key: "Activo", header: "ACTIVO" },
                                  { key: "Ubigeo", header: "UBIGEO" }
                                ]
                              }}
                            />
              <EditDialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            title={selectedItems.length === 1 ? "Editar Localidad" : "Nueva Localidad"}
                            defaultValues={defaultValues}
                            selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
                            onSave={handleSaveItem}
                            fields={[
                              { name: "Localidad", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                              { name: "Nombre", label: "Localidad", type: "text", required: true },
                              { name: "Activo", label: "Activo", type: "number" },
                              { name: "Ubigeo", label: "Ubigeo", type: "text" }
                            ]}
                          />

              <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "localidad" : "localidades"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
