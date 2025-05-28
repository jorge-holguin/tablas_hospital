"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
// Función para formatear fechas en formato dd/mm/yyyy
const formatearFecha = (fecha: string | Date | null): string => {
  if (!fecha) return ""
  try {
    const date = new Date(fecha)
    const dia = date.getDate().toString().padStart(2, '0')
    const mes = (date.getMonth() + 1).toString().padStart(2, '0')
    const anio = date.getFullYear()
    return `${dia}/${mes}/${anio}`
  } catch (error) {
    return String(fecha)
  }
}

interface Cuenta {
  CUENTAID: string
  PACIENTE: string
  PACIENTE_NOMBRE?: string
  SEGURO: string
  SEGURO_NOMBRE?: string
  EMPRESASEGURO: string
  EMPRESASEGURO_NOMBRE?: string
  FECHA_APERTURA: string
  FECHA_CIERRE?: string
  NOMBRE: string
  ORIGEN: string
  ORIGEN_NOMBRE?: string
  ESTADO: string
}

const defaultValues: Partial<Cuenta> = {
  CUENTAID: "",
  PACIENTE: "",
  SEGURO: "",
  EMPRESASEGURO: "",
  NOMBRE: "",
  ORIGEN: "",
  ESTADO: "1"
}

// Definición de columnas para la tabla de cuentas
const columns: ColumnDef<Cuenta, unknown>[] = [
  {
    accessorKey: "CUENTAID",
    header: "CÓDIGO"
  },
  {
    accessorKey: "PACIENTE",
    header: "CÓDIGO PACIENTE",
    cell: ({ row }) => {
      const paciente = row.original.PACIENTE
      const pacienteNombre = row.original.PACIENTE_NOMBRE
      return (
        <div className="flex flex-col">
          <span className="font-medium">{paciente}</span>
          {pacienteNombre && <span className="text-xs text-muted-foreground">{pacienteNombre}</span>}
        </div>
      )
    }
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "SEGURO",
    header: "SEGURO",
    cell: ({ row }) => {
      const seguro = row.original.SEGURO
      const seguroNombre = row.original.SEGURO_NOMBRE
      return (
        <div className="flex flex-col">
          <span className="font-medium">{seguro}</span>
          {seguroNombre && <span className="text-xs text-muted-foreground">{seguroNombre}</span>}
        </div>
      )
    }
  },
  {
    accessorKey: "FECHA_APERTURA",
    header: "FECHA APERTURA",
    cell: ({ row }) => {
      const fecha = row.getValue("FECHA_APERTURA")
      if (!fecha) return ""
      return formatearFecha(fecha as string)
    }
  },
  {
    accessorKey: "FECHA_CIERRE",
    header: "FECHA CIERRE",
    cell: ({ row }) => {
      const fecha = row.getValue("FECHA_CIERRE")
      if (!fecha) return ""
      return formatearFecha(fecha as string)
    }
  },
  {
    accessorKey: "ORIGEN",
    header: "ORIGEN",
    cell: ({ row }) => {
      const origen = row.original.ORIGEN
      const origenNombre = row.original.ORIGEN_NOMBRE
      return (
        <div className="flex flex-col">
          <span className="font-medium">{origen}</span>
          {origenNombre && <span className="text-xs text-muted-foreground">{origenNombre}</span>}
        </div>
      )
    }
  },
  {
    accessorKey: "ESTADO",
    header: "ESTADO",
    cell: ({ row }) => (
      <span>{row.getValue("ESTADO") === "1" ? "Activo" : "Inactivo"}</span>
    )
  }
]

export default function CuentasPage() {
  return (
    <DataProvider<Cuenta>
      apiEndpoint="cuentas"
      idField="CUENTAID"
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
        return (
          <>
            <DataTable<Cuenta>
              title="Gestión de Cuentas"
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
              idField="CUENTAID"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNew={handleNew}
              onRefresh={handleRefresh}
              backHref="/dashboard"
              printConfig={{
                title: "Reporte de Cuentas",
                data: data,
                columns: [
                  { key: "CUENTAID", header: "CÓDIGO" },
                  { key: "PACIENTE", header: "CÓDIGO PACIENTE", format: (value: string, row: Record<string, any>) => `${value}${row.PACIENTE_NOMBRE ? ` - ${row.PACIENTE_NOMBRE}` : ''}` },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "SEGURO", header: "SEGURO", format: (value: string, row: Record<string, any>) => `${value}${row.SEGURO_NOMBRE ? ` - ${row.SEGURO_NOMBRE}` : ''}` },
                  { 
                    key: "FECHA_APERTURA", 
                    header: "FECHA APERTURA",
                    format: (value) => {
                      if (!value) return ""
                      return formatearFecha(value)
                    }
                  },
                  { 
                    key: "FECHA_CIERRE", 
                    header: "FECHA CIERRE",
                    format: (value) => {
                      if (!value) return ""
                      return formatearFecha(value)
                    }
                  },
                  { key: "ORIGEN", header: "ORIGEN", format: (value: string, row: Record<string, any>) => `${value}${row.ORIGEN_NOMBRE ? ` - ${row.ORIGEN_NOMBRE}` : ''}` },
                  { key: "ESTADO", header: "ESTADO", format: (value) => value === "1" ? "Activo" : "Inactivo" }
                ]
              }}
              exportConfig={{
                filename: "cuentas",
                data: data,
                columns: [
                  { key: "CUENTAID", header: "CÓDIGO" },
                  { key: "PACIENTE", header: "CÓDIGO PACIENTE", format: (value: string, row: Record<string, any>) => `${value}${row.PACIENTE_NOMBRE ? ` - ${row.PACIENTE_NOMBRE}` : ''}` },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "SEGURO", header: "SEGURO", format: (value: string, row: Record<string, any>) => `${value}${row.SEGURO_NOMBRE ? ` - ${row.SEGURO_NOMBRE}` : ''}` },
                  { 
                    key: "FECHA_APERTURA", 
                    header: "FECHA APERTURA",
                    format: (value) => {
                      if (!value) return ""
                      return formatearFecha(value)
                    }
                  },
                  { 
                    key: "FECHA_CIERRE", 
                    header: "FECHA CIERRE",
                    format: (value) => {
                      if (!value) return ""
                      return formatearFecha(value)
                    }
                  },
                  { key: "ORIGEN", header: "ORIGEN", format: (value: string, row: Record<string, any>) => `${value}${row.ORIGEN_NOMBRE ? ` - ${row.ORIGEN_NOMBRE}` : ''}` },
                  { key: "ESTADO", header: "ESTADO", format: (value) => value === "1" ? "Activo" : "Inactivo" }
                ]
              }}
            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Cuenta" : "Nueva Cuenta"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "CUENTAID", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { 
                  name: "PACIENTE", 
                  label: "Paciente", 
                  type: "text" as const, 
                  customType: "combobox",
                  required: true,
                  apiEndpoint: "/api/selectores/pacientes",
                  valueField: "PACIENTE",
                  labelField: "NOMBRE",
                  descriptionField: "DNI",
                  placeholder: "Buscar paciente por código, nombre o DNI"
                },
                { 
                  name: "SEGURO", 
                  label: "Seguro", 
                  type: "text" as const, 
                  customType: "combobox",
                  required: true,
                  apiEndpoint: "/api/selectores/seguros",
                  valueField: "SEGURO",
                  labelField: "NOMBRE",
                  placeholder: "Buscar seguro",
                  onChange: (value, setFieldValue) => {
                    // Al cambiar el seguro, resetear la empresa de seguro
                    setFieldValue("EMPRESASEGURO", "")
                  }
                },
                { 
                  name: "EMPRESASEGURO", 
                  label: "Empresa Seguro", 
                  type: "text" as const, 
                  customType: "combobox",
                  required: true,
                  apiEndpoint: (formValues: Record<string, any>) => `/api/selectores/empresas-seguro?seguro=${formValues.SEGURO || ''}`,
                  valueField: "EMPRESASEGURO",
                  labelField: "NOMBRE",
                  placeholder: "Buscar empresa de seguro",
                  disabled: !!(selectedItems.length === 1 ? false : true)
                },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { 
                  name: "ORIGEN", 
                  label: "Origen", 
                  type: "text" as const, 
                  customType: "combobox",
                  required: true,
                  apiEndpoint: "/api/selectores/origenes",
                  valueField: "ORIGEN",
                  labelField: "NOMBRE",
                  placeholder: "Buscar origen"
                },
                { 
                  name: "ESTADO", 
                  label: "Estado", 
                  type: "select",
                  options: [
                    { value: "1", label: "Activo" },
                    { value: "0", label: "Inactivo" }
                  ]
                }
              ]}
            />

            <ConfirmDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={confirmDelete}
              title="¿Está seguro de eliminar?"
              description={`Está a punto de eliminar ${selectedItems.length} ${selectedItems.length === 1 ? "cuenta" : "cuentas"}. Esta acción no se puede deshacer.`}
              confirmText="Eliminar"
            />
          </>
        )
      }}
    </DataProvider>
  )
}
