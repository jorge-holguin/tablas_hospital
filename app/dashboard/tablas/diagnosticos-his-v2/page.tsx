"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface DiagnosticoHisV2 {
  CODORD: number
  CODIGO: string
  NOMBRE: string
  SEXO: string | null
  MIN_EDAD: number | null
  MIN_TIPO: string | null
  MAX_EDAD: number | null
  MAX_TIPO: string | null
  EST: string | null
  CLASE: string | null
  CODCAT: string | null
  FORMULA: string | null
  EST1: string | null
  TIPO: string | null
}

const defaultValues: Partial<DiagnosticoHisV2> = {
  CODORD: 0,
  CODIGO: "",
  NOMBRE: "",
  SEXO: "",
  MIN_EDAD: null,
  MIN_TIPO: "",
  MAX_EDAD: null,
  MAX_TIPO: "",
  EST: "",
  CLASE: "",
  CODCAT: "",
  FORMULA: "",
  EST1: "",
  TIPO: ""
}

export default function DiagnosticosHisV2Page() {
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)
  const [filtroClase, setFiltroClase] = useState<string | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null)
  const [filtroSexo, setFiltroSexo] = useState<string | null>(null)

  return (
    <DataProvider<DiagnosticoHisV2>
      apiEndpoint="diagnosticos-his-v2"
      idField="CODORD"
      defaultValues={defaultValues}
      extraParams={{
        estado: filtroEstado,
        clase: filtroClase,
        tipo: filtroTipo,
        sexo: filtroSexo
      }}
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
        const columns: ColumnDef<DiagnosticoHisV2, unknown>[] = [
          {
            accessorKey: "CODIGO",
            header: "CÓDIGO"
          },
          {
            accessorKey: "NOMBRE",
            header: "NOMBRE",
            cell: ({ row }) => (
              <div className="max-w-[300px] truncate" title={row.original.NOMBRE}>
                {row.original.NOMBRE}
              </div>
            )
          },
          {
            accessorKey: "SEXO",
            header: "SEXO"
          },
          {
            accessorKey: "EST",
            header: "ESTADO"
          },
          {
            accessorKey: "CLASE",
            header: "CLASE"
          },
          {
            accessorKey: "TIPO",
            header: "TIPO"
          },
          {
            accessorKey: "MIN_EDAD",
            header: "EDAD MÍNIMA"
          },
          {
            accessorKey: "MAX_EDAD",
            header: "EDAD MÁXIMA"
          }
        ]
        
        const handleFiltrar = () => {
          loadData()
        }
        
        const limpiarFiltros = () => {
          setFiltroEstado(null)
          setFiltroClase(null)
          setFiltroTipo(null)
          loadData()
        }
        
        return (
          <>
            <div className="mb-4 p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Filtros avanzados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={filtroEstado || "all"} 
                    onValueChange={(value) => setFiltroEstado(value === "all" ? null : value)}
                  >
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="1">Activo</SelectItem>
                      <SelectItem value="0">Inactivo</SelectItem>
                      <SelectItem value="2">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="clase">Clase</Label>
                  <Select 
                    value={filtroClase || "all"} 
                    onValueChange={(value) => setFiltroClase(value === "all" ? null : value)}
                  >
                    <SelectTrigger id="clase">
                      <SelectValue placeholder="Seleccionar clase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select 
                    value={filtroSexo || "all"} 
                    onValueChange={(value) => setFiltroSexo(value === "all" ? null : value)}
                  >
                    <SelectTrigger id="sexo">
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="A">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select 
                    value={filtroTipo || "all"} 
                    onValueChange={(value) => setFiltroTipo(value === "all" ? null : value)}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="CX">CX</SelectItem>
                      <SelectItem value="CP">CP</SelectItem>
                      <SelectItem value="EX">EX</SelectItem>
                      <SelectItem value="PL">PL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
                <Button onClick={handleFiltrar}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
            
            <DataTable<DiagnosticoHisV2>
              title="Tabla de Diagnósticos HIS V2"
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
              idField="CODORD"
              onEdit={undefined}
              onDelete={undefined}
              onNew={undefined}
              onRefresh={handleRefresh}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Diagnósticos HIS V2",
                data: data,
                columns: [
                  { key: "CODIGO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "SEXO", header: "SEXO" },
                  { key: "EST", header: "ESTADO" },
                  { key: "CLASE", header: "CLASE" },
                  { key: "TIPO", header: "TIPO" },
                  { key: "MIN_EDAD", header: "EDAD MÍNIMA" },
                  { key: "MAX_EDAD", header: "EDAD MÁXIMA" }
                ]
              }}
              exportConfig={{
                filename: "diagnosticos-his-v2",
                data: data,
                columns: [
                  { key: "CODIGO", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "SEXO", header: "SEXO" },
                  { key: "EST", header: "ESTADO" },
                  { key: "CLASE", header: "CLASE" },
                  { key: "TIPO", header: "TIPO" },
                  { key: "MIN_EDAD", header: "EDAD MÍNIMA" },
                  { key: "MIN_TIPO", header: "TIPO EDAD MÍNIMA" },
                  { key: "MAX_EDAD", header: "EDAD MÁXIMA" },
                  { key: "MAX_TIPO", header: "TIPO EDAD MÁXIMA" },
                  { key: "CODCAT", header: "CÓDIGO CATEGORÍA" },
                  { key: "FORMULA", header: "FÓRMULA" },
                  { key: "EST1", header: "ESTADO 1" }
                ]
              }}
            />
            
            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Diagnóstico HIS V2" : "Nuevo Diagnóstico HIS V2"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "CODIGO", label: "Código", type: "text", required: true, maxLength: 10 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true, maxLength: 310 },
                { name: "SEXO", label: "Sexo", type: "select", options: [
                  {value: "N", label: "No especificado"},
                  {value: "M", label: "Masculino"},
                  {value: "F", label: "Femenino"},
                  {value: "A", label: "Ambos"}
                ]},
                { name: "MIN_EDAD", label: "Edad Mínima", type: "number" },
                { name: "MIN_TIPO", label: "Tipo Edad Mínima", type: "select", options: [
                  {value: "N", label: "No especificado"},
                  {value: "D", label: "Días"},
                  {value: "M", label: "Meses"},
                  {value: "A", label: "Años"}
                ]},
                { name: "MAX_EDAD", label: "Edad Máxima", type: "number" },
                { name: "MAX_TIPO", label: "Tipo Edad Máxima", type: "select", options: [
                  {value: "N", label: "No especificado"},
                  {value: "D", label: "Días"},
                  {value: "M", label: "Meses"},
                  {value: "A", label: "Años"}
                ]},
                { name: "EST", label: "Estado", type: "select", options: [
                  {value: "N", label: "No especificado"},
                  {value: "1", label: "Activo"},
                  {value: "0", label: "Inactivo"}
                ]},
                { name: "CLASE", label: "Clase", type: "select", options: [
                  {value: "N", label: "No especificado"},
                  {value: "D", label: "Diagnóstico"},
                  {value: "P", label: "Procedimiento"}
                ]},
                { name: "CODCAT", label: "Código Categoría", type: "text", maxLength: 3 },
                { name: "FORMULA", label: "Fórmula", type: "text", maxLength: 30 },
                { name: "EST1", label: "Estado 1", type: "text", maxLength: 1 },
                { name: "TIPO", label: "Tipo", type: "select", options: [
                  {value: "N", label: "No especificado"},
                  {value: "01", label: "Tipo 01"},
                  {value: "02", label: "Tipo 02"}
                ]}
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
