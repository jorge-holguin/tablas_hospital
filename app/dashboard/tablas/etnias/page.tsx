"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Etnia {
  COD_ETNIA: string
  ET_PUE_IND: string
  OTR_DENOMINADOR: string
  LENGUA: string
  REGION: string
}

const defaultValues: Partial<Etnia> = {
  COD_ETNIA: "",
  ET_PUE_IND: "",
  OTR_DENOMINADOR: "",
  LENGUA: "",
  REGION: ""
}

const columns: ColumnDef<Etnia, unknown>[] = [
  {
    accessorKey: "COD_ETNIA",
    header: "CÓDIGO"
  },
  {
    accessorKey: "ET_PUE_IND",
    header: "ETNIA"
  },
  {
    accessorKey: "OTR_DENOMINADOR",
    header: "OTRO DENOMINADOR"
  },
  {
    accessorKey: "LENGUA",
    header: "LENGUA"
  },
  {
    accessorKey: "REGION",
    header: "REGIÓN"
  }
]

export default function EtniasPage() {
  return (
    <DataProvider<Etnia>
      apiEndpoint="etnias"
      idField="COD_ETNIA"
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
        }) => { const columns: ColumnDef<Etnia, unknown>[] = [
                  {
                    accessorKey: "COD_ETNIA",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "ET_PUE_IND",
                    header: "ETNIA"
                  },
                  {
                    accessorKey: "OTR_DENOMINADOR",
                    header: "OTRO DENOMINADOR"
                  },
                  {
                    accessorKey: "LENGUA",
                    header: "LENGUA"
                  },
                  {
                    accessorKey: "REGION",
                    header: "REGIÓN"
                  }
                ]
                return (
                          <>
                            <DataTable<Etnia>
                              title="Tabla de Etnias"
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
                              idField="COD_ETNIA"
                              onEdit={undefined}
                              onDelete={undefined}
                              onNew={undefined}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Etnias",
                                data: data,
                                columns: [
                                  { key: "ETNIA", header: "CÓDIGO" },
                                  { key: "ET_PUE_IND", header: "ETNIA" },
                                  { key: "OTR_DENOMINADOR", header: "OTRO DENOMINADOR" },
                                  { key: "LENGUA", header: "LENGUA" },
                                  { key: "REGION", header: "REGIÓN" }
                                ]
                              }}
                              exportConfig={{
                                filename: "etnias",
                                data: data,
                                columns: [
                                  { key: "ETNIA", header: "CÓDIGO" },
                                  { key: "ET_PUE_IND", header: "ETNIA" },
                                  { key: "OTR_DENOMINADOR", header: "OTRO DENOMINADOR" },
                                  { key: "LENGUA", header: "LENGUA" },
                                  { key: "REGION", header: "REGIÓN" }
                                ]
                              }}
                            />
              <EditDialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            title={selectedItems.length === 1 ? "Editar Etnia" : "Nueva Etnia"}
                            defaultValues={defaultValues}
                            selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
                            onSave={handleSaveItem}
                            fields={[
                              { name: "COD_ETNIA", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                              { name: "ET_PUE_IND", label: "Etnia", type: "text", required: true },
                              { name: "OTR_DENOMINADOR", label: "Otro Denominador", type: "text" },
                              { name: "LENGUA", label: "Lengua", type: "text" },
                              { name: "REGION", label: "Región", type: "text" }
                            ]}
                          />

              <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "etnia" : "etnias"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
