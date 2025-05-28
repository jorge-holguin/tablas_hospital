"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Ubigeo {
  UBIGEO: string
  DISTRITO: string
  PROVINCIA: string
  DEPARTAMENTO: string
  ACTIVO: string
  AUXILIAR: string
  UBIGEORENIEC: string
}

const defaultValues: Partial<Ubigeo> = {
  UBIGEO: "",
  DISTRITO: "",
  PROVINCIA: "",
  DEPARTAMENTO: "",
  ACTIVO: "1",
  AUXILIAR: "",
  UBIGEORENIEC: ""
}

export default function UbigeosPage() {
  return (
    <DataProvider<Ubigeo>
      apiEndpoint="ubigeos"
      idField="UBIGEO"
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
        const columns: ColumnDef<Ubigeo, unknown>[] = [
          {
            accessorKey: "UBIGEO",
            header: "CÓDIGO"
          },
          {
            accessorKey: "DISTRITO",
            header: "DISTRITO"
          },
          {
            accessorKey: "PROVINCIA",
            header: "PROVINCIA"
          },
          {
            accessorKey: "DEPARTAMENTO",
            header: "DEPARTAMENTO"
          },
          {
            accessorKey: "ACTIVO",
            header: "ACTIVO",
            cell: ({ row }) => (
              <span>{row.original.ACTIVO === "1" ? "Sí" : "No"}</span>
            )
          },
          {
            accessorKey: "UBIGEORENIEC",
            header: "CÓDIGO RENIEC"
          }
        ]
        
        return (
          <>
            <DataTable<Ubigeo>
              title="Tabla de Ubigeos"
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
              idField="UBIGEO"
              onEdit={undefined}
              onDelete={undefined}
              onNew={undefined}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Ubigeos",
                data: data,
                columns: [
                  { key: "UBIGEO", header: "CÓDIGO" },
                  { key: "DISTRITO", header: "DISTRITO" },
                  { key: "PROVINCIA", header: "PROVINCIA" },
                  { key: "DEPARTAMENTO", header: "DEPARTAMENTO" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "UBIGEORENIEC", header: "CÓDIGO RENIEC" }
                ]
              }}
              exportConfig={{
                filename: "ubigeos",
                data: data,
                columns: [
                  { key: "UBIGEO", header: "CÓDIGO" },
                  { key: "DISTRITO", header: "DISTRITO" },
                  { key: "PROVINCIA", header: "PROVINCIA" },
                  { key: "DEPARTAMENTO", header: "DEPARTAMENTO" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "UBIGEORENIEC", header: "CÓDIGO RENIEC" },
                  { key: "AUXILIAR", header: "AUXILIAR" }
                ]
              }}
            />
            
            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Ubigeo" : "Nuevo Ubigeo"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "UBIGEO", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1, maxLength: 7 },
                { name: "DISTRITO", label: "Distrito", type: "text", required: true, maxLength: 50 },
                { name: "PROVINCIA", label: "Provincia", type: "text", required: true, maxLength: 50 },
                { name: "DEPARTAMENTO", label: "Departamento", type: "text", required: true, maxLength: 50 },
                { name: "ACTIVO", label: "Activo", type: "select", options: [{value: "1", label: "Sí"}, {value: "0", label: "No"}], required: true },
                { name: "UBIGEORENIEC", label: "Código RENIEC", type: "text", maxLength: 6 },
                { name: "AUXILIAR", label: "Auxiliar", type: "text", maxLength: 30 }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "ubigeo" : "ubigeos"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
