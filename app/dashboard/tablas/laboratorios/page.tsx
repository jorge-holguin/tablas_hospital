"use client"

import { useState, useEffect } from "react"
import { TableToolbar } from "@/components/table-toolbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Tipo para los laboratorios
interface Laboratorio {
  id: string
  codigo: string
  nombre: string
  direccion: string
  telefono: string
  email: string
  contacto: string
}

export default function LaboratoriosPage() {
  const { toast } = useToast()
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [selectedLabs, setSelectedLabs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentLab, setCurrentLab] = useState<Laboratorio | null>(null)
  const [newLab, setNewLab] = useState<Partial<Laboratorio>>({
    codigo: "",
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    contacto: "",
  })

  // Cargar datos de ejemplo
  useEffect(() => {
    // Simulación de carga de datos
    const mockLabs: Laboratorio[] = [
      {
        id: "1",
        codigo: "LAB001",
        nombre: "Laboratorios Farma",
        direccion: "Av. Principal 123",
        telefono: "01-234-5678",
        email: "contacto@farma.com",
        contacto: "Juan Pérez",
      },
      {
        id: "2",
        codigo: "LAB002",
        nombre: "Genfar Perú",
        direccion: "Jr. Industria 456",
        telefono: "01-987-6543",
        email: "ventas@genfar.com",
        contacto: "María López",
      },
      {
        id: "3",
        codigo: "LAB003",
        nombre: "Bayer S.A.",
        direccion: "Calle Comercio 789",
        telefono: "01-555-1234",
        email: "info@bayer.com.pe",
        contacto: "Carlos Rodríguez",
      },
      {
        id: "4",
        codigo: "LAB004",
        nombre: "Medical Supplies",
        direccion: "Av. Salaverry 1010",
        telefono: "01-333-7777",
        email: "ventas@medicalsupplies.com",
        contacto: "Ana Torres",
      },
      {
        id: "5",
        codigo: "LAB005",
        nombre: "Farmaindustria",
        direccion: "Jr. Huallaga 222",
        telefono: "01-444-8888",
        email: "contacto@farmaindustria.com.pe",
        contacto: "Pedro Gómez",
      },
    ]
    setLaboratorios(mockLabs)
  }, [])

  // Filtrar laboratorios según la búsqueda
  const filteredLabs = laboratorios.filter(
    (lab) =>
      lab.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.contacto.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Manejar selección de laboratorios
  const handleSelectLab = (labId: string) => {
    setSelectedLabs((prev) => {
      if (prev.includes(labId)) {
        return prev.filter((id) => id !== labId)
      } else {
        return [...prev, labId]
      }
    })
  }

  // Seleccionar o deseleccionar todos
  const handleSelectAll = () => {
    if (selectedLabs.length === filteredLabs.length) {
      setSelectedLabs([])
    } else {
      setSelectedLabs(filteredLabs.map((lab) => lab.id))
    }
  }

  // Abrir diálogo de edición
  const handleEdit = () => {
    if (selectedLabs.length !== 1) {
      toast({
        title: "Selección requerida",
        description: "Seleccione un solo laboratorio para editar",
        variant: "destructive",
      })
      return
    }

    const labToEdit = laboratorios.find((lab) => lab.id === selectedLabs[0])
    if (labToEdit) {
      setCurrentLab(labToEdit)
      setIsEditDialogOpen(true)
    }
  }

  // Abrir diálogo de eliminación
  const handleDelete = () => {
    if (selectedLabs.length === 0) {
      toast({
        title: "Selección requerida",
        description: "Seleccione al menos un laboratorio para eliminar",
        variant: "destructive",
      })
      return
    }
    setIsDeleteDialogOpen(true)
  }

  // Confirmar eliminación
  const confirmDelete = () => {
    setLaboratorios((prev) => prev.filter((lab) => !selectedLabs.includes(lab.id)))
    setSelectedLabs([])
    setIsDeleteDialogOpen(false)
    toast({
      title: "Laboratorios eliminados",
      description: `Se han eliminado ${selectedLabs.length} laboratorios correctamente`,
    })
  }

  // Guardar nuevo laboratorio
  const saveNewLab = () => {
    if (!newLab.codigo || !newLab.nombre) {
      toast({
        title: "Datos incompletos",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      })
      return
    }

    const newId = (laboratorios.length + 1).toString()
    const labToAdd: Laboratorio = {
      id: newId,
      codigo: newLab.codigo || "",
      nombre: newLab.nombre || "",
      direccion: newLab.direccion || "",
      telefono: newLab.telefono || "",
      email: newLab.email || "",
      contacto: newLab.contacto || "",
    }

    setLaboratorios((prev) => [...prev, labToAdd])
    setNewLab({
      codigo: "",
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      contacto: "",
    })
    setIsNewDialogOpen(false)
    toast({
      title: "Laboratorio creado",
      description: "El laboratorio ha sido creado correctamente",
    })
  }

  // Guardar laboratorio editado
  const saveEditedLab = () => {
    if (!currentLab || !currentLab.codigo || !currentLab.nombre) {
      toast({
        title: "Datos incompletos",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setLaboratorios((prev) => prev.map((lab) => (lab.id === currentLab.id ? currentLab : lab)))
    setCurrentLab(null)
    setIsEditDialogOpen(false)
    toast({
      title: "Laboratorio actualizado",
      description: "El laboratorio ha sido actualizado correctamente",
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
      <TableToolbar
        title="Gestión de Laboratorios"
        onNew={() => setIsNewDialogOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPrint={handlePrint}
        onExport={handleExport}
        onSearch={setSearchQuery}
        disableEdit={selectedLabs.length !== 1}
        disableDelete={selectedLabs.length === 0}
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedLabs.length === filteredLabs.length && filteredLabs.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contacto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLabs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No se encontraron laboratorios
                </TableCell>
              </TableRow>
            ) : (
              filteredLabs.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLabs.includes(lab.id)}
                      onCheckedChange={() => handleSelectLab(lab.id)}
                      aria-label={`Seleccionar ${lab.nombre}`}
                    />
                  </TableCell>
                  <TableCell>{lab.codigo}</TableCell>
                  <TableCell>{lab.nombre}</TableCell>
                  <TableCell>{lab.direccion}</TableCell>
                  <TableCell>{lab.telefono}</TableCell>
                  <TableCell>{lab.email}</TableCell>
                  <TableCell>{lab.contacto}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para nuevo laboratorio */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Laboratorio</DialogTitle>
            <DialogDescription>
              Complete la información del nuevo laboratorio. Los campos con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigo" className="text-right">
                Código *
              </Label>
              <Input
                id="codigo"
                value={newLab.codigo}
                onChange={(e) => setNewLab({ ...newLab, codigo: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre *
              </Label>
              <Input
                id="nombre"
                value={newLab.nombre}
                onChange={(e) => setNewLab({ ...newLab, nombre: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={newLab.direccion}
                onChange={(e) => setNewLab({ ...newLab, direccion: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={newLab.telefono}
                onChange={(e) => setNewLab({ ...newLab, telefono: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newLab.email}
                onChange={(e) => setNewLab({ ...newLab, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contacto" className="text-right">
                Contacto
              </Label>
              <Input
                id="contacto"
                value={newLab.contacto}
                onChange={(e) => setNewLab({ ...newLab, contacto: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNewLab}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar laboratorio */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Laboratorio</DialogTitle>
            <DialogDescription>
              Modifique la información del laboratorio. Los campos con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          {currentLab && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-codigo" className="text-right">
                  Código *
                </Label>
                <Input
                  id="edit-codigo"
                  value={currentLab.codigo}
                  onChange={(e) => setCurrentLab({ ...currentLab, codigo: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre *
                </Label>
                <Input
                  id="edit-nombre"
                  value={currentLab.nombre}
                  onChange={(e) => setCurrentLab({ ...currentLab, nombre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-direccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="edit-direccion"
                  value={currentLab.direccion}
                  onChange={(e) => setCurrentLab({ ...currentLab, direccion: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-telefono"
                  value={currentLab.telefono}
                  onChange={(e) => setCurrentLab({ ...currentLab, telefono: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentLab.email}
                  onChange={(e) => setCurrentLab({ ...currentLab, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contacto" className="text-right">
                  Contacto
                </Label>
                <Input
                  id="edit-contacto"
                  value={currentLab.contacto}
                  onChange={(e) => setCurrentLab({ ...currentLab, contacto: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedLab}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar {selectedLabs.length}{" "}
              {selectedLabs.length === 1 ? "laboratorio" : "laboratorios"}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

