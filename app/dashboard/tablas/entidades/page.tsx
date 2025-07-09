"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react"

interface Entidad {
  ENTIDADSIS: string
  NOMBRE: string
  ESTADO: string
  COD_DISA: string
}

const defaultValues: Partial<Entidad> = {
  ENTIDADSIS: "",
  NOMBRE: "",
  ESTADO: "",
  COD_DISA: "",
}

const columns: ColumnDef<Entidad, unknown>[] = [
    {
        accessorKey: "ENTIDADSIS",
        header: "CÓDIGO"
      },
      {
        accessorKey: "NOMBRE",
        header: "ENTIDAD"
      },
      {
        accessorKey: "ESTADO",
        header: "ESTADO"
      },
      {
        accessorKey: "COD_DISA",
        header: "COD_DISA"
      }
]

export default function EntidadPage() {
  // Use client-side only rendering to avoid hydration errors
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <DataProvider<Entidad>
      apiEndpoint="entidades"
      idField="ENTIDADSIS"
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
        }) => { const columns: ColumnDef<Entidad, unknown>[] = [
                  {
                    accessorKey: "ENTIDADSIS",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "ENTIDAD"
                  },
                  {
                    accessorKey: "ESTADO",
                    header: "ESTADO"
                  },
                  {
                    accessorKey: "COD_DISA",
                    header: "COD_DISA"
                  }
                ]
                return (
                          <>
                            <DataTable<Entidad>
                              title="Tabla de Entidad"
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
                              idField="ENTIDADSIS"
                              onEdit={undefined}
                              onDelete={undefined}
                              onNew={undefined}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Entidad",
                                data: data,
                                columns: [
                                  { key: "ENTIDADSIS", header: "ENTIDADSIS" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "ESTADO", header: "ESTADO" },
                                  { key: "COD_DISA", header: "COD_DISA" }
                                ]
                              }}
                              exportConfig={{
                                filename: "Entidad",
                                data: data,
                                columns: [
                                    { key: "ENTIDADSIS", header: "ENTIDADSIS" },
                                    { key: "NOMBRE", header: "NOMBRE" },
                                    { key: "ESTADO", header: "ESTADO" },
                                    { key: "COD_DISA", header: "COD_DISA" }
                                  ]
                              }}
                            />
              <EditDialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            title={selectedItems.length === 1 ? "Editar Entidad" : "Nueva Entidad"}
                            defaultValues={defaultValues}
                            selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
                            onSave={handleSaveItem}
                            fields={[
                              { name: "ENTIDADSIS", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                              { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                              { name: "ESTADO", label: "Estado", type: "text" },
                              { name: "COD_DISA", label: "COD_DISA", type: "text" },
                            ]}
                          />

              <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "entidad" : "Entidad"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
