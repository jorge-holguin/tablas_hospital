"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface EmpresaAseguradora {
  EMPRESASEGURO: string
  NOMBRE: string
  DIRECCION: string
  TELEFONO: string
  EMAIL: string
  REPRESENTANTE: string
  RUC: string
  ACTIVO: string
  TIPOSEGURO: string
}

const defaultValues: Partial<EmpresaAseguradora> = {
  EMPRESASEGURO: "",
  NOMBRE: "",
  DIRECCION: "",
  TELEFONO: "",
  EMAIL: "",
  REPRESENTANTE: "",
  RUC: "",
  ACTIVO: "1",
  TIPOSEGURO: ""
}

const columns: ColumnDef<EmpresaAseguradora, unknown>[] = [
  {
    accessorKey: "EMPRESASEGURO",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
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
    accessorKey: "EMAIL",
    header: "EMAIL"
  },
  {
    accessorKey: "REPRESENTANTE",
    header: "REPRESENTANTE"
  },
  {
    accessorKey: "RUC",
    header: "RUC"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO",
    cell: ({ row }) => (
      <span>{row.getValue("ACTIVO") === "1" ? "Sí" : "No"}</span>
    )
  },
  {
    accessorKey: "TIPOSEGURO",
    header: "TIPO SEGURO"
  }
]

export default function EmpresasAseguradorasPage() {
  return (
    <DataProvider<EmpresaAseguradora>
      apiEndpoint="empresas-aseguradoras"
      idField="EMPRESASEGURO"
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
        }) => { const columns: ColumnDef<EmpresaAseguradora, unknown>[] = [
                  {
                    accessorKey: "EMPRESASEGURO",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "NOMBRE"
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
                    accessorKey: "EMAIL",
                    header: "EMAIL"
                  },
                  {
                    accessorKey: "REPRESENTANTE",
                    header: "REPRESENTANTE"
                  },
                  {
                    accessorKey: "RUC",
                    header: "RUC"
                  },
                  {
                    accessorKey: "ACTIVO",
                    header: "ACTIVO",
                    cell: ({ row }) => row.getValue("ACTIVO") === "1" ? "Sí" : "No"
                  },
                  {
                    accessorKey: "TIPOSEGURO",
                    header: "TIPO SEGURO"
                  }
                ]
                return (
                          <>
                            <DataTable<EmpresaAseguradora>
                              title="Tabla de Empresas Aseguradoras"
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
                              idField="EMPRESASEGURO"
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onNew={handleNew}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Empresas Aseguradoras",
                                data: data,
                                columns: [
                                  { key: "EMPRESASEGURO", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "DIRECCION", header: "DIRECCIÓN" },
                                  { key: "TELEFONO", header: "TELÉFONO" },
                                  { key: "EMAIL", header: "EMAIL" },
                                  { key: "REPRESENTANTE", header: "REPRESENTANTE" },
                                  { key: "RUC", header: "RUC" },
                                  { key: "ACTIVO", header: "ACTIVO", format: (value) => value === "1" ? "Sí" : "No" },
                                  { key: "TIPOSEGURO", header: "TIPO SEGURO" }
                                ]
                              }}
                              exportConfig={{
                                filename: "empresas-aseguradoras",
                                data: data,
                                columns: [
                                  { key: "EMPRESASEGURO", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "DIRECCION", header: "DIRECCIÓN" },
                                  { key: "TELEFONO", header: "TELÉFONO" },
                                  { key: "EMAIL", header: "EMAIL" },
                                  { key: "REPRESENTANTE", header: "REPRESENTANTE" },
                                  { key: "RUC", header: "RUC" },
                                  { key: "ACTIVO", header: "ACTIVO", format: (value) => value === "1" ? "Sí" : "No" },
                                  { key: "TIPOSEGURO", header: "TIPO SEGURO" }
                                ]
                              }}
                            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Empresa Aseguradora" : "Nueva Empresa Aseguradora"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "EMPRESASEGURO", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { name: "DIRECCION", label: "Dirección", type: "text" },
                { name: "TELEFONO", label: "Teléfono", type: "text" },
                { name: "EMAIL", label: "Email", type: "text" },
                { name: "REPRESENTANTE", label: "Representante", type: "text" },
                { name: "RUC", label: "RUC", type: "text" },
                { name: "ACTIVO", label: "Activo", type: "select", options: [{ value: "1", label: "Sí" }, { value: "0", label: "No" }] },
                { name: "TIPOSEGURO", label: "Tipo Seguro", type: "text" }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "empresa aseguradora" : "empresas aseguradoras"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
