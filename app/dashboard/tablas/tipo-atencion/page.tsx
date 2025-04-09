"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface TipoAtencion {
  TIPO_ATENCION: string
  NOMBRE: string
  ACTIVO: number
}

const defaultValues: Partial<TipoAtencion> = {
  TIPO_ATENCION: "",
  NOMBRE: "",
  ACTIVO: 1
}

export default function TipoAtencionPage() {
  return (
    <DataProvider<TipoAtencion>
      apiEndpoint="tipo-atencion"
      idField="TIPO_ATENCION"
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
        const columns: ColumnDef<TipoAtencion>[] = [
          {
            accessorKey: "TIPO_ATENCION",
            header: "TIPO ATENCIÓN"
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
            <DataTable<TipoAtencion>
              title="Tabla de Tipos de Atención"
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
              idField="TIPO_ATENCION"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Tipos de Atención",
                data: data,
                columns: [
                  { key: "TIPO_ATENCION", header: "TIPO ATENCIÓN" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" }
                ]
              }}
              exportConfig={{
                filename: "tipos-atencion",
                data: data,
                columns: [
                  { key: "TIPO_ATENCION", header: "TIPO ATENCIÓN" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" }
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Tipo de Atención" : "Nuevo Tipo de Atención"}
              defaultValues={defaultValues}
              selectedItem={selectedItems[0] || null}
              data={data}
              onSave={handleSaveItem}
              fields={[
                { name: "TIPO_ATENCION", label: "Tipo Atención", type: "text", required: true },
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
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "tipo de atención" : "tipos de atención"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
