"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { EditDialog } from "@/components/edit-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { DataProvider } from "@/components/utils/data-provider"
import { FilterToolbar } from "@/components/utils/filter-toolbar"
import { ActionToolbar } from "@/components/utils/action-toolbar"
import { DataTable } from "@/components/utils/data-table"
import { printData } from "@/components/utils/print-helper"
import { exportToCSV } from "@/components/utils/export-helper"

interface TipoAtencion {
  TIPO_ATENCION: string
  NOMBRE: string
  ACTIVO: number
}

export default function TipoAtencionPage() {
  const { toast } = useToast()
  
  const defaultValues: Partial<TipoAtencion> = {
    TIPO_ATENCION: "",
    NOMBRE: "",
    ACTIVO: 1
  }
  
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handlePrint = async (data: TipoAtencion[]) => {
    try {
      await printData({
        title: "Tabla de Tipos de Atención",
        data,
        columns: [
          { key: "TIPO_ATENCION", header: "CÓDIGO" },
          { key: "NOMBRE", header: "NOMBRE" },
          { 
            key: "ACTIVO", 
            header: "ACTIVO",
            format: (value) => Number(value) === 1 ? 'Sí' : 'No'
          }
        ]
      })
      
      toast({
        title: "Imprimiendo",
        description: "Enviando documento a la impresora",
      })
    } catch (error) {
      console.error('Error al imprimir:', error)
      toast({
        title: "Error",
        description: "Error al imprimir el documento",
        variant: "destructive"
      })
    }
  }

  const handleExport = (data: TipoAtencion[]) => {
    const success = exportToCSV({
      filename: "tipos-atencion",
      data,
      columns: [
        { key: "TIPO_ATENCION", header: "CÓDIGO" },
        { key: "NOMBRE", header: "NOMBRE" },
        { 
          key: "ACTIVO", 
          header: "ACTIVO",
          format: (value) => Number(value) === 1 ? 'Sí' : 'No'
        }
      ]
    })
    
    if (success) {
      toast({
        title: "Exportando",
        description: "Datos exportados a CSV correctamente",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al exportar los datos",
        variant: "destructive"
      })
    }
  }

  const handleSelectItem = (rows: string[]) => {
    setSelectedItems(rows)
  }

  return (
    <div className="container mx-auto py-4 space-y-4">
      <h1 className="text-2xl font-bold">Tipos de Atención</h1>
      
      <DataProvider<TipoAtencion>
        apiEndpoint="tipo-atencion"
        idField="TIPO_ATENCION"
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
          selectedItem,
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
        }) => {
          const handleSelectAll = () => {
            setSelectAll(!selectAll)
            if (!selectAll && data) {
              setSelectedItems(data.map((item: TipoAtencion) => item.TIPO_ATENCION))
            } else {
              setSelectedItems([])
            }
          }

          return (
            <>
              <div className="space-y-4">
                <ActionToolbar
                  onNew={handleNew}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRefresh={handleRefresh}
                  onPrint={() => handlePrint(data)}
                  selectedItems={selectedItems}
                  showEditButton={selectedItems.length === 1}
                  showDeleteButton={selectedItems.length > 0}
                />

                <Card>
                  <CardContent className="p-6">
                    <DataTable
                      data={data}
                      loading={loading}
                      columns={[
                        { key: "TIPO_ATENCION", header: "CÓDIGO" },
                        { key: "NOMBRE", header: "NOMBRE" },
                        { 
                          key: "ACTIVO", 
                          header: "ACTIVO",
                          format: (value) => Number(value) === 1 ? 'Sí' : 'No'
                        }
                      ]}
                      selectedItems={selectedItems}
                      onSelectItem={handleSelectItem}
                      selectAll={selectAll}
                      onSelectAll={handleSelectAll}
                      searchTerm={searchTerm}
                      onSearch={setSearchTerm}
                      filterActive={filterActive}
                      onFilterActive={setFilterActive}
                    />
                  </CardContent>
                </Card>

                <Pagination
                  totalItems={totalItems}
                  pageIndex={currentPage}
                  pageSize={pageSize}
                  setPageIndex={setCurrentPage}
                  setPageSize={setPageSize}
                />

                <EditDialog
                  title={selectedItem ? "Editar Tipo de Atención" : "Nuevo Tipo de Atención"}
                  open={editDialogOpen}
                  onOpenChange={setEditDialogOpen}
                  onSave={handleSaveItem}
                  defaultValues={
                    selectedItem
                      ? data.find(item => item.TIPO_ATENCION === selectedItem) || defaultValues
                      : defaultValues
                  }
                  fields={[
                    {
                      name: "TIPO_ATENCION",
                      label: "Código",
                      type: "text",
                      required: true,
                      readOnly: !!selectedItem,
                      maxLength: 2
                    },
                    {
                      name: "NOMBRE",
                      label: "Nombre",
                      type: "text",
                      required: true,
                      maxLength: 100
                    },
                    {
                      name: "ACTIVO",
                      label: "Activo",
                      type: "checkbox",
                      transform: {
                        input: (value) => Number(value) === 1,
                        output: (value) => value ? 1 : 0
                      }
                    }
                  ]}
                />
                
                <ConfirmDialog
                  title="Confirmar eliminación"
                  open={confirmDialogOpen}
                  onOpenChange={setConfirmDialogOpen}
                  onConfirm={confirmDelete}
                  description={`¿Está seguro de eliminar ${selectedItems.length > 1 ? 'los tipos de atención seleccionados' : 'el tipo de atención seleccionado'}?`}
                />
              </div>
            </>
          )
        }}
      </DataProvider>
    </div>
  )
}
