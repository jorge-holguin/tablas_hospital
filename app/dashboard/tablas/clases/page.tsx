"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Clase {
  CLASE: string
  NOMBRE: string
  ACTIVO: number
  CLASIFICADOR: string
}

const defaultValues: Partial<Clase> = {
  CLASE: "",
  NOMBRE: "",
  ACTIVO: 1,
  CLASIFICADOR: ""
}

export default function ClasesPage() {
  return (
    <DataProvider<Clase>
      apiEndpoint="clases"
      idField="CLASE"
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
        const columns: ColumnDef<Clase>[] = [
          {
            accessorKey: "CLASE",
            header: "CLASE"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          },
          {
            accessorKey: "ACTIVO",
            header: "ACTIVO",
            cell: ({ row }) => Number(row.original.ACTIVO) === 1 ? "Sí" : "No"
          },
          {
            accessorKey: "CLASIFICADOR",
            header: "CLASIFICADOR"
          }
        ]

        return (
          <>
            <DataTable<Clase>
              title="Tabla de Clases"
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
              idField="CLASE"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Clases",
                data: data,
                columns: [
                  { key: "CLASE", header: "CLASE" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" },
                  { key: "CLASIFICADOR", header: "CLASIFICADOR" }
                ]
              }}
              exportConfig={{
                filename: "clases",
                data: data,
                columns: [
                  { key: "CLASE", header: "CLASE" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" },
                  { key: "CLASIFICADOR", header: "CLASIFICADOR" } 
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Clase" : "Nueva Clase"}
              defaultValues={defaultValues}
              selectedItem={selectedItems[0] || null}
              data={data}
              onSave={handleSaveItem}
              fields={[
                { name: "CLASE", label: "Clase", type: "text", required: true },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { 
                  name: "ACTIVO", 
                  label: "Activo", 
                  type: "select",
                  options: [
                    { value: "1", label: "Sí" },
                    { value: "0", label: "No" }
                  ]
                },
                { 
                  name: "CLASIFICADOR", 
                  label: "Clasificador", 
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
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "clase" : "clases"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
