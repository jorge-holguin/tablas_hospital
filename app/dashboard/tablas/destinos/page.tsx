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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface Destino {
  DESTINO: string
  NOMBRE: string
  ACTIVO: number
  CIERRA_CUENTA: number
  MOSTRAR_WEB?: string
  ORDEN?: number
}

const defaultValues: Partial<Destino> = {
  DESTINO: "",
  NOMBRE: "",
  ACTIVO: 1,
  CIERRA_CUENTA: 1,
  MOSTRAR_WEB: "S",
  ORDEN: 0
}

// Esquema de validación para el formulario
const formSchema = z.object({
  DESTINO: z.string().min(1, "El código es obligatorio").max(2, "Máximo 2 caracteres"),
  NOMBRE: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  ACTIVO: z.number(),
  CIERRA_CUENTA: z.number(),
  MOSTRAR_WEB: z.string().nullable().optional(),
  ORDEN: z.number().nullable().optional()
})

export default function DestinosPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Destino | null>(null)

  return (
    <DataProvider<Destino>
      apiEndpoint="destino"
      idField="DESTINO"
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
            const response = await fetch(`/api/tablas/destino/${id}`)
            if (!response.ok) throw new Error('Error al obtener el destino')
            const data = await response.json()
            setEditingItem(data)
            form.reset(data as any)
            setIsEditing(true)
            handleEdit()
          } catch (error) {
            console.error('Error al editar:', error)
            toast({
              title: 'Error',
              description: 'No se pudo cargar el destino para editar',
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
          handleSaveItem(values as Destino)
        }

        const columns: ColumnDef<Destino, unknown>[] = [
          {
            accessorKey: "DESTINO",
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
            accessorKey: "CIERRA_CUENTA",
            header: "Cierra Cuenta",
            cell: ({ row }) => {
              const cierraCuenta = row.getValue("CIERRA_CUENTA") as number
              return (
                <Badge variant={cierraCuenta === 1 ? "default" : "destructive"} className={cierraCuenta === 1 ? "bg-blue-500" : ""}>
                  {cierraCuenta === 1 ? "Sí" : "No"}
                </Badge>
              )
            }
          },
          {
            accessorKey: "MOSTRAR_WEB",
            header: "Mostrar Web",
            cell: ({ row }) => {
              const mostrarWeb = row.getValue("MOSTRAR_WEB") as string
              return mostrarWeb === "S" ? "Sí" : "No"
            }
          },
          {
            accessorKey: "ORDEN",
            header: "Orden"
          }
        ]

        return (
          <>
            <DataTable<Destino>
              title="Destinos"
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
              idField="DESTINO"
              onRefresh={handleRefresh}
              onNew={() => {
                setEditingItem(null)
                form.reset(defaultValues as any)
                handleNew()
              }}
              onEdit={(id) => handleItemEdit(id)}
              onDelete={handleDelete}
              backHref="/dashboard/tablas"
              printConfig={{
                title: "Reporte de Destinos",
                data: data,
                columns: [
                  { key: "DESTINO", header: "Código" },
                  { key: "NOMBRE", header: "Nombre" },
                  { key: "ACTIVO", header: "Activo", format: (value) => value === 1 ? "Sí" : "No" },
                  { key: "CIERRA_CUENTA", header: "Cierra Cuenta", format: (value) => value === 1 ? "Sí" : "No" },
                  { key: "MOSTRAR_WEB", header: "Mostrar Web", format: (value) => value === "S" ? "Sí" : "No" },
                  { key: "ORDEN", header: "Orden" }
                ]
              }}
              exportConfig={{
                filename: "destinos",
                data: data,
                columns: [
                  { key: "DESTINO", header: "Código" },
                  { key: "NOMBRE", header: "Nombre" },
                  { key: "ACTIVO", header: "Activo", format: (value) => value === 1 ? "Sí" : "No" },
                  { key: "CIERRA_CUENTA", header: "Cierra Cuenta", format: (value) => value === 1 ? "Sí" : "No" },
                  { key: "MOSTRAR_WEB", header: "Mostrar Web", format: (value) => value === "S" ? "Sí" : "No" },
                  { key: "ORDEN", header: "Orden" }
                ]
              }}
            />

            {/* Diálogo de edición */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Editar Destino" : "Nuevo Destino"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="DESTINO"
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
                        name="CIERRA_CUENTA"
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
                              <FormLabel>Cierra Cuenta</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="MOSTRAR_WEB"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "S"}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? "S" : "N")
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Mostrar en Web</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ORDEN"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Orden</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                value={field.value || 0}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                placeholder="Ingrese el orden"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
