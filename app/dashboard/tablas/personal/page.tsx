"use client"

import { useState } from "react"
import { TableToolbar } from "@/components/table-toolbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Tipos
interface Personal {
  id: string
  nombre: string
  activo: boolean
  cargo: string
  condicionLaboral: string
}

export default function PersonalPage() {
  const { toast } = useToast()
  // Estado para el personal
  const [personal, setPersonal] = useState<Personal[]>([
    {
      id: "001",
      nombre: "GARCÍA LÓPEZ MARÍA",
      activo: true,
      cargo: "ENFERMERA",
      condicionLaboral: "NOMBRADO",
    },
    {
      id: "002",
      nombre: "RODRÍGUEZ PÉREZ JUAN",
      activo: true,
      cargo: "TÉCNICO ENFERMERÍA",
      condicionLaboral: "CONTRATADO",
    },
    {
      id: "003",
      nombre: "MARTÍNEZ SÁNCHEZ ANA",
      activo: true,
      cargo: "ADMINISTRATIVO",
      condicionLaboral: "NOMBRADO",
    },
    {
      id: "004",
      nombre: "FERNÁNDEZ GÓMEZ CARLOS",
      activo: false,
      cargo: "TÉCNICO FARMACIA",
      condicionLaboral: "CONTRATADO",
    },
    {
      id: "005",
      nombre: "LÓPEZ TORRES PATRICIA",
      activo: true,
      cargo: "ENFERMERA",
      condicionLaboral: "CAS",
    },
  ])

  // Estado para el filtro de búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para el personal seleccionado para editar
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null)

  // Estado para el diálogo
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")

  // Filtrar personal según el término de búsqueda
  const filteredPersonal = personal.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cargo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para abrir el diálogo de agregar
  const handleAddClick = () => {
    setDialogMode("add")
    setSelectedPersonal({
      id: "",
      nombre: "",
      activo: true,
      cargo: "",
      condicionLaboral: "CONTRATADO",
    })
    setDialogOpen(true)
  }

  // Función para guardar un personal (agregar o editar)
  const handleSavePersonal = () => {
    if (!selectedPersonal) return

    if (dialogMode === "add") {
      // Generar un ID único
      const newId = (Number.parseInt(personal[personal.length - 1]?.id || "0") + 1).toString().padStart(3, "0")
      setPersonal([...personal, { ...selectedPersonal, id: newId }])

      toast({
        title: "Personal agregado",
        description: "El personal ha sido agregado correctamente",
      })
    } else {
      setPersonal(personal.map((p) => (p.id === selectedPersonal.id ? selectedPersonal : p)))

      toast({
        title: "Personal actualizado",
        description: "El personal ha sido actualizado correctamente",
      })
    }

    setDialogOpen(false)
  }

  // Exportar a Excel
  const handleExportExcel = () => {
    toast({
      title: "Exportando a Excel",
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
      <TableToolbar
        title="Personal"
        searchPlaceholder="Buscar por nombre o cargo..."
        onSearch={setSearchTerm}
        onRefresh={() => setSearchTerm("")}
        onNew={handleAddClick}
        onPrint={handlePrint}
        onExport={handleExportExcel}
        backUrl="/dashboard/tablas"
        showEditButton={false}
        showDeleteButton={false}
        newButtonText="Nuevo Personal"
      />

      <div className="border rounded-md mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Condición Laboral</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersonal.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No se encontró personal
                </TableCell>
              </TableRow>
            ) : (
              filteredPersonal.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.activo ? "Sí" : "No"}</TableCell>
                  <TableCell>{p.cargo}</TableCell>
                  <TableCell>{p.condicionLaboral}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Agregar Personal" : "Editar Personal"}</DialogTitle>
            <DialogDescription>
              Complete la información del personal. Todos los campos son obligatorios.
            </DialogDescription>
          </DialogHeader>
          {selectedPersonal && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={selectedPersonal.nombre}
                  onChange={(e) => setSelectedPersonal({ ...selectedPersonal, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activo">Activo</Label>
                <Select
                  value={selectedPersonal.activo ? "true" : "false"}
                  onValueChange={(value) =>
                    setSelectedPersonal({
                      ...selectedPersonal,
                      activo: value === "true",
                    })
                  }
                >
                  <SelectTrigger id="activo">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={selectedPersonal.cargo}
                  onChange={(e) => setSelectedPersonal({ ...selectedPersonal, cargo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condicionLaboral">Condición Laboral</Label>
                <Select
                  value={selectedPersonal.condicionLaboral}
                  onValueChange={(value) => setSelectedPersonal({ ...selectedPersonal, condicionLaboral: value })}
                >
                  <SelectTrigger id="condicionLaboral">
                    <SelectValue placeholder="Seleccionar condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOMBRADO">NOMBRADO</SelectItem>
                    <SelectItem value="CONTRATADO">CONTRATADO</SelectItem>
                    <SelectItem value="CAS">CAS</SelectItem>
                    <SelectItem value="TERCEROS">TERCEROS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePersonal}>Guardar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

