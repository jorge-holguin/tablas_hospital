"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
     
interface GradoInstruccion {
  COD_GRI: string
  NOMBRE: string
  ACTIVO: number
  RENIEC: string
  CDC: string
}

const defaultValues: Partial<GradoInstruccion> = {
  COD_GRI: "",
  NOMBRE: "",
  ACTIVO: 1,
  RENIEC: "",
  CDC: ""
}

const columns: ColumnDef<Etnia, unknown>[] = [
  {
    accessorKey: "COD_GRI",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "GRADO INSTRUCCIÓN"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO"
  },
  {
    accessorKey: "RENIEC",
    header: "RENIEC"
  },
  {
    accessorKey: "CDC",
    header: "CDC"
  }
]

export default function GradoInstruccionPage() {
  return (
    <DataProvider<GradoInstruccion>
      apiEndpoint="grado-instruccion"
      idField="COD_GRI"
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
                    accessorKey: "COD_GRI",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "GRADO INSTRUCCIÓN"
                  },
                  {
                    accessorKey: "ACTIVO",
                    header: "ACTIVO"
                  },
                  {
                    accessorKey: "RENIEC",
                    header: "RENIEC"
                  },
                  {
                    accessorKey: "CDC",
                    header: "CDC"
                  }
                ]
                return (
                          <>
                            <DataTable<Etnia>
                              title="Tabla de Grados de Instrucción"
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
                              idField="COD_GRI"
                              onEdit={undefined}
                              onDelete={undefined}
                              onNew={undefined}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Grados de Instrucción",
                                data: data,
                                columns: [
                                  { key: "COD_GRI", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "GRADO INSTRUCCIÓN" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "RENIEC", header: "RENIEC" },
                                  { key: "CDC", header: "CDC" }
                                ]
                              }}
                              exportConfig={{
                                filename: "grados-instruccion",
                                data: data,
                                columns: [
                                  { key: "COD_GRI", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "GRADO INSTRUCCIÓN" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "RENIEC", header: "RENIEC" },
                                  { key: "CDC", header: "CDC" }
                                ]
                              }}
                            />
              <EditDialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                            title={selectedItems.length === 1 ? "Editar Grado de Instrucción" : "Nuevo Grado de Instrucción"}
                            defaultValues={defaultValues}
                            selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
                            onSave={handleSaveItem}
                            fields={[
                              { name: "COD_GRI", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                              { name: "NOMBRE", label: "Grado de Instrucción", type: "text", required: true },
                              { name: "ACTIVO", label: "Activo", type: "number" },
                              { name: "RENIEC", label: "Reniec", type: "text" },
                              { name: "CDC", label: "Cdc", type: "text" }
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
