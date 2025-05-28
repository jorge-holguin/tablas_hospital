"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useReadOnlyPermissions } from "@/hooks/useReadOnlyPermissions"
import { format as formatDate } from "date-fns"
import es from "date-fns/locale/es"

interface Paciente {
  PACIENTE: string
  HISTORIA: string
  PATERNO: string
  MATERNO: string
  NOMBRE: string
  NOMBRES: string
  SEXO: string
  FECHA_NACIMIENTO?: Date
  EDAD: string
  TIPO_DOCUMENTO: string
  DOCUMENTO: string
  DIRECCION: string
  TELEFONO1: string
  EMAIL: string
  ESTADO_CIVIL: string
  OCUPACION: string
}

const defaultValues: Partial<Paciente> = {
  PACIENTE: "",
  HISTORIA: "",
  PATERNO: "",
  MATERNO: "",
  NOMBRE: "",
  NOMBRES: "",
  SEXO: "M",
  EDAD: "",
  TIPO_DOCUMENTO: "1", // DNI por defecto
  DOCUMENTO: "",
  DIRECCION: "",
  TELEFONO1: "",
  EMAIL: "",
  ESTADO_CIVIL: "1", // Soltero por defecto
  OCUPACION: "1" // Ocupación por defecto
}

export default function PacientesPage() {
  const { isReadOnly, canPerformAction } = useReadOnlyPermissions()

  return (
    <DataProvider<Paciente>
      apiEndpoint="paciente"
      idField="PACIENTE"
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
        const columns: ColumnDef<Paciente, unknown>[] = [
          {
            accessorKey: "PACIENTE",
            header: "Código"
          },
          {
            accessorKey: "HISTORIA",
            header: "Historia Clínica"
          },
          {
            accessorKey: "NOMBRES",
            header: "Nombres",
            cell: ({ row }) => {
              return `${row.original.NOMBRES || ''}`
            }
          },
          {
            accessorKey: "DOCUMENTO",
            header: "DNI/Documento"
          },
          {
            accessorKey: "SEXO",
            header: "Sexo",
            cell: ({ row }) => {
              const sexo = row.original.SEXO
              return (
                <Badge variant="outline">
                  {sexo === 'M' ? "Masculino" : sexo === 'F' ? "Femenino" : "No especificado"}
                </Badge>
              )
            }
          },
          {
            accessorKey: "FECHA_NACIMIENTO",
            header: "Fecha Nacimiento",
            cell: ({ row }) => {
              const fecha = row.original.FECHA_NACIMIENTO
              return fecha ? formatDate(new Date(fecha), 'dd/MM/yyyy', { locale: es }) : '-'
            }
          },
          {
            accessorKey: "TELEFONO1",
            header: "Teléfono"
          }
        ]

        return (
          <>
            <DataTable<Paciente>
              title="Registro de Pacientes"
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
              selectedRows={selectedItems}
              setSelectedRows={setSelectedItems}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              idField="PACIENTE"
              onEdit={isReadOnly ? undefined : handleEdit}
              onDelete={isReadOnly ? undefined : handleDelete}
              onNew={isReadOnly ? undefined : handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              
              printConfig={{
                title: "Reporte de Pacientes",
                data: data,
                columns: [
                  { key: "PACIENTE", header: "Código" },
                  { key: "HISTORIA", header: "Historia Clínica" },
                  { key: "NOMBRES", header: "Nombres" },
                  { key: "DOCUMENTO", header: "DNI/Documento" },
                  { 
                    key: "SEXO", 
                    header: "Sexo",
                    format: (value) => value === 'M' ? "Masculino" : value === 'F' ? "Femenino" : "No especificado"
                  },
                  { 
                    key: "FECHA_NACIMIENTO", 
                    header: "Fecha Nacimiento",
                    format: (value) => value ? formatDate(new Date(value), 'dd/MM/yyyy', { locale: es }) : '-'
                  },
                  { key: "TELEFONO1", header: "Teléfono" },
                  { key: "DIRECCION", header: "Dirección" }
                ]
              }}
              exportConfig={{
                filename: "pacientes",
                data: data,
                columns: [
                  { key: "PACIENTE", header: "Código" },
                  { key: "HISTORIA", header: "Historia Clínica" },
                  { key: "NOMBRES", header: "Nombres" },
                  { key: "DOCUMENTO", header: "DNI/Documento" },
                  { key: "SEXO", header: "Sexo" },
                  { key: "FECHA_NACIMIENTO", header: "Fecha Nacimiento" },
                  { key: "TELEFONO1", header: "Teléfono" },
                  { key: "DIRECCION", header: "Dirección" },
                  { key: "EMAIL", header: "Email" }
                ]
              }}
            />

            <EditDialog
              title={selectedItems.length > 0 ? "Editar Paciente" : "Nuevo Paciente"}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onSave={handleSaveItem}
              fields={[
                {
                  name: "PACIENTE",
                  label: "Código",
                  type: "text",
                  required: true,
                  maxLength: 10,
                  disabled: selectedItems.length > 0,
                  description: "Máximo 10 caracteres"
                },
                {
                  name: "HISTORIA",
                  label: "Historia Clínica",
                  type: "text",
                  required: true,
                  maxLength: 20
                },
                {
                  name: "PATERNO",
                  label: "Apellido Paterno",
                  type: "text",
                  required: true,
                  maxLength: 50
                },
                {
                  name: "MATERNO",
                  label: "Apellido Materno",
                  type: "text",
                  required: true,
                  maxLength: 50
                },
                {
                  name: "NOMBRE",
                  label: "Nombre",
                  type: "text",
                  required: true,
                  maxLength: 50
                },
                {
                  name: "NOMBRES",
                  label: "Nombres Completos",
                  type: "text",
                  required: true,
                  maxLength: 90,
                  description: "Nombres y apellidos completos"
                },
                {
                  name: "SEXO",
                  label: "Sexo",
                  type: "select",
                  required: true,
                  options: [
                    { value: "M", label: "Masculino" },
                    { value: "F", label: "Femenino" }
                  ]
                },
                {
                  name: "FECHA_NACIMIENTO",
                  label: "Fecha de Nacimiento",
                  type: "date"
                },
                {
                  name: "EDAD",
                  label: "Edad",
                  type: "text",
                  maxLength: 10
                },
                {
                  name: "TIPO_DOCUMENTO",
                  label: "Tipo de Documento",
                  type: "select",
                  required: true,
                  options: [
                    { value: "1", label: "DNI" },
                    { value: "2", label: "Pasaporte" },
                    { value: "3", label: "Carné de Extranjería" },
                    { value: "4", label: "Otro" }
                  ]
                },
                {
                  name: "DOCUMENTO",
                  label: "Número de Documento",
                  type: "text",
                  required: true,
                  maxLength: 20
                },
                {
                  name: "DIRECCION",
                  label: "Dirección",
                  type: "text",
                  maxLength: 80
                },
                {
                  name: "TELEFONO1",
                  label: "Teléfono",
                  type: "text",
                  maxLength: 50
                },
                {
                  name: "EMAIL",
                  label: "Email",
                  type: "text",
                  maxLength: 255
                },
                {
                  name: "ESTADO_CIVIL",
                  label: "Estado Civil",
                  type: "select",
                  options: [
                    { value: "1", label: "Soltero(a)" },
                    { value: "2", label: "Casado(a)" },
                    { value: "3", label: "Viudo(a)" },
                    { value: "4", label: "Divorciado(a)" },
                    { value: "5", label: "Conviviente" }
                  ]
                },
                {
                  name: "OCUPACION",
                  label: "Ocupación",
                  type: "text",
                  maxLength: 3
                }
              ]}
            />

            <ConfirmDialog
              title="Eliminar Paciente"
              description="¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer."
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
            />
          </>
        )
      }}
    </DataProvider>
  )
}
