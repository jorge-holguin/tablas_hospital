"use client"
    
import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useReadOnlyPermissions } from "@/hooks/useReadOnlyPermissions"
    
interface GrupoRecaudacion {
  GRUPO_RECAUDACION: string
  NOMBRE: string
  ACTIVO: number
  GENERAORDEN: number
  CONTROLASTOCK: number
  CONTROLPACIENTE: number
}
    
const defaultValues: Partial<GrupoRecaudacion> = {
  GRUPO_RECAUDACION: "",
  NOMBRE: "",
  ACTIVO: 1,
  GENERAORDEN: 0,
  CONTROLASTOCK: 0,
  CONTROLPACIENTE: 0
}

export default function GruposRecaudacionPage() {
  const { isReadOnly, canPerformAction } = useReadOnlyPermissions()

  return (
    <DataProvider<GrupoRecaudacion>
      apiEndpoint="grupo-recaudacion"
      idField="GRUPO_RECAUDACION"
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
        const columns: ColumnDef<GrupoRecaudacion, unknown>[] = [
          {
            accessorKey: "GRUPO_RECAUDACION",
            header: "ID"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          },
          {
            accessorKey: "ACTIVO",
            header: "ESTADO",
            cell: ({ row }) => {
              const activo = row.original.ACTIVO
              return (
                <Badge variant={activo === 1 ? "default" : "destructive"}>
                  {activo === 1 ? "Activo" : "Inactivo"}
                </Badge>
              )
            }
          },
          {
            accessorKey: "GENERAORDEN",
            header: "GENERA ORDEN",
            cell: ({ row }) => {
              const generaOrden = row.original.GENERAORDEN
              return generaOrden === 1 ? "Sí" : "No"
            }
          },
          {
            accessorKey: "CONTROLASTOCK",
            header: "CONTROLA STOCK",
            cell: ({ row }) => {
              const controlaStock = row.original.CONTROLASTOCK
              return controlaStock === 1 ? "Sí" : "No"
            }
          },
          {
            accessorKey: "CONTROLPACIENTE",
            header: "CONTROL PACIENTE",
            cell: ({ row }) => {
              const controlPaciente = row.original.CONTROLPACIENTE
              return controlPaciente === 1 ? "Sí" : "No"
            }
          }
        ]

        return (
          <>
            <DataTable<GrupoRecaudacion>
              title="Tabla de Grupos de Recaudación"
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
              idField="GRUPO_RECAUDACION"
              onEdit={isReadOnly ? undefined : handleEdit}
              onDelete={isReadOnly ? undefined : handleDelete}
              onNew={isReadOnly ? undefined : handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Grupos de Recaudación",
                data: data,
                columns: [
                  { key: "GRUPO_RECAUDACION", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { 
                    key: "ACTIVO", 
                    header: "ESTADO",
                    format: (value) => value === 1 ? "Activo" : "Inactivo"
                  },
                  { 
                    key: "GENERAORDEN", 
                    header: "GENERA ORDEN",
                    format: (value) => value === 1 ? "Sí" : "No"
                  },
                  { 
                    key: "CONTROLASTOCK", 
                    header: "CONTROLA STOCK",
                    format: (value) => value === 1 ? "Sí" : "No"
                  },
                  { 
                    key: "CONTROLPACIENTE", 
                    header: "CONTROL PACIENTE",
                    format: (value) => value === 1 ? "Sí" : "No"
                  }
                ]
              }}
              exportConfig={{
                filename: "grupos-recaudacion",
                data: data,
                columns: [
                  { key: "GRUPO_RECAUDACION", header: "ID" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "ACTIVO", header: "ESTADO" },
                  { key: "GENERAORDEN", header: "GENERA ORDEN" },
                  { key: "CONTROLASTOCK", header: "CONTROLA STOCK" },
                  { key: "CONTROLPACIENTE", header: "CONTROL PACIENTE" }
                ]
              }}
            />

            <EditDialog
              title={selectedItems.length > 0 ? "Editar Grupo de Recaudación" : "Nuevo Grupo de Recaudación"}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onSave={handleSaveItem}
              fields={[
                {
                  name: "GRUPO_RECAUDACION",
                  label: "ID",
                  type: "text",
                  required: true,
                  maxLength: 2,
                  disabled: selectedItems.length > 0,
                  description: "Máximo 2 caracteres"
                },
                {
                  name: "NOMBRE",
                  label: "Nombre",
                  type: "text",
                  required: true,
                  maxLength: 50
                },
                {
                  name: "ACTIVO",
                  label: "Activo",
                  type: "checkbox"
                },
                {
                  name: "GENERAORDEN",
                  label: "Genera Orden",
                  type: "checkbox"
                },
                {
                  name: "CONTROLASTOCK",
                  label: "Controla Stock",
                  type: "checkbox"
                },
                {
                  name: "CONTROLPACIENTE",
                  label: "Control de Paciente",
                  type: "checkbox"
                }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              title="Confirmar eliminación"
              description="¿Está seguro de que desea eliminar este grupo de recaudación? Esta acción no se puede deshacer."
              onConfirm={confirmDelete}
            />
          </>
        )
      }}
    </DataProvider>
  )
}
