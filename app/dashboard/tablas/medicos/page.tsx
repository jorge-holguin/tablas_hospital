"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"

interface Medico {
  MEDICO: string
  NOMBRE: string
  COLEGIO: string
  PROFESION: string
  ESPECIALIDAD: string
  CARGO: string
  ABREVIATURA: string
  CONSULTORIO: string
  ACTIVO: string
  OLD: string
  COLESP: string
  DNI: string
  HIS_COD_MED: string | null
  CODHIS: string | null
  EESS: string
  CONTRATO: string
  IMPCITA: string
  FLAT_FECHA: boolean
  ID_MEDICO: number
  firma: string
  tiene_firma: string
  CODPROFESION: string | null
  FECHNAC: string | null
  APATERNO: string
  AMATERNO: string
  NOMBRES: string
  PAIS: string
  TIPO_DOCUMENTO: string
  REG_FECHA_CREACION: string | null
  REG_USUARIO_CREACION: string | null
}

const defaultValues: Partial<Medico> = {
  MEDICO: "",
  NOMBRE: "",
  COLEGIO: "",
  PROFESION: "",
  ESPECIALIDAD: "",
  CARGO: "",
  ABREVIATURA: "",
  CONSULTORIO: "",
  ACTIVO: "1",
  OLD: "",
  COLESP: "",
  DNI: "",
  HIS_COD_MED: null,
  CODHIS: null,
  EESS: "",
  CONTRATO: "",
  IMPCITA: "",
  FLAT_FECHA: false,
  ID_MEDICO: 0,
  firma: "",
  tiene_firma: "",
  CODPROFESION: null,
  FECHNAC: null,
  APATERNO: "",
  AMATERNO: "",
  NOMBRES: "",
  PAIS: "",
  TIPO_DOCUMENTO: "",
  REG_FECHA_CREACION: null,
  REG_USUARIO_CREACION: null
}

const columns: ColumnDef<Medico, unknown>[] = [
  {
    accessorKey: "MEDICO",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "COLEGIO",
    header: "COLEGIADO"
  },
  {
    accessorKey: "PROFESION",
    header: "PROFESIÓN"
  },
  {
    accessorKey: "ESPECIALIDAD",
    header: "ESPECIALIDAD"
  },
  {
    accessorKey: "CARGO",
    header: "CARGO"
  },
  {
    accessorKey: "ABREVIATURA",
    header: "ABREVIATURA"
  },
  {
    accessorKey: "CONSULTORIO",
    header: "CONSULTORIO"
  },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO",
    cell: ({ row }) => (
      <span>{row.getValue("ACTIVO") === "1" ? "Sí" : "No"}</span>
    )
  },
  {
    accessorKey: "OLD",
    header: "OLD"
  },
  {
    accessorKey: "COLESP",
    header: "COLES"
  },
  {
    accessorKey: "DNI",
    header: "DNI"
  },
  {
    accessorKey: "HIS_COD_MED",
    header: "HIS CÓDIGO"
  },
  {
    accessorKey: "CODHIS",
    header: "CODHIS"
  },
  {
    accessorKey: "EESS",
    header: "EESS"
  },
  {
    accessorKey: "CONTRATO",
    header: "CONTRATO"
  }
]

export default function MedicosPage() {
  return (
    <DataProvider<Medico>
      apiEndpoint="medicos"
      idField="MEDICO"
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
        const columns: ColumnDef<Medico, unknown>[] = [
          {
            accessorKey: "MEDICO",
            header: "CÓDIGO"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE"
          },
          {
            accessorKey: "COLEGIO",
            header: "COLEGIADO"
          },
          {
            accessorKey: "PROFESION",
            header: "PROFESIÓN"
          },
          {
            accessorKey: "ESPECIALIDAD",
            header: "ESPECIALIDAD"
          },
          {
            accessorKey: "CARGO",
            header: "CARGO"
          },
          {
            accessorKey: "ABREVIATURA",
            header: "ABREVIATURA"
          },
          {
            accessorKey: "CONSULTORIO",
            header: "CONSULTORIO"
          },
          {
            accessorKey: "ACTIVO",
            header: "ACTIVO",
            cell: ({ row }) => (
              <span>{row.getValue("ACTIVO") === "1" ? "Sí" : "No"}</span>
            )
          },
          {
            accessorKey: "OLD",
            header: "OLD"
          },
          {
            accessorKey: "COLESP",
            header: "COLES"
          },
          {
            accessorKey: "DNI",
            header: "DNI"
          },
          {
            accessorKey: "HIS_COD_MED",
            header: "HIS CÓDIGO"
          },
          {
            accessorKey: "CODHIS",
            header: "CODHIS"
          },
          {
            accessorKey: "EESS",
            header: "EESS"
          },
          {
            accessorKey: "CONTRATO",
            header: "CONTRATO"
          }
        ]

        return (
          <>
            <DataTable<Medico>
              title="Tabla de Medicos"
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
              idField="MEDICO"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Medicos",
                data: data,
                columns: [
                  { key: "MEDICO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "COLEGIO", header: "COLEGIADO" },
                  { key: "PROFESION", header: "PROFESIÓN" },
                  { key: "ESPECIALIDAD", header: "ESPECIALIDAD" },
                  { key: "CARGO", header: "CARGO" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { key: "CONSULTORIO", header: "CONSULTORIO" },
                  { key: "ACTIVO", header: "ACTIVO", format: (value) => value === "1" ? "Sí" : "No" },
                  { key: "OLD", header: "OLD" },
                  { key: "COLESP", header: "COLES" },
                  { key: "DNI", header: "DNI" },
                  { key: "HIS_COD_MED", header: "HIS CÓDIGO" },
                  { key: "CODHIS", header: "CODHIS" },
                  { key: "EESS", header: "EESS" },
                  { key: "CONTRATO", header: "CONTRATO" }
                ]
              }}
              exportConfig={{
                filename: "medicos",
                data: data,
                columns: [
                  { key: "MEDICO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "COLEGIO", header: "COLEGIADO" },
                  { key: "PROFESION", header: "PROFESIÓN" },
                  { key: "ESPECIALIDAD", header: "ESPECIALIDAD" },
                  { key: "CARGO", header: "CARGO" },
                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                  { key: "CONSULTORIO", header: "CONSULTORIO" },
                  { key: "ACTIVO", header: "ACTIVO", format: (value) => value === "1" ? "Sí" : "No" },
                  { key: "OLD", header: "OLD" },
                  { key: "COLESP", header: "COLES" },
                  { key: "DNI", header: "DNI" },
                  { key: "HIS_COD_MED", header: "HIS CÓDIGO" },
                  { key: "CODHIS", header: "CODHIS" },
                  { key: "EESS", header: "EESS" },
                  { key: "CONTRATO", header: "CONTRATO" }
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Medico" : "Nuevo Medico"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "MEDICO", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { name: "COLEGIO", label: "COLEGIADO", type: "text", required: true },
                { name: "PROFESION", label: "PROFESIÓN", type: "text", required: true },
                { name: "ESPECIALIDAD", label: "ESPECIALIDAD", type: "text", required: true },
                { name: "CARGO", label: "CARGO", type: "text", required: true },
                { name: "ABREVIATURA", label: "ABREVIATURA", type: "text", required: true },
                { name: "CONSULTORIO", label: "CONSULTORIO", type: "text", required: true },
                { name: "ACTIVO", label: "Activo", type: "select", options: [{ value: "1", label: "Sí" }, { value: "0", label: "No" }] },
                { name: "OLD", label: "OLD", type: "text", required: true },
                { name: "COLESP", label: "COLES", type: "text", required: true },
                { name: "DNI", label: "DNI", type: "text", required: true },
                { name: "HIS_COD_MED", label: "HIS CÓDIGO", type: "text", required: true },
                { name: "CODHIS", label: "CODHIS", type: "text", required: true },
                { name: "EESS", label: "EESS", type: "text", required: true },
                { name: "CONTRATO", label: "CONTRATO", type: "text", required: true },
                { name: "IMPCITA", label: "IMPCITA", type: "text", required: true },
                { name: "FLAT_FECHA", label: "FLAT_FECHA", type: "checkbox", required: true },
                { name: "ID_MEDICO", label: "ID_MEDICO", type: "number", required: true },
                { name: "firma", label: "firma", type: "text", required: true },
                { name: "tiene_firma", label: "tiene_firma", type: "text", required: true },
                { name: "CODPROFESION", label: "CODPROFESION", type: "text", required: true },
                { name: "FECHNAC", label: "FECHNAC", type: "date", required: true },
                { name: "APATERNO", label: "APATERNO", type: "text", required: true },
                { name: "AMATERNO", label: "AMATERNO", type: "text", required: true },
                { name: "NOMBRES", label: "NOMBRES", type: "text", required: true },
                { name: "PAIS", label: "PAIS", type: "text", required: true },
                { name: "TIPO_DOCUMENTO", label: "TIPO_DOCUMENTO", type: "text", required: true },
                { name: "REG_FECHA_CREACION", label: "REG_FECHA_CREACION", type: "date", required: true },
                { name: "REG_USUARIO_CREACION", label: "REG_USUARIO_CREACION", type: "text", required: true }
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
