"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface EstadoCivil {
  ESTADO_CIVIL: string
  NOMBRE: string
  ACTIVO: number
  RENIEC: string
}

const defaultValues: Partial<EstadoCivil> = {
  ESTADO_CIVIL: "",
  NOMBRE: "",
  ACTIVO: 1,
  RENIEC: ""
}

const columns: ColumnDef<EstadoCivil, unknown>[] = [
  {
    accessorKey: "ESTADO_CIVIL",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO"
  },
  {
    accessorKey: "RENIEC",
    header: "RENIEC"
  }
]

export default function EstadoCivilPage() {
  return (
    <DataProvider<EstadoCivil>
      apiEndpoint="estado-civil"
      idField="ESTADO_CIVIL"
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
        }) => { const columns: ColumnDef<EstadoCivil, unknown>[] = [
                  {
                    accessorKey: "ESTADO_CIVIL",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "ESTADO CIVIL"
                  },
                  {
                    accessorKey: "ACTIVO",
                    header: "ACTIVO"
                  },
                  {
                    accessorKey: "RENIEC",
                    header: "RENIEC"
                  }
                ]
                return (
                          <>
                            <DataTable<EstadoCivil>
                              title="Tabla de Estados Civiles"
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
                              idField="ESTADO_CIVIL"
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onNew={handleNew}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Estados Civiles",
                                data: data,
                                columns: [
                                  { key: "ESTADO_CIVIL", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "ESTADO CIVIL" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "RENIEC", header: "RENIEC" }
                                ]
                              }}
                              exportConfig={{
                                filename: "estados-civiles",
                                data: data,
                                columns: [
                                  { key: "ESTADO_CIVIL", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "ESTADO CIVIL" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "RENIEC", header: "RENIEC" }
                                ]
                              }}
                            />
              <EditDialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            title={selectedItems.length === 1 ? "Editar Estado Civil" : "Nuevo Estado Civil"}
                            defaultValues={defaultValues}
                            selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
                            onSave={handleSaveItem}
                            fields={[
                              { name: "ESTADO_CIVIL", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                              { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                              { name: "ACTIVO", label: "Activo", type: "number" },
                              { name: "RENIEC", label: "RENIEC", type: "text" }
                            ]}
                          />

              <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "estado civil" : "estados civiles"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
