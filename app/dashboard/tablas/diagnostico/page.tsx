"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Diagnostico {
  Codigo: string
  Descripcion: string
  CodigoCIE9: string
  CodigoDeExportacion: string
  TipoDeAtencion: string
  Morbilidad: boolean
  Gestacion: boolean
  Restriccion: boolean
  Sexo: string
  TipoEdadMinima: string
  EdadMinima: number
  TipoEdadMaxima: string
  EdadMaxima: number
  Intrahospitalario: boolean
}

const defaultValues: Partial<Diagnostico> = {
  Codigo: "",
  Descripcion: "",
  CodigoCIE9: "",
  CodigoDeExportacion: "",
  TipoDeAtencion: "",
  Morbilidad: false,
  Gestacion: false,
  Restriccion: false,
  Sexo: "",
  TipoEdadMinima: "",
  EdadMinima: 0,
  TipoEdadMaxima: "",
  EdadMaxima: 0,
  Intrahospitalario: false
}

export default function DiagnosticoPage() {

  return (
    <DataProvider<Diagnostico>
      apiEndpoint="diagnosticos"
      idField="Codigo"
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
        const columns: ColumnDef<Diagnostico, unknown>[] = [
          {
            accessorKey: "Codigo",
            header: "Código"
          },
          {
            accessorKey: "Descripcion",
            header: "Descripción"
          },
          {
            accessorKey: "CodigoCIE9",
            header: "Código CIE9"
          },
          {
            accessorKey: "CodigoDeExportacion",
            header: "Código Exportación"
          },
          {
            accessorKey: "TipoDeAtencion",
            header: "Tipo de Atención"
          },
          {
            accessorKey: "Morbilidad",
            header: "Morbilidad",
            cell: ({ row }) => (
              <span>{row.getValue("Morbilidad") ? "Sí" : "No"}</span>
            )
          },
          {
            accessorKey: "Gestacion",
            header: "Gestación",
            cell: ({ row }) => (
              <span>{row.getValue("Gestacion") ? "Sí" : "No"}</span>
            )
          },
          {
            accessorKey: "Restriccion",
            header: "Restricción",
            cell: ({ row }) => (
              <span>{row.getValue("Restriccion") ? "Sí" : "No"}</span>
            )
          },
          {
            accessorKey: "Sexo",
            header: "Sexo"
          },
          {
            accessorKey: "EdadMinima",
            header: "Edad Mínima"
          },
          {
            accessorKey: "EdadMaxima",
            header: "Edad Máxima"
          },
          {
            accessorKey: "Intrahospitalario",
            header: "Intrahospitalario",
            cell: ({ row }) => (
              <span>{row.getValue("Intrahospitalario") ? "Sí" : "No"}</span>
            )
          }
        ]

        return (
          <>
            <DataTable<Diagnostico>
              title="Tabla de Diagnósticos"
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
              idField="Codigo"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Diagnósticos",
                data: data,
                columns: [
                  { key: "Codigo", header: "Código" },
                  { key: "Descripcion", header: "Descripción" },
                  { key: "CodigoCIE9", header: "Código CIE9" },
                  { key: "CodigoDeExportacion", header: "Código Exportación" },
                  { key: "TipoDeAtencion", header: "Tipo de Atención" },
                  { key: "Morbilidad", header: "Morbilidad", format: (value) => value ? "Sí" : "No" },
                  { key: "Gestacion", header: "Gestación", format: (value) => value ? "Sí" : "No" },
                  { key: "Restriccion", header: "Restricción", format: (value) => value ? "Sí" : "No" },
                  { key: "Sexo", header: "Sexo" },
                  { key: "EdadMinima", header: "Edad Mínima" },
                  { key: "EdadMaxima", header: "Edad Máxima" },
                  { key: "Intrahospitalario", header: "Intrahospitalario", format: (value) => value ? "Sí" : "No" }
                ]
              }}
              exportConfig={{
                filename: "diagnosticos",
                data: data,
                columns: [
                  { key: "Codigo", header: "Código" },
                  { key: "Descripcion", header: "Descripción" },
                  { key: "CodigoCIE9", header: "Código CIE9" },
                  { key: "CodigoDeExportacion", header: "Código Exportación" },
                  { key: "TipoDeAtencion", header: "Tipo de Atención" },
                  { key: "Morbilidad", header: "Morbilidad", format: (value) => value ? "Sí" : "No" },
                  { key: "Gestacion", header: "Gestación", format: (value) => value ? "Sí" : "No" },
                  { key: "Restriccion", header: "Restricción", format: (value) => value ? "Sí" : "No" },
                  { key: "Sexo", header: "Sexo" },
                  { key: "EdadMinima", header: "Edad Mínima" },
                  { key: "EdadMaxima", header: "Edad Máxima" },
                  { key: "Intrahospitalario", header: "Intrahospitalario", format: (value) => value ? "Sí" : "No" }
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Diagnóstico" : "Nuevo Diagnóstico"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "Codigo", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "Descripcion", label: "Descripción", type: "text", required: true },
                { name: "CodigoCIE9", label: "Código CIE9", type: "text", required: false },
                { name: "CodigoDeExportacion", label: "Código Exportación", type: "text", required: false },
                { name: "TipoDeAtencion", label: "Tipo de Atención", type: "text", required: false },
                { name: "Morbilidad", label: "Morbilidad", type: "checkbox", required: false },
                { name: "Gestacion", label: "Gestación", type: "checkbox", required: false },
                { name: "Restriccion", label: "Restricción", type: "checkbox", required: false },
                { name: "Sexo", label: "Sexo", type: "select", options: [
                  { value: "M", label: "Masculino" },
                  { value: "F", label: "Femenino" },
                  { value: "A", label: "Ambos" }
                ], required: false },
                { name: "TipoEdadMinima", label: "Tipo Edad Mínima", type: "select", options: [
                  { value: "D", label: "Días" },
                  { value: "M", label: "Meses" },
                  { value: "A", label: "Años" }
                ], required: false },
                { name: "EdadMinima", label: "Edad Mínima", type: "number", required: false },
                { name: "TipoEdadMaxima", label: "Tipo Edad Máxima", type: "select", options: [
                  { value: "D", label: "Días" },
                  { value: "M", label: "Meses" },
                  { value: "A", label: "Años" }
                ], required: false },
                { name: "EdadMaxima", label: "Edad Máxima", type: "number", required: false },
                { name: "Intrahospitalario", label: "Intrahospitalario", type: "checkbox", required: false }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "diagnóstico" : "diagnósticos"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
