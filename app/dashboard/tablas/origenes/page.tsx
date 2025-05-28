"use client"

import { DataTable } from "@/components/utils/data-table"
import { DataProvider } from "@/components/utils/data-provider"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface Origen {
  ORIGEN: string
  NOMBRE: string
  ACTIVO: number
  TIPO?: string
  ACTIVO_FUA?: number
}

const defaultValues: Partial<Origen> = {
  ORIGEN: "",
  NOMBRE: "",
  ACTIVO: 1,
  TIPO: "",
  ACTIVO_FUA: 1
}

// Esquema de validación para el formulario
const formSchema = z.object({
  ORIGEN: z.string().min(1, "El código es obligatorio").max(2, "Máximo 2 caracteres"),
  NOMBRE: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  ACTIVO: z.number(),
  TIPO: z.string().nullable().optional(),
  ACTIVO_FUA: z.number().nullable().optional()
})

export default function OrigenesPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Origen | null>(null)

  return (
    <DataProvider<Origen>
      apiEndpoint="origen"
      idField="ORIGEN"
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
        // Configuración del formulario
        const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: editingItem || defaultValues as any
        })
        
        // Manejar la edición de un item
        const handleItemEdit = async (id: string) => {
          try {
            const response = await fetch(`/api/tablas/origen/${id}`)
            if (!response.ok) throw new Error('Error al obtener el origen')
            const data = await response.json()
            setEditingItem(data)
            form.reset(data as any)
            setIsEditing(true)
            handleEdit()
          } catch (error) {
            console.error('Error al editar:', error)
            toast({
              title: 'Error',
              description: 'No se pudo cargar el origen para editar',
              variant: 'destructive'
            })
          }
        }
        
        // Actualizar el formulario cuando cambia el item en edición
        useEffect(() => {
          if (editingItem && !isEditing) {
            form.reset(editingItem as any)
            setIsEditing(true)
          }
        }, [editingItem, isEditing, form])

        // Resetear el estado de edición cuando se cierra el diálogo
        useEffect(() => {
          if (!editDialogOpen) {
            setIsEditing(false)
            setEditingItem(null)
          }
        }, [editDialogOpen])

        // Manejar el envío del formulario
        const onSubmit = (values: z.infer<typeof formSchema>) => {
          handleSaveItem(values as Origen)
        }

        const columns: ColumnDef<Origen, unknown>[] = [
          {
            accessorKey: "ORIGEN",
            header: "Código"
          },
          {
            accessorKey: "NOMBRE",
            header: "Nombre"
          },
          {
            accessorKey: "ACTIVO",
            header: "Activo",
            cell: ({ row }) => {
              const activo = row.getValue("ACTIVO") as number
              return (
                <Badge variant={activo === 1 ? "default" : "destructive"} className={activo === 1 ? "bg-green-500" : ""}>
                  {activo === 1 ? "Sí" : "No"}
                </Badge>
              )
            }
          },
          {
            accessorKey: "TIPO",
            header: "Tipo",
            cell: ({ row }) => {
              const tipo = row.getValue("TIPO") as string
              if (!tipo) return "-"
              return tipo
            }
          },
          {
            accessorKey: "ACTIVO_FUA",
            header: "Activo FUA",
            cell: ({ row }) => {
              const activoFua = row.getValue("ACTIVO_FUA") as number
              if (activoFua === undefined || activoFua === null) return "-"
              return (
                <Badge variant={activoFua === 1 ? "default" : "destructive"} className={activoFua === 1 ? "bg-blue-500" : ""}>
                  {activoFua === 1 ? "Sí" : "No"}
                </Badge>
              )
            }
          }
        ]

        return (
          <>
            <DataTable<Origen>
              title="Orígenes"
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
              idField="ORIGEN"
              onRefresh={handleRefresh}
              onNew={undefined}
              onEdit={undefined}
              onDelete={undefined}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Orígenes",
                data: data,
                columns: [
                  { key: "ORIGEN", header: "Código" },
                  { key: "NOMBRE", header: "Nombre" },
                  { key: "ACTIVO", header: "Activo", format: (value) => value === 1 ? "Sí" : "No" },
                  { key: "TIPO", header: "Tipo" },
                  { key: "ACTIVO_FUA", header: "Activo FUA", format: (value) => value === 1 ? "Sí" : "No" }
                ]
              }}
              exportConfig={{
                filename: "origenes",
                data: data,
                columns: [
                  { key: "ORIGEN", header: "Código" },
                  { key: "NOMBRE", header: "Nombre" },
                  { key: "ACTIVO", header: "Activo", format: (value) => value === 1 ? "Sí" : "No" },
                  { key: "TIPO", header: "Tipo" },
                  { key: "ACTIVO_FUA", header: "Activo FUA", format: (value) => value === 1 ? "Sí" : "No" }
                ]
              }}
            />

            {/* Diálogo de edición */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Editar Origen" : "Nuevo Origen"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ORIGEN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              maxLength={2} 
                              disabled={!!editingItem}
                              placeholder="Ingrese el código (máx. 2 caracteres)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="NOMBRE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              maxLength={50} 
                              placeholder="Ingrese el nombre"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ACTIVO"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value === 1}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? 1 : 0)
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Activo</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ACTIVO_FUA"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value === 1}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? 1 : 0)
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Activo FUA</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="TIPO"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ""}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Ninguno</SelectItem>
                              <SelectItem value="I">Interno</SelectItem>
                              <SelectItem value="E">Externo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Guardar</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </>
        )
      }}
    </DataProvider>
  )
}
