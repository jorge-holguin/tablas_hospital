"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Laboratorio {
  LABORATORIO: string
  NOMBRE: string
  RUC: string
  DIRECCION: string
  TELEFONO: string
  ACTIVO: number
}

const defaultValues: Partial<Laboratorio> = {
  LABORATORIO: "",
  NOMBRE: "",
  RUC: "",
  DIRECCION: "",
  TELEFONO: "",
  ACTIVO: 1
}

const columns: ColumnDef<Laboratorio, unknown>[] = [
  {
    accessorKey: "LABORATORIO",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "RUC",
    header: "RUC"
  },
  {
    accessorKey: "DIRECCION",
    header: "DIRECCIÓN"
  },
  {
    accessorKey: "TELEFONO",
    header: "TELÉFONO"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO",
    cell: ({ row }) => (
      <span>{Number(row.getValue("ACTIVO")) === 1 ? "Sí" : "No"}</span>
    )
  }
]

export default function LaboratoriosPage() {
  return (
    <DataProvider<Laboratorio>
      apiEndpoint="laboratorios"
      idField="LABORATORIO"
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
        }) => { const columns: ColumnDef<Laboratorio, unknown>[] = [
                  {
                    accessorKey: "LABORATORIO",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "NOMBRE"
                  },
                  {
                    accessorKey: "RUC",
                    header: "RUC"
                  },
                  {
                    accessorKey: "DIRECCION",
                    header: "DIRECCIÓN"
                  },
                  {
                    accessorKey: "TELEFONO",
                    header: "TELÉFONO"
                  },
                  {
                    accessorKey: "ACTIVO",
                    header: "ACTIVO",
                    cell: ({ row }) => Number(row.original.ACTIVO) === 1 ? "Sí" : "No"
                  }
                ]
                return (
                          <>
                            <DataTable<Laboratorio>
                              title="Tabla de Laboratorios"
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
                              idField="LABORATORIO"
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onNew={handleNew}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Laboratorios",
                                data: data,
                                columns: [
                                  { key: "LABORATORIO", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "RUC", header: "RUC" },
                                  { key: "DIRECCION", header: "DIRECCIÓN" },
                                  { key: "TELEFONO", header: "TELÉFONO" },
                                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" }
                                ]
                              }}
                              exportConfig={{
                                filename: "laboratorios",
                                data: data,
                                columns: [
                                  { key: "LABORATORIO", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "RUC", header: "RUC" },
                                  { key: "DIRECCION", header: "DIRECCIÓN" },
                                  { key: "TELEFONO", header: "TELÉFONO" },
                                  { key: "ACTIVO", header: "ACTIVO", format: (value) => Number(value) === 1 ? "Sí" : "No" }
                                ]
                              }}
                            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Laboratorio" : "Nuevo Laboratorio"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "LABORATORIO", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { 
                  name: "RUC", 
                  label: "RUC", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "DIRECCION", 
                  label: "Dirección", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "TELEFONO", 
                  label: "Teléfono", 
                  type: "text", 
                  required: true 
                },
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
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "almacén" : "almacenes"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
