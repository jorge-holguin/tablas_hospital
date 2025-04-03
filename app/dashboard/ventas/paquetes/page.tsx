"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, FileSpreadsheet, Filter, Plus, RefreshCw, Save, Search, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

// Datos de ejemplo para paquetes
const paquetesData = [
  { id: 1, codigo: "43", tiposet: "GINECOLOGIA", nombre: "SET DE PARTO- PRIMIPARA actual 2024" },
  { id: 2, codigo: "44", tiposet: "NEONATOLOGIA", nombre: "KIT RN- POR PARTO EUTOCICO actualizado 2024" },
  { id: 3, codigo: "45", tiposet: "GINECOLOGIA", nombre: "SET DE PARTO MULTIPARA - actualizado 2024" },
  { id: 4, codigo: "49", tiposet: "NEONATOLOGIA", nombre: "KIT RN- POR PARTO (DISTOCICO)actualizado 2024" },
  { id: 5, codigo: "53", tiposet: "GINECOLOGIA", nombre: "SET QUISTECTOMIA actualizado 2024" },
  { id: 6, codigo: "55", tiposet: "GINECOLOGIA", nombre: "SET DE CESAREA actualizado 2024" },
  { id: 7, codigo: "56", tiposet: "GINECO OBSTETRI", nombre: "SET LAPARATOMIA: EMB.ECT 2024" },
  { id: 8, codigo: "57", tiposet: "CIRUGIA", nombre: "INCISIÓN Y DRENAJE (ANESTECIA LOCAL)" },
  { id: 9, codigo: "72376", tiposet: "RAYOSX", nombre: "RX, MESURACION (PELVIS, RODILLA Y TOBILLO)" },
  { id: 10, codigo: "99238", tiposet: "GINECOLOGIA", nombre: "KIT DE VIOLENCIA SEXUAL ADULTO 2024" },
  { id: 11, codigo: "99239", tiposet: "Gineco Obstetric", nombre: "SET BTB INTERVALO" },
  { id: 12, codigo: "99240", tiposet: "GINECOLOGIA", nombre: "SET FIBROADENOMA DE MAMA - 2024" },
  { id: 13, codigo: "99241", tiposet: "GINECOLOGIA", nombre: "SET DE COLPOPLASTIA - 2024" },
  { id: 14, codigo: "99243", tiposet: "GINECOLOGIA", nombre: "SET DE VASECTOMIA" },
  { id: 15, codigo: "99244", tiposet: "CIRUGIA", nombre: "CATETERISMO VESICAL" },
  { id: 16, codigo: "99245", tiposet: "CIRUGIA", nombre: "APENDICECTOMIA LAPAROSCOPICA" },
  { id: 17, codigo: "99246", tiposet: "CIRUGIA", nombre: "APENDICECTOMIA CONVENCIONAL" },
  { id: 18, codigo: "99247", tiposet: "CIRUGIA", nombre: "COLECISTECTOMIA CONVENCIONAL" },
  { id: 19, codigo: "99248", tiposet: "CIRUGIA", nombre: "HERNIOPLASTIA INGUINAL" },
  { id: 20, codigo: "99249", tiposet: "CIRUGIA", nombre: "COLECISTECTOMIA LAPAROSCOPICA" },
  { id: 21, codigo: "99250", tiposet: "GASTROENTEROLOG", nombre: "SET PARA ENDOSCOPIA DIGESTIVA ALTA" },
]

// Datos de ejemplo para items de un paquete
const itemsPaqueteData = [
  { id: 1, codigo: "170608", nombre: "SODIO CLORURO (1 L) 900 MG/100 ML (0.9 %)", cantidad: 2 },
  { id: 2, codigo: "171243", nombre: "CATETER 18 G X 1 1/4 (S)", cantidad: 1 },
  { id: 3, codigo: "171240", nombre: "APOSITO TRANS. ADH. 6 CM X 7 CM (S)", cantidad: 1 },
  { id: 4, codigo: "170791", nombre: "GUANTE QUIRURG. Nº 6 1/2", cantidad: 4 },
  { id: 5, codigo: "170716", nombre: "CATGUT CROMICO 2/0 MR 40", cantidad: 2 },
  { id: 6, codigo: "170061", nombre: "LIDOCAINA CLORH. (SP) 2 G/100 ML (2 %) 20 ML", cantidad: 1 },
  { id: 7, codigo: "170813", nombre: "JERINGA 10 ML CON AGUJA 21G X 1 1/2", cantidad: 2 },
  { id: 8, codigo: "170822", nombre: "JERINGA 5 ML CON AGUJA 21 G X 1 1/2 (S)", cantidad: 2 },
  { id: 9, codigo: "170093", nombre: "IBUPROFENO 400 MG TAB", cantidad: 3 },
  { id: 10, codigo: "170549", nombre: "OXITOCINA 10 UI 1 mL", cantidad: 3 },
  { id: 11, codigo: "170792", nombre: "GUANTE QUIRURG. Nº 7 (S)", cantidad: 2 },
  { id: 12, codigo: "170764", nombre: "EQUIPO DE VENOCLISIS CON FILTRO (S)", cantidad: 1 },
]

// Datos de ejemplo para items disponibles
const itemsDisponiblesData = [
  {
    id: 1,
    codigo: "MED001",
    nombre: "(P.S/M) CLOZAPINA 100 MG",
    presentacion: "TAB",
    precio: 0.17,
    costo: 0.17,
    stock: 103,
  },
  {
    id: 2,
    codigo: "MED002",
    nombre: "(P.S/M) CIPROFLOXACINA (COMO MALEATO) 100 mg",
    presentacion: "TAB",
    precio: 1.84,
    costo: 1.84,
    stock: 433,
  },
  {
    id: 3,
    codigo: "MED003",
    nombre: "(P.S/M) METILFENIDATO CLORHIDRATO 10 mg",
    presentacion: "TAB",
    precio: 0.73,
    costo: 0.73,
    stock: 30,
  },
  {
    id: 4,
    codigo: "MED004",
    nombre: "(P.S/M) SULPIRIDA 200 mg",
    presentacion: "TAB",
    precio: 0.48,
    costo: 0.48,
    stock: 426,
  },
  {
    id: 5,
    codigo: "MED005",
    nombre: "AC. POLIGLACTIN 1 MR 30 (S)",
    presentacion: "UNI",
    precio: 5.99,
    costo: 4.8,
    stock: 32,
  },
  {
    id: 6,
    codigo: "MED006",
    nombre: "AC. POLIGLACTIN 1 MR 35",
    presentacion: "UNI",
    precio: 6.28,
    costo: 5.03,
    stock: 32,
  },
  {
    id: 7,
    codigo: "MED007",
    nombre: "AC. POLIGLACTIN 1 MR 40 MM",
    presentacion: "UNI",
    precio: 6.28,
    costo: 5.03,
    stock: 38,
  },
  {
    id: 8,
    codigo: "MED008",
    nombre: "AC.POLIGLACTIN 3/0 MR 20 MM X 70 CM",
    presentacion: "UNI",
    precio: 4.99,
    costo: 4.0,
    stock: 17,
  },
  {
    id: 9,
    codigo: "MED009",
    nombre: "AC.POLIGLACTIN 3/0 MR 25 MM (S)",
    presentacion: "UNI",
    precio: 9.24,
    costo: 7.4,
    stock: 47,
  },
  {
    id: 10,
    codigo: "MED010",
    nombre: "ACETAZOLAMIDA 250 MG TAB",
    presentacion: "TAB",
    precio: 0.46,
    costo: 0.37,
    stock: 85,
  },
]

export default function PaquetesPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"add" | "edit" | "delete" | "addItem">("add")
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPaquetes, setFilteredPaquetes] = useState(paquetesData)
  const [selectedPaquete, setSelectedPaquete] = useState<any>(null)
  const [paqueteItems, setPaqueteItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [cantidad, setCantidad] = useState(1)
  const [filteredItems, setFilteredItems] = useState(itemsDisponiblesData)
  const [itemSearchTerm, setItemSearchTerm] = useState("")

  // Filtrar paquetes basado en búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = paquetesData.filter(
        (paquete) =>
          paquete.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paquete.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paquete.tiposet.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPaquetes(filtered)
    } else {
      setFilteredPaquetes(paquetesData)
    }
  }, [searchTerm])

  // Filtrar items basado en búsqueda
  useEffect(() => {
    if (itemSearchTerm) {
      const filtered = itemsDisponiblesData.filter(
        (item) =>
          item.nombre.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
          item.codigo.toLowerCase().includes(itemSearchTerm.toLowerCase()),
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(itemsDisponiblesData)
    }
  }, [itemSearchTerm])

  const handleAddPaquete = () => {
    setDialogType("add")
    setSelectedPaquete(null)
    setOpenDialog(true)
  }

  const handleEditPaquete = (paquete: any) => {
    setDialogType("edit")
    setSelectedPaquete(paquete)
    setOpenDialog(true)
  }

  const handleDeletePaquete = (paquete: any) => {
    setDialogType("delete")
    setSelectedPaquete(paquete)
    setOpenDialog(true)
  }

  const handleSelectPaquete = (paquete: any) => {
    setSelectedPaquete(paquete)
    // En un caso real, aquí cargaríamos los items del paquete desde la API
    setPaqueteItems(itemsPaqueteData)
  }

  const handleAddItem = () => {
    setDialogType("addItem")
    setSelectedItem(null)
    setCantidad(1)
    setOpenDialog(true)
  }

  const handleSelectItem = (item: any) => {
    setSelectedItem(item)
    setCantidad(1)
  }

  const handleConfirmAddItem = () => {
    if (selectedItem && cantidad > 0) {
      const newItem = {
        id: paqueteItems.length + 1,
        codigo: selectedItem.codigo,
        nombre: selectedItem.nombre,
        cantidad: cantidad,
      }

      setPaqueteItems([...paqueteItems, newItem])
      setSelectedItem(null)
      setCantidad(1)
      setOpenDialog(false)
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...paqueteItems]
    newItems.splice(index, 1)
    setPaqueteItems(newItems)
  }

  const handleSavePaquete = () => {
    // Aquí iría la lógica para guardar el paquete
    alert("Paquete guardado correctamente")
  }

  const renderDialogContent = () => {
    if (dialogType === "delete") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar este paquete? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Aquí iría la lógica para eliminar el paquete
                setOpenDialog(false)
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </>
      )
    }

    if (dialogType === "addItem") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Agregar Item al Paquete</DialogTitle>
            <DialogDescription>Busque y seleccione un item para agregar al paquete</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código..."
                className="pl-8"
                value={itemSearchTerm}
                onChange={(e) => setItemSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Presentación</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className={`cursor-pointer hover:bg-muted/50 ${selectedItem?.id === item.id ? "bg-primary/10" : ""}`}
                        onClick={() => handleSelectItem(item)}
                      >
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>{item.presentacion}</TableCell>
                        <TableCell className="text-right">{item.stock}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectItem(item)
                            }}
                          >
                            Seleccionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No se encontraron items
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {selectedItem && (
              <div className="mt-4 p-4 border rounded-md bg-muted/30">
                <div className="font-medium mb-2">Item seleccionado: {selectedItem.nombre}</div>
                <div className="flex items-end gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad:</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmAddItem} disabled={!selectedItem}>
              Agregar al Paquete
            </Button>
          </DialogFooter>
        </>
      )
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>{dialogType === "add" ? "Crear nuevo paquete" : "Editar paquete"}</DialogTitle>
          <DialogDescription>
            Complete los campos para {dialogType === "add" ? "crear un nuevo" : "actualizar el"} paquete.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input id="codigo" defaultValue={selectedPaquete?.codigo || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiposet">Tipo</Label>
              <Select defaultValue={selectedPaquete?.tiposet || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GINECOLOGIA">GINECOLOGIA</SelectItem>
                  <SelectItem value="NEONATOLOGIA">NEONATOLOGIA</SelectItem>
                  <SelectItem value="CIRUGIA">CIRUGIA</SelectItem>
                  <SelectItem value="RAYOSX">RAYOSX</SelectItem>
                  <SelectItem value="GASTROENTEROLOG">GASTROENTEROLOG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" defaultValue={selectedPaquete?.nombre || ""} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              // Aquí iría la lógica para guardar el paquete
              setOpenDialog(false)
            }}
          >
            {dialogType === "add" ? "Crear" : "Guardar"}
          </Button>
        </DialogFooter>
      </>
    )
  }

  const renderFilterContent = () => {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-tipo">Tipo</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="GINECOLOGIA">GINECOLOGIA</SelectItem>
                <SelectItem value="NEONATOLOGIA">NEONATOLOGIA</SelectItem>
                <SelectItem value="CIRUGIA">CIRUGIA</SelectItem>
                <SelectItem value="RAYOSX">RAYOSX</SelectItem>
                <SelectItem value="GASTROENTEROLOG">GASTROENTEROLOG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-estado">Estado</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowFilters(false)}>
            Cancelar
          </Button>
          <Button>Aplicar Filtros</Button>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Armado de Paquetes</h1>
          <p className="text-muted-foreground text-sm">Configuración y gestión de paquetes de productos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/ventas">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-1" size="sm" onClick={handleAddPaquete}>
            <Plus className="h-4 w-4" />
            Nuevo Paquete
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paquete..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-4">
          <CardContent className="pt-6">{renderFilterContent()}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md">
          <div className="bg-muted p-2 font-medium">Paquetes Disponibles</div>
          <div className="overflow-y-auto max-h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPaquetes.length > 0 ? (
                  filteredPaquetes.map((paquete) => (
                    <TableRow
                      key={paquete.id}
                      className={`cursor-pointer hover:bg-muted/50 ${selectedPaquete?.id === paquete.id ? "bg-primary/10" : ""}`}
                      onClick={() => handleSelectPaquete(paquete)}
                    >
                      <TableCell className="font-medium">{paquete.codigo}</TableCell>
                      <TableCell>{paquete.tiposet}</TableCell>
                      <TableCell>{paquete.nombre}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditPaquete(paquete)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeletePaquete(paquete)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No se encontraron paquetes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border rounded-md">
          <div className="bg-muted p-2 font-medium flex justify-between items-center">
            <span>Items del Paquete {selectedPaquete ? `- ${selectedPaquete.nombre}` : ""}</span>
            {selectedPaquete && (
              <Button size="sm" variant="outline" className="gap-1" onClick={handleAddItem}>
                <Plus className="h-4 w-4" />
                Agregar Item
              </Button>
            )}
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPaquete ? (
                  paqueteItems.length > 0 ? (
                    paqueteItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell className="text-right">{item.cantidad}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No hay items en este paquete
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Seleccione un paquete para ver sus items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedPaquete && (
        <div className="flex justify-end mt-4">
          <Button className="gap-1" onClick={handleSavePaquete}>
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className={dialogType === "addItem" ? "max-w-4xl" : "max-w-md"}>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

