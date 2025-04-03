"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileSpreadsheet, Plus, Pencil, Trash, Search, RefreshCw } from "lucide-react"
import Link from "next/link"

// Tipos
interface Consultorio {
  id: string
  nombre: string
  abreviatura: string
  especialidad: string
  tipo: string
  rol: string
  muestraRol: string
  cc1: string
  cc2: string
  cc3: string
  activo: boolean
  orden: number
  numero: string
  cupo: number
  codEsp: string
  nomEsp: string
  hisEspec: string
}

export default function ConsultoriosPage() {
  // Estado para los consultorios
  const [consultorios, setConsultorios] = useState<Consultorio[]>([
    {
      id: "10",
      nombre: "MEDICINA",
      abreviatura: "MEDICINA",
      especialidad: "0",
      tipo: "S",
      rol: "1",
      muestraRol: "0",
      cc1: "",
      cc2: "",
      cc3: "",
      activo: true,
      orden: 1,
      numero: "192",
      cupo: 20,
      codEsp: "10",
      nomEsp: "MEDICINA",
      hisEspec: "1",
    },
    {
      id: "1011",
      nombre: "MEDICINA INTERNA 1",
      abreviatura: "MEDINTER1",
      especialidad: "0001",
      tipo: "C",
      rol: "0",
      muestraRol: "1",
      cc1: "",
      cc2: "",
      cc3: "",
      activo: true,
      orden: 1,
      numero: "01",
      cupo: 20,
      codEsp: "10",
      nomEsp: "MEDICINA",
      hisEspec: "1",
    },
    {
      id: "1012",
      nombre: "MEDICINA INTERNA 2",
      abreviatura: "MEDINTER2",
      especialidad: "0001",
      tipo: "C",
      rol: "0",
      muestraRol: "1",
      cc1: "",
      cc2: "",
      cc3: "",
      activo: true,
      orden: 1,
      numero: "29",
      cupo: 20,
      codEsp: "10",
      nomEsp: "MEDICINA",
      hisEspec: "1",
    },
    {
      id: "20",
      nombre: "CIRUGIA",
      abreviatura: "CIRUGIA",
      especialidad: "0",
      tipo: "S",
      rol: "1",
      muestraRol: "0",
      cc1: "",
      cc2: "",
      cc3: "",
      activo: true,
      orden: 1,
      numero: "193",
      cupo: 0,
      codEsp: "20",
      nomEsp: "CIRUGIA",
      hisEspec: "2",
    },
    {
      id: "2026",
      nombre: "CIRUGIA PEDIATRICA",
      abreviatura: "CIRPED",
      especialidad: "0011",
      tipo: "C",
      rol: "0",
      muestraRol: "1",
      cc1: "",
      cc2: "",
      cc3: "",
      activo: true,
      orden: 1,
      numero: "92",
      cupo: 16,
      codEsp: "20",
      nomEsp: "CIRUGIA",
      hisEspec: "2",
    },
  ])

  // Estado para el filtro de búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para el consultorio seleccionado para editar
  const [selectedConsultorio, setSelectedConsultorio] = useState<Consultorio | null>(null)

  // Estado para el diálogo
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")

  // Filtrar consultorios según el término de búsqueda
  const filteredConsultorios = consultorios.filter(
    (consultorio) =>
      consultorio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultorio.abreviatura.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para abrir el diálogo de agregar
  const handleAddClick = () => {
    setDialogMode("add")
    setSelectedConsultorio({
      id: "",
      nombre: "",
      abreviatura: "",
      especialidad: "0",
      tipo: "C",
      rol: "0",
      muestraRol: "0",
      cc1: "",
      cc2: "",
      cc3: "",
      activo: true,
      orden: 1,
      numero: "",
      cupo: 0,
      codEsp: "",
      nomEsp: "",
      hisEspec: "1",
    })
    setDialogOpen(true)
  }

  // Función para abrir el diálogo de edición
  const handleEditClick = (consultorio: Consultorio) => {
    setDialogMode("edit")
    setSelectedConsultorio(consultorio)
    setDialogOpen(true)
  }

  // Función para eliminar un consultorio
  const handleDeleteClick = (id: string) => {
    if (window.confirm("¿Está seguro que desea eliminar este consultorio?")) {
      setConsultorios(consultorios.filter((c) => c.id !== id))
    }
  }

  // Función para guardar un consultorio (agregar o editar)
  const handleSaveConsultorio = () => {
    if (!selectedConsultorio) return

    if (dialogMode === "add") {
      // Generar un ID único
      const newId = Math.max(...consultorios.map((c) => Number.parseInt(c.id)), 0) + 1
      setConsultorios([...consultorios, { ...selectedConsultorio, id: newId.toString() }])
    } else {
      setConsultorios(consultorios.map((c) => (c.id === selectedConsultorio.id ? selectedConsultorio : c)))
    }

    setDialogOpen(false)
  }

  // Función para exportar a Excel
  const handleExportExcel = () => {
    alert("Exportando a Excel...")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Consultorios</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/tablas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o abreviatura..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setSearchTerm("")}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Abreviatura</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Cupo</TableHead>
              <TableHead>Cod. Esp.</TableHead>
              <TableHead>Nom. Esp.</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsultorios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-4">
                  No se encontraron consultorios
                </TableCell>
              </TableRow>
            ) : (
              filteredConsultorios.map((consultorio) => (
                <TableRow key={consultorio.id}>
                  <TableCell>{consultorio.id}</TableCell>
                  <TableCell>{consultorio.nombre}</TableCell>
                  <TableCell>{consultorio.abreviatura}</TableCell>
                  <TableCell>{consultorio.especialidad}</TableCell>
                  <TableCell>{consultorio.tipo}</TableCell>
                  <TableCell>{consultorio.rol}</TableCell>
                  <TableCell>{consultorio.activo ? "Sí" : "No"}</TableCell>
                  <TableCell>{consultorio.orden}</TableCell>
                  <TableCell>{consultorio.numero}</TableCell>
                  <TableCell>{consultorio.cupo}</TableCell>
                  <TableCell>{consultorio.codEsp}</TableCell>
                  <TableCell>{consultorio.nomEsp}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(consultorio)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(consultorio.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Agregar Consultorio" : "Editar Consultorio"}</DialogTitle>
          </DialogHeader>
          {selectedConsultorio && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={selectedConsultorio.nombre}
                  onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abreviatura">Abreviatura</Label>
                <Input
                  id="abreviatura"
                  value={selectedConsultorio.abreviatura}
                  onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio, abreviatura: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input
                  id="especialidad"
                  value={selectedConsultorio.especialidad}
                  onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio, especialidad: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={selectedConsultorio.tipo}
                  onValueChange={(value) => setSelectedConsultorio({ ...selectedConsultorio, tipo: value })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="H">H</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select
                  value={selectedConsultorio.rol}
                  onValueChange={(value) => setSelectedConsultorio({ ...selectedConsultorio, rol: value })}
                >
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activo">Activo</Label>
                <Select
                  value={selectedConsultorio.activo ? "true" : "false"}
                  onValueChange={(value) =>
                    setSelectedConsultorio({
                      ...selectedConsultorio,
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
                <Label htmlFor="orden">Orden</Label>
                <Input
                  id="orden"
                  type="number"
                  value={selectedConsultorio.orden}
                  onChange={(e) =>
                    setSelectedConsultorio({
                      ...selectedConsultorio,
                      orden: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={selectedConsultorio.numero}
                  onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio, numero: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cupo">Cupo</Label>
                <Input
                  id="cupo"
                  type="number"
                  value={selectedConsultorio.cupo}
                  onChange={(e) =>
                    setSelectedConsultorio({
                      ...selectedConsultorio,
                      cupo: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codEsp">Código Especialidad</Label>
                <Input
                  id="codEsp"
                  value={selectedConsultorio.codEsp}
                  onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio, codEsp: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomEsp">Nombre Especialidad</Label>
                <Input
                  id="nomEsp"
                  value={selectedConsultorio.nomEsp}
                  onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio, nomEsp: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hisEspec">HIS Espec</Label>
                <Input
                  id="hisEspec"
                  value={selectedConsultorio.hisEspec}
                  onChange={(e) => setSelectedConsultorio({ ...selectedConsultorio, hisEspec: e.target.value })}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveConsultorio}>Guardar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

