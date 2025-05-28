"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

// Función auxiliar para formatear fechas
function formatearFecha(fecha: string | Date): string {
  if (!fecha) return ""
  try {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return String(fecha)
  }
}

interface OrigenHospitalizacion {
  ORIGEN: string
  CODIGO: string
  CONSULTORIO: string
  NOM_CONSULTORIO: string
  PACIENTE: string
  FECHA: string | Date
  MEDICO: string
  NOM_MEDICO: string
  NOMBRES?: string
  DNI?: string
  DX?: string
}

const defaultValues: Partial<OrigenHospitalizacion> = {
  ORIGEN: "",
  CODIGO: "",
  CONSULTORIO: "",
  NOM_CONSULTORIO: "",
  PACIENTE: "",
  FECHA: new Date(),
  MEDICO: "",
  NOM_MEDICO: "",
  NOMBRES: "",
  DNI: "",
  DX: ""
}

export default function OrigenHospitalizacionPage() {
  return (
    <DataProvider<OrigenHospitalizacion>
      apiEndpoint="origen-hospitalizacion"
      idField="CODIGO"
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
        const columns: ColumnDef<OrigenHospitalizacion, unknown>[] = [
          {
            accessorKey: "ORIGEN",
            header: "Origen",
            cell: ({ row }) => {
              const origen = row.getValue("ORIGEN") as string
              return (
                <Badge variant={origen === "CE" ? "default" : "destructive"} className={origen === "CE" ? "bg-blue-500" : ""}>
                  {origen === "CE" ? "Consulta Externa" : "Emergencia"}
                </Badge>
              )
            }
          },
          {
            accessorKey: "CODIGO",
            header: "Código"
          },
          {
            accessorKey: "NOMBRES",
            header: "Nombres del Paciente"
          },
          {
            accessorKey: "DNI",
            header: "DNI"
          },
          {
            accessorKey: "NOM_CONSULTORIO",
            header: "Consultorio"
          },
          {
            accessorKey: "PACIENTE",
            header: "Código Paciente"
          },
          {
            accessorKey: "FECHA",
            header: "Fecha y Hora",
            cell: ({ row }) => {
              const fecha = row.getValue("FECHA")
              if (!fecha) return ""
              return formatearFecha(fecha as string)
            }
          },
          {
            accessorKey: "NOM_MEDICO",
            header: "Médico"
          },
          {
            accessorKey: "DX",
            header: "Diagnóstico"
          }
        ]

        return (
          <>
            <DataTable<OrigenHospitalizacion>
              title="Origen de Hospitalización"
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
              idField="CODIGO"
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Origen de Hospitalización",
                data: data,
                columns: [
                  { key: "ORIGEN", header: "Origen", format: (value) => value === "CE" ? "Consulta Externa" : "Emergencia" },
                  { key: "CODIGO", header: "Código" },
                  { key: "NOMBRES", header: "Nombres del Paciente" },
                  { key: "DNI", header: "DNI" },
                  { key: "NOM_CONSULTORIO", header: "Consultorio" },
                  { key: "PACIENTE", header: "Código Paciente" },
                  { key: "FECHA", header: "Fecha y Hora", format: (value) => formatearFecha(value as string) },
                  { key: "NOM_MEDICO", header: "Médico" },
                  { key: "DX", header: "Diagnóstico" }
                ]
              }}
              exportConfig={{
                filename: "origen-hospitalizacion",
                data: data,
                columns: [
                  { key: "ORIGEN", header: "Origen", format: (value) => value === "CE" ? "Consulta Externa" : "Emergencia" },
                  { key: "CODIGO", header: "Código" },
                  { key: "NOMBRES", header: "Nombres del Paciente" },
                  { key: "DNI", header: "DNI" },
                  { key: "NOM_CONSULTORIO", header: "Consultorio" },
                  { key: "PACIENTE", header: "Código Paciente" },
                  { key: "FECHA", header: "Fecha y Hora", format: (value) => formatearFecha(value as string) },
                  { key: "NOM_MEDICO", header: "Médico" },
                  { key: "DX", header: "Diagnóstico" }
                ]
              }}
            />
          </>
        )
      }}
    </DataProvider>
  )
}
