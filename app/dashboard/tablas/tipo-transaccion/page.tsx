"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { ColumnDef } from "@tanstack/react-table"

interface TipoTransaccion {
  TIPO_TRANSACCION: string
  NOMBRE: string
  ACTIVO: number
  TIPO_PAGO?: string
}

const defaultValues: Partial<TipoTransaccion> = {
  TIPO_TRANSACCION: "",
  NOMBRE: "",
  ACTIVO: 1,
  TIPO_PAGO: ""
}

export default function TipoTransaccionPage() {
  return (
    <DataProvider<TipoTransaccion>
      apiEndpoint="tipo-transaccion"
      idField="TIPO_TRANSACCION"
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
        const columns: ColumnDef<TipoTransaccion, unknown>[] = [
          {
            accessorKey: "TIPO_TRANSACCION",
            header: "Código"
          },
          {
            accessorKey: "NOMBRE",
            header: "Descripción"
          },
          {
            accessorKey: "TIPO_PAGO",
            header: "Tipo de Pago"
          },
          {
            accessorKey: "ACTIVO",
            header: "Activo",
            cell: ({ row }) => (
              <span>{row.getValue("ACTIVO") === 1 ? "Sí" : "No"}</span>
            )
          }
        ]

        return (
          <>
            <DataTable<TipoTransaccion>
              title="Tabla de Tipos de Transacción"
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
              idField="TIPO_TRANSACCION"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Tipos de Transacción",
                data: data,
                columns: [
                  { key: "TIPO_TRANSACCION", header: "Código" },
                  { key: "NOMBRE", header: "Descripción" },
                  { key: "TIPO_PAGO", header: "Tipo de Pago" },
                  { key: "ACTIVO", header: "Activo", format: (value) => value === 1 ? "Sí" : "No" }
                ]
              }}
              exportConfig={{
                filename: "tipos-transaccion",
                data: data,
                columns: [
                  { key: "TIPO_TRANSACCION", header: "Código" },
                  { key: "NOMBRE", header: "Descripción" },
                  { key: "TIPO_PAGO", header: "Tipo de Pago" },
                  { key: "ACTIVO", header: "Activo", format: (value) => value === 1 ? "Sí" : "No" }
                ]
              }}
            />
          </>
        )
      }}
    </DataProvider>
  )
}
