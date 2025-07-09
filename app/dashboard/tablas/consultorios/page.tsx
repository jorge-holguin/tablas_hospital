"use client"
    
import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
    
interface Consultorio {
    CONSULTORIO: string
    NOMBRE: string
    ABREVIATURA: string
    ESPECIALIDAD : string
    TIPO: string
    ROL: "1",
    MUESTRAROL: "0",
    CC1: "",
    CC2: "",
    CC3: "",
    ACTIVO: number,
    ORDEN: number,
    NUMERO: string,
    CUPO: number,
    CODESP: string,
    NOMEESP: string,
    HISESPEC: string,
    }
    
    const defaultValues: Partial<Consultorio> = {
      CONSULTORIO: "",
      NOMBRE: "",
      ABREVIATURA: "",
      ESPECIALIDAD: "",
      TIPO: "",
      ROL: "1",
      MUESTRAROL: "0",
      CC1: "",
      CC2: "",
      CC3: "",
      ACTIVO: 1,
      ORDEN: 0,
      NUMERO: "",
      CUPO: 0,
      CODESP: "",
      NOMEESP: "",
      HISESPEC: ""
    }
    
const columns: ColumnDef<Consultorio, unknown>[] = [
  {
    accessorKey: "CONSULTORIO",
    header: "CÓDIGO"
  },
  {
    accessorKey: "NOMBRE",
    header: "NOMBRE"
  },
  {
    accessorKey: "ABREVIATURA",
    header: "ABREVIATURA"
  },
  {
    accessorKey: "ESPECIALIDAD",
    header: "ESPECIALIDAD"
  },
  {
    accessorKey: "TIPO",
    header: "TIPO"
  },
  { accessorKey: "ROL", header: "ROL" },
  { accessorKey: "MUESTRAROL", header: "MUESTRAR ROL" },
  { accessorKey: "CC1", header: "CC1" },
  { accessorKey: "CC2", header: "CC2" },
  { accessorKey: "CC3", header: "CC3" },
  {
    accessorKey: "ACTIVO",
    header: "ACTIVO",
    cell: ({ row }) => (
      <span>{Number(row.getValue("ACTIVO")) === 1 ? "Sí" : "No"}</span>
    )
  },
  {
    accessorKey: "ORDEN",
    header: "ORDEN"
  },
  {
    accessorKey: "NUMERO",
    header: "NUMERO"
  },
  {
    accessorKey: "CUPO",
    header: "CUPO"
  },
  {
    accessorKey: "CODESP",
    header: "CODESP"
  },
  {
    accessorKey: "NOMEESP",
    header: "NOMEESP"
  },
  {
    accessorKey: "HISESPEC",
    header: "HISESPEC"
  }
]

export default function ConsultoriosPage() {
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null)

  return (
    <DataProvider<Consultorio>
      apiEndpoint="consultorios"
      idField="CONSULTORIO"
      defaultValues={defaultValues}
      extraParams={{
        tipo: filtroTipo
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
        }) => { const columns: ColumnDef<Consultorio, unknown>[] = [
                  {
                    accessorKey: "CONSULTORIO",
                    header: "CÓDIGO"
                  },
                  {
                    accessorKey: "NOMBRE",
                    header: "NOMBRE"
                  },
                  {
                    accessorKey: "ABREVIATURA",
                    header: "ABREVIATURA"
                  },
                  {
                    accessorKey: "NUMERO",
                    header: "CODIGO EN EMERGENCIA"
                  },
                  {
                    accessorKey: "ESPECIALIDAD",
                    header: "ESPECIALIDAD"
                  },
                  {
                    accessorKey: "TIPO",
                    header: "TIPO"
                  },
                  
                ]
                return (
                          <>
                            <div className="mb-4 p-4 border rounded-md bg-gray-50">
                              <h3 className="text-lg font-semibold mb-2">Filtros</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                  <select
                                    id="tipo"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={filtroTipo || 'all'}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setFiltroTipo(value === 'all' ? null : value);
                                      loadData();
                                    }}
                                  >
                                    <option value="all">Todos</option>
                                    <option value="0">0 - Sin especificar</option>
                                    <option value="9">9 - Especial</option>
                                    <option value="C">C - Consultorio</option>
                                    <option value="D">D - Diagnóstico</option>
                                    <option value="E">E - Emergencia</option>
                                    <option value="H">H - Hospitalización</option>
                                    <option value="O">O - Otros</option>
                                    <option value="S">S - Servicio</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            
                            <DataTable<Consultorio>
                              title="Tabla de Consultorios - Especialidad"
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
                              idField="CONSULTORIO"
                              onEdit={undefined}
                              onDelete={undefined}
                              onNew={undefined}
                              onRefresh={handleRefresh}
                              backHref="/dashboard/tablas"
                              printConfig={{
                                title: "Reporte de Consultorios",
                                data: data,
                                columns: [
                                  { key: "CONSULTORIO", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                                  { key: "ESPECIALIDAD", header: "ESPECIALIDAD" },
                                  { key: "TIPO", header: "TIPO" },
                                  { key: "MUESTRAROL", header: "MUESTRAR ROL" },
                                  { key: "CC1", header: "CC1" },
                                  { key: "CC2", header: "CC2" },
                                  { key: "CC3", header: "CC3" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "ORDEN", header: "ORDEN" },
                                  { key: "NUMERO", header: "EMERGENCIA" },
                                  { key: "CUPO", header: "CUPO" },
                                  { key: "CODESP", header: "CODESP" },
                                  { key: "NOMEESP", header: "NOMEESP" },
                                  { key: "HISESPEC", header: "HISESPEC" }
                                ]
                              }}
                              exportConfig={{
                                filename: "consultorios",
                                data: data,
                                columns: [
                                  { key: "CONSULTORIO", header: "CÓDIGO" },
                                  { key: "NOMBRE", header: "NOMBRE" },
                                  { key: "ABREVIATURA", header: "ABREVIATURA" },
                                  { key: "ESPECIALIDAD", header: "ESPECIALIDAD" },
                                  { key: "TIPO", header: "TIPO" },
                                  { key: "ROL", header: "ROL" },
                                  { key: "MUESTRAROL", header: "MUESTRAR ROL" },
                                  { key: "CC1", header: "CC1" },
                                  { key: "CC2", header: "CC2" },
                                  { key: "CC3", header: "CC3" },
                                  { key: "ACTIVO", header: "ACTIVO" },
                                  { key: "ORDEN", header: "ORDEN" },
                                  { key: "NUMERO", header: "NUMERO" },
                                  { key: "CUPO", header: "CUPO" },
                                  { key: "CODESP", header: "CODESP" },
                                  { key: "NOMEESP", header: "NOMEESP" },
                                  { key: "HISESPEC", header: "HISESPEC" }
                                ]
                              }}
                            />

            <EditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title={selectedItems.length === 1 ? "Editar Consultorio" : "Nuevo Consultorio"}
              defaultValues={defaultValues}
              selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
              onSave={handleSaveItem}
              fields={[
                { name: "CONSULTORIO", label: "Código", type: "text", required: true, readOnly: selectedItems.length === 1 },
                { name: "NOMBRE", label: "Nombre", type: "text", required: true },
                { 
                  name: "ABREVIATURA", 
                  label: "Abreviatura", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "ESPECIALIDAD", 
                  label: "Especialidad", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "TIPO", 
                  label: "Tipo", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "ROL", 
                  label: "Rol", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "MUESTRAROL", 
                  label: "Muestra Rol", 
                  type: "select", 
                  options: [
                    { value: "1", label: "Sí" },
                    { value: "0", label: "No" }
                  ]
                },
                { 
                  name: "CC1", 
                  label: "CC1", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "CC2", 
                  label: "CC2", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "CC3", 
                  label: "CC3", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "ACTIVO", 
                  label: "Activo", 
                  type: "select", 
                  options: [
                    { value: "1", label: "Sí" },
                    { value: "0", label: "No" }
                  ]
                },
                { 
                  name: "ORDEN", 
                  label: "Orden", 
                  type: "number", 
                  required: true 
                },
                { 
                  name: "NUMERO", 
                  label: "Número", 
                  type: "number", 
                  required: true 
                },
                { 
                  name: "CUPO", 
                  label: "Cupo", 
                  type: "number", 
                  required: true 
                },
                { 
                  name: "CODESP", 
                  label: "CodeSP", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "NOMEESP", 
                  label: "NomeEsp", 
                  type: "text", 
                  required: true 
                },
                { 
                  name: "HISESPEC", 
                  label: "HisEspec", 
                  type: "text", 
                  required: true 
                },
                
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
