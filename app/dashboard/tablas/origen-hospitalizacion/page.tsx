"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

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
  DX_DES?: string
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
  DX: "",
  DX_DES: ""
}

export default function OrigenHospitalizacionPage() {
  // Estado para controlar la apertura/cierre del modal de tutorial
  const [tutorialOpen, setTutorialOpen] = useState(false)
  
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
            accessorKey: "MEDICO",
            header: "Código Médico"
          },
          {
            accessorKey: "NOM_MEDICO",
            header: "Nombre Médico"
          },
          {
            accessorKey: "DX",
            header: "Código Diagnóstico",
            cell: ({ row }) => {
              const origen = row.getValue("ORIGEN") as string
              const dx = row.getValue("DX") as string
              
              if (origen === "EM") {
                return (
                  <div className="flex items-center space-x-2">
                    <span>{dx}</span>
                    <a 
                      href="/dashboard/tablas/diagnosticos-his-v2" 
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Ver Diagnósticos
                    </a>
                  </div>
                )
              }
              
              return dx
            }
          },
          {
            accessorKey: "DX_DES",
            header: "Descripción Diagnóstico"
          }
        ]
        
        return (
          <>
            {/* Modal de Tutorial */}
            <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
              <DialogContent className="sm:max-w-[1920px] max-h-[1200vh] w-[1920px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Tutorial: Origen de Hospitalización</DialogTitle>
                </DialogHeader>
                <div className="py-6">
                  <div className="mt-6">
                    <p className="font-medium text-blue-700 mb-3">Manual de instrucciones:</p>
                    <div className="w-full h-[650px] border border-gray-300 rounded-md overflow-hidden">
                      <iframe 
                        src="/Tutorial_Origen_Hospitalizacion.pdf" 
                        className="w-full h-full"
                        title="Tutorial de Origen de Hospitalización"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setTutorialOpen(false)}>Cerrar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <div className="mb-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTutorialOpen(true)}
                className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Tutorial
              </Button>
            </div>
            
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
                  { key: "MEDICO", header: "Código Médico" },
                  { key: "NOM_MEDICO", header: "Nombre Médico" },
                  { key: "DX", header: "Código Diagnóstico" },
                  { key: "DX_DES", header: "Descripción Diagnóstico" }
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
                  { key: "MEDICO", header: "Código Médico" },
                  { key: "NOM_MEDICO", header: "Nombre Médico" },
                  { key: "DX", header: "Código Diagnóstico" },
                  { key: "DX_DES", header: "Descripción Diagnóstico" }
                ]
              }}
            />
          </>
        )
      }}
    </DataProvider>
  )
}
