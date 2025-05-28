"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Seguro {
  SEGURO: string
  NOMBRE: string
  ABREVIATURA: string
  ACTIVO: string
  DESCRIPCION: string
  TIPO_SEGURO: string
}

const defaultValues: Partial<Seguro> = {
  SEGURO: "",
  NOMBRE: "",
  ABREVIATURA: "",
  ACTIVO: "S",
  DESCRIPCION: "",
  TIPO_SEGURO: ""
}

export default function SegurosPage() {
  return (
    <DataProvider<Seguro>
      apiEndpoint="seguros"
      idField="SEGURO"
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
        const columns: ColumnDef<Seguro, unknown>[] = [
          {
            accessorKey: "SEGURO",
            header: "CÓDIGO"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          },
          {
            accessorKey: "ABREVIATURA",
            header: "ABREVIATURA"
          },
          {
            accessorKey: "ACTIVO",
            header: "ACTIVO"
          },
          {
            accessorKey: "TIPO_SEGURO",
            header: "TIPO"
          },
          {
            accessorKey: "DESCRIPCION",
            header: "DESCRIPCIÓN"
          }
        ]
        
        return (
          <>
            <DataTable<Seguro>
              title="Tabla de Seguros"
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
              idField="SEGURO"
              onEdit={undefined}
              onDelete={undefined}
              onNew={undefined}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Seguros",
                data: data,
                columns: [
                  { key: "SEGURO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "TIPO_SEGURO", header: "TIPO" },
                  { key: "DESCRIPCION", header: "DESCRIPCIÓN" }
                ]
              }}
              exportConfig={{
                filename: "seguros",
                data: data,
                columns: [
                  { key: "SEGURO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "TIPO_SEGURO", header: "TIPO" },
                  { key: "DESCRIPCION", header: "DESCRIPCIÓN" }
                ]
              }}
            />
            
            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Seguro" : "Nuevo Seguro"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "SEGURO", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { name: "ABREVIATURA", label: "Abreviatura", type: "text" },
                { name: "ACTIVO", label: "Activo", type: "select", options: [{value: "S", label: "Sí"}, {value: "N", label: "No"}], required: true },
                { name: "TIPO_SEGURO", label: "Tipo", type: "text", required: true },
                { name: "DESCRIPCION", label: "Descripción", type: "text" }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "seguro" : "seguros"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
