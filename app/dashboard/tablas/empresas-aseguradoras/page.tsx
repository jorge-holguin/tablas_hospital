"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Printer, FileSpreadsheet, ArrowLeft, Plus, Filter } from "lucide-react"

// Tipos
interface EmpresaAseguradora {
  id: string
  nombre: string
}

export default function EmpresasAseguradorasPage() {
  const { toast } = useToast()
  const [empresas, setEmpresas] = useState<EmpresaAseguradora[]>([
    { id: "01", nombre: "Gobierno" },
    { id: "05", nombre: "PACIFICO COMPAÑÍA DE SEGUROS Y REASEGUROS" },
    { id: "06", nombre: "SuperFarma" },
    { id: "07", nombre: "Tiendas Santa Isabel" },
    { id: "08", nombre: "La Vitalicia Cía.Seguro" },
    { id: "09", nombre: "LA POSITIVA SEGUROS Y REASEGUROS" },
    { id: "10", nombre: "Seguros Fenix" },
    { id: "11", nombre: "Mapfre-Peru" },
    { id: "12", nombre: "Recaudadora" },
    { id: "13", nombre: "SulAmérica Seguros" },
    { id: "14", nombre: "INTERSEGURO COMPAÑÍA DE SEGUROS S.A." },
    { id: "15", nombre: "RIMAC SEGUROS Y REASEGUROS" },
    { id: "20", nombre: "Paciente" },
    { id: "21", nombre: "Trabajador" },
    { id: "22", nombre: "AFOCAT LIMA METROPOLITANA" },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [newEmpresa, setNewEmpresa] = useState<EmpresaAseguradora>({ id: "", nombre: "" })

  // Filtrar empresas según la búsqueda
  const filteredEmpresas = empresas.filter(
    (empresa) => empresa.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || empresa.id.includes(searchQuery),
  )

  // Abrir diálogo de agregar
  const handleAddClick = () => {
    // Generar un ID único basado en el último ID + 1
    const lastId = Math.max(...empresas.map((e) => Number.parseInt(e.id)), 0)
    const newId = (lastId + 1).toString().padStart(2, "0")
    setNewEmpresa({ id: newId, nombre: "" })
    setIsNewDialogOpen(true)
  }

  // Guardar nueva empresa
  const handleSaveEmpresa = () => {
    if (!newEmpresa.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la empresa es obligatorio",
        variant: "destructive",
      })
      return
    }

    setEmpresas([...empresas, newEmpresa])
    setIsNewDialogOpen(false)
    setNewEmpresa({ id: "", nombre: "" })

    toast({
      title: "Empresa agregada",
      description: "La empresa aseguradora ha sido agregada correctamente",
    })
  }

  // Exportar a Excel
  const handleExport = () => {
    toast({
      title: "Exportando datos",
      description: "Los datos se están exportando a Excel",
    })
    // Aquí iría la lógica real de exportación
  }

  // Imprimir
  const handlePrint = () => {
    toast({
      title: "Preparando impresión",
      description: "Preparando documento para imprimir",
    })
    // Aquí iría la lógica real de impresión
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Empresas Aseguradoras</h1>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Buscar por nombre o ID..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={() => {}}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Empresa
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>

            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>

            <Button variant="outline" onClick={handleExport}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>

            <Button variant="outline" onClick={() => (window.location.href = "/dashboard/tablas")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmpresas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4">
                  No se encontraron empresas aseguradoras
                </TableCell>
              </TableRow>
            ) : (
              filteredEmpresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>{empresa.id}</TableCell>
                  <TableCell>{empresa.nombre}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para nueva empresa */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Empresa Aseguradora</DialogTitle>
            <DialogDescription>Complete la información de la nueva empresa aseguradora.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={newEmpresa.id} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={newEmpresa.nombre}
                onChange={(e) => setNewEmpresa({ ...newEmpresa, nombre: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEmpresa}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

