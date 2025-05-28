"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface TipoDocumento {
  TIPO_DOCUMENTO: string
  NOMBRE: string
  ABREVIATURA: string
  ACTIVO: string
  DESCRIPCION: string
  LONGITUD: string
}

const defaultValues: Partial<TipoDocumento> = {
  TIPO_DOCUMENTO: "",
  NOMBRE: "",
  ABREVIATURA: "",
  ACTIVO: "S",
  DESCRIPCION: "",
  LONGITUD: ""
}

export default function TiposDocumentoPage() {
  return (
    <DataProvider<TipoDocumento>
      apiEndpoint="tipos-documento"
      idField="TIPO_DOCUMENTO"
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
        const columns: ColumnDef<TipoDocumento, unknown>[] = [
          {
            accessorKey: "TIPO_DOCUMENTO",
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
            accessorKey: "DESCRIPCION",
            header: "DESCRIPCIÓN"
          },
          {
            accessorKey: "LONGITUD",
            header: "LONGITUD"
          }
        ]
        
        return (
          <>
            <DataTable<TipoDocumento>
              title="Tabla de Tipos de Documento"
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
              idField="TIPO_DOCUMENTO"
              onEdit={undefined}
              onDelete={undefined}
              onNew={undefined}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Tipos de Documento",
                data: data,
                columns: [
                  { key: "TIPO_DOCUMENTO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "DESCRIPCION", header: "DESCRIPCIÓN" },
                  { key: "LONGITUD", header: "LONGITUD" }
                ]
              }}
              exportConfig={{
                filename: "tipos-documento",
                data: data,
                columns: [
                  { key: "TIPO_DOCUMENTO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { key: "ACTIVO", header: "ACTIVO" },
                  { key: "DESCRIPCION", header: "DESCRIPCIÓN" },
                  { key: "LONGITUD", header: "LONGITUD" }
                ]
              }}
            />
            
            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Tipo de Documento" : "Nuevo Tipo de Documento"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "TIPO_DOCUMENTO", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { name: "ABREVIATURA", label: "Abreviatura", type: "text" },
                { name: "ACTIVO", label: "Activo", type: "select", options: [{value: "S", label: "Sí"}, {value: "N", label: "No"}], required: true },
                { name: "DESCRIPCION", label: "Descripción", type: "text" },
                { name: "LONGITUD", label: "Longitud", type: "number" }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "tipo de documento" : "tipos de documento"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
