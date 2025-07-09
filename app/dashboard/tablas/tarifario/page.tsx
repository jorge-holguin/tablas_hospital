"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { ColumnDef } from "@tanstack/react-table"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"

// Definición de la interfaz para el Tarifario
interface Tarifario {
  ITEM: string
  NOMBRE: string
  CPMS: string
  PRECIOA: number
  PRECIOB: number
  PRECIOC: number
  PRECIOD: number
  PRECIOE: number
  PRECIOF: number
  PRECIOG: number
  PRECIOH: number
  PRECIOK: number
}

const defaultValues: Partial<Tarifario> = {
  ITEM: "",
  NOMBRE: "",
  CPMS: "",
  PRECIOA: 0,
  PRECIOB: 0,
  PRECIOC: 0,
  PRECIOD: 0,
  PRECIOE: 0,
  PRECIOF: 0,
  PRECIOG: 0,
  PRECIOH: 0,
  PRECIOK: 0
}

// Función para formatear precios
const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "0.00"
  return price.toFixed(2)
}

export default function TarifarioPage() {
  return (
    <DataProvider<Tarifario>
      apiEndpoint="tarifario"
      idField="ITEM"
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
        const columns: ColumnDef<Tarifario, unknown>[] = [
          {
            accessorKey: "ITEM",
            header: "Código"
          },
          {
            accessorKey: "NOMBRE",
            header: "Descripción",
            cell: ({ row }) => {
              const nombre = row.getValue("NOMBRE") as string
              return (
                <div className="max-w-[300px] truncate" title={nombre}>
                  {nombre}
                </div>
              )
            }
          },
          {
            accessorKey: "CPMS",
            header: "CPMS",
            cell: ({ row }) => {
              const cpms = row.getValue("CPMS") as string
              return cpms || "-"
            }
          },
          {
            accessorKey: "PRECIOA",
            header: "Pagante",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOA") as number
              return `S/ ${formatPrice(precio)}`
            }
          },
          {
            accessorKey: "PRECIOB",
            header: "30% Desc.",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOB") as number
              return `S/ ${formatPrice(precio)}`
            }
          },
          {
            accessorKey: "PRECIOC",
            header: "50% Desc.",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOC") as number
              return `S/ ${formatPrice(precio)}`
            }
          },
          {
            accessorKey: "PRECIOD",
            header: "100% Desc.",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOD") as number
              return `S/ ${formatPrice(precio)}`
            }
          },
          {
            accessorKey: "PRECIOE",
            header: "SIS",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOE") as number
              return `S/ ${formatPrice(precio)}`
            }
          },
          {
            accessorKey: "PRECIOF",
            header: "Precio F",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOF") as number
              return `S/ ${formatPrice(precio)}`
            }
          },
          {
            accessorKey: "PRECIOG",
            header: "Precio G",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOG") as number
              return `S/ ${formatPrice(precio)}`
            }
          },
          {
            accessorKey: "PRECIOH",
            header: "SOAT",
            cell: ({ row }) => {
              const precio = row.getValue("PRECIOH") as number
              return `S/ ${formatPrice(precio)}`
            }
          }
        ]

        return (
          <>
            <DataTable<Tarifario>
              title="Tarifario de Servicios"
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
              idField="ITEM"
              onEdit={undefined}
              onDelete={undefined}
              onNew={undefined}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Tarifario",
                data: data,
                columns: [
                  { key: "ITEM", header: "Código" },
                  { key: "NOMBRE", header: "Descripción" },
                  { key: "CPMS", header: "CPMS" },
                  { key: "PRECIOA", header: "Pagante", format: (value) => `S/ ${formatPrice(value as number)}` },
                  { key: "PRECIOB", header: "30% Desc.", format: (value) => `S/ ${formatPrice(value as number)}` },
                  { key: "PRECIOC", header: "50% Desc.", format: (value) => `S/ ${formatPrice(value as number)}` },
                  { key: "PRECIOD", header: "100% Desc.", format: (value) => `S/ ${formatPrice(value as number)}` },
                  { key: "PRECIOE", header: "SIS", format: (value) => `S/ ${formatPrice(value as number)}` },
                  { key: "PRECIOF", header: "Precio F", format: (value) => `S/ ${formatPrice(value as number)}` },
                  { key: "PRECIOG", header: "Precio G", format: (value) => `S/ ${formatPrice(value as number)}` },
                  { key: "PRECIOH", header: "SOAT", format: (value) => `S/ ${formatPrice(value as number)}` }
                ]
              }}
              exportConfig={{
                filename: "tarifario",
                data: data,
                columns: [
                  { key: "ITEM", header: "Código" },
                  { key: "NOMBRE", header: "Descripción" },
                  { key: "CPMS", header: "CPMS" },
                  { key: "PRECIOA", header: "Pagante", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOB", header: "30% Desc.", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOC", header: "50% Desc.", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOD", header: "100% Desc.", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOE", header: "SIS", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOF", header: "Precio F", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOG", header: "Precio G", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOH", header: "SOAT", format: (value) => formatPrice(value as number) },
                  { key: "PRECIOK", header: "Precio K", format: (value) => formatPrice(value as number) }
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Tarifario" : "Nuevo Tarifario"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "ITEM", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Descripción", type: "text", required: true },
                { name: "CPMS", label: "CPMS", type: "text" },
                { name: "PRECIOA", label: "Pagante", type: "number" },
                { name: "PRECIOB", label: "30% Descuento", type: "number" },
                { name: "PRECIOC", label: "50% Descuento", type: "number" },
                { name: "PRECIOD", label: "100% Descuento", type: "number" },
                { name: "PRECIOE", label: "SIS", type: "number" },
                { name: "PRECIOF", label: "Precio F", type: "number" },
                { name: "PRECIOG", label: "Precio G", type: "number" },
                { name: "PRECIOH", label: "SOAT", type: "number" },
                { name: "PRECIOK", label: "Precio K", type: "number" }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "ítem" : "ítems"} del tarifario. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
