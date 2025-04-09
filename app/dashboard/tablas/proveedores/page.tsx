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

interface Proveedor {
  PROVEEDOR: string
  NOMBRE: string
  RUC: string
  DIRECCION: string
  TELEFONO: string
  ACTIVO: number
}

export default function ProveedoresPage() {
  const { toast } = useToast()
  
  const defaultValues: Partial<Proveedor> = {
    PROVEEDOR: "",
    NOMBRE: "",
    RUC: "",
    DIRECCION: "",
    TELEFONO: "",
    ACTIVO: 1
  }
  
  const handlePrint = async (data: Proveedor[]) => {
    try {
      await printData({
        title: "Tabla de Proveedores",
        data,
        columns: [
          { key: "PROVEEDOR", header: "CÓDIGO" },
          { key: "NOMBRE", header: "NOMBRE" },
          { key: "RUC", header: "RUC" },
          { key: "DIRECCION", header: "DIRECCIÓN" },
          { key: "TELEFONO", header: "TELÉFONO" },
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

  const handleExport = (data: Proveedor[]) => {
    const success = exportToCSV({
      filename: "proveedores",
      data,
      columns: [
        { key: "PROVEEDOR", header: "CÓDIGO" },
        { key: "NOMBRE", header: "NOMBRE" },
        { key: "RUC", header: "RUC" },
        { key: "DIRECCION", header: "DIRECCIÓN" },
        { key: "TELEFONO", header: "TELÉFONO" },
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

  return (
    <div className="container mx-auto py-4 space-y-4">
      <h1 className="text-2xl font-bold">Proveedores</h1>
      
      <DataProvider<Proveedor>
        apiEndpoint="proveedores"
        idField="PROVEEDOR"
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
          selectedItem,
          selectAll,
          handleSelectAll,
          handleSelectItem,
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
        }) => (
          <>
            <div className="space-y-4">
              <ActionToolbar
                onNew={handleNew}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPrint={() => handlePrint(data)}
                onExport={() => handleExport(data)}
                backUrl="/dashboard/tablas"
                selectedItems={selectedItems}
                entityName="Proveedor"
              />
              
              <FilterToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterActive={filterActive}
                onFilterActiveChange={setFilterActive}
                onRefresh={handleRefresh}
                placeholder="Buscar por código, nombre o RUC..."
              />
              
              <DataTable
                columns={[
                  { key: "PROVEEDOR", header: "CÓDIGO" },
                  { key: "NOMBRE", header: "NOMBRE" },
                  { key: "RUC", header: "RUC" },
                  { 
                    key: "ACTIVO", 
                    header: "ACTIVO",
                    render: (value) => Number(value) === 1 ? 'Sí' : 'No'
                  }
                ]}
                data={data}
                loading={loading}
                idField="PROVEEDOR"
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
                totalItems={totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
            
            <EditDialog
              title={selectedItem ? "Editar Proveedor" : "Nuevo Proveedor"}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onSave={handleSaveItem}
              defaultValues={
                selectedItem
                  ? data.find(item => item.PROVEEDOR === selectedItem) || defaultValues
                  : defaultValues
              }
              fields={[
                {
                  name: "PROVEEDOR",
                  label: "Código",
                  type: "text",
                  required: true,
                  readOnly: !!selectedItem,
                  maxLength: 10
                },
                {
                  name: "NOMBRE",
                  label: "Nombre",
                  type: "text",
                  required: true,
                  maxLength: 100
                },
                {
                  name: "RUC",
                  label: "RUC",
                  type: "text",
                  required: false,
                  maxLength: 11
                },
                {
                  name: "DIRECCION",
                  label: "Dirección",
                  type: "text",
                  required: false,
                  maxLength: 100
                },
                {
                  name: "TELEFONO",
                  label: "Teléfono",
                  type: "text",
                  required: false,
                  maxLength: 20
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
              description={`¿Está seguro de eliminar ${selectedItems.length > 1 ? 'los proveedores seleccionados' : 'el proveedor seleccionado'}?`}
            />
          </>
        )}
      </DataProvider>
    </div>
  )
}
