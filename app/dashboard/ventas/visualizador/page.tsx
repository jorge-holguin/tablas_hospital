"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileSpreadsheet, Filter, Info, Printer, RefreshCw, Search, X } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos de ejemplo para proformas
const proformasData = [
  {
    id: 1,
    ordenId: "1725050781",
    num_recibo: "25004859",
    fecha: "28/03/2025",
    hora: "10:45:43",
    historia: "21101211",
    nombre: "MOLINA GONZALES MOISES BERNARDO",
    tipo: "SIS",
    nombre_tipo: "ODSIS UNITARIA",
    subtotal: 1.71,
    descuento: 0.0,
    total: 1.71,
    cuenta: "2712789",
    seguro: "SIS",
    nombre_medico: "ARCADA LUAN GREGORIO",
    consultorio: "2090",
    nombre_consultorio: "CIRUGIA HOSPITALIZACIÓN",
    tipo_atencion: "0",
    nombre_tipo_atencion: "Ninguno",
    usuario: "MCHUYES",
    fecha_proceso: "28/03/2025",
  },
  {
    id: 2,
    ordenId: "1725050780",
    num_recibo: "25004859",
    fecha: "28/03/2025",
    hora: "10:44:46",
    historia: "17657256",
    nombre: "RUIZ FERNANDEZ CESAR ANDRES",
    tipo: "Contado",
    nombre_tipo: "EXTERNOS",
    subtotal: 19.66,
    descuento: 0.0,
    total: 19.66,
    cuenta: "0",
    seguro: "",
    nombre_medico: "PRADO NICHOLE ELISA",
    consultorio: "1011",
    nombre_consultorio: "MEDICINA INTERNA",
    tipo_atencion: "0",
    nombre_tipo_atencion: "Ninguno",
    usuario: "MCHAVES",
    fecha_proceso: "28/03/2025",
  },
  {
    id: 3,
    ordenId: "1725050779",
    num_recibo: "25004859",
    fecha: "28/03/2025",
    hora: "10:39:58",
    historia: "72960665",
    nombre: "GABRIEL OSORIO ANA GABRIELA",
    tipo: "SIS",
    nombre_tipo: "ODSIS UNITARIA",
    subtotal: 1.89,
    descuento: 0.0,
    total: 1.89,
    cuenta: "2712691",
    seguro: "SIS",
    nombre_medico: "ARCADA LUAN GREGORIO",
    consultorio: "2090",
    nombre_consultorio: "CIRUGIA HOSPITALIZACIÓN",
    tipo_atencion: "0",
    nombre_tipo_atencion: "Ninguno",
    usuario: "MCHUYES",
    fecha_proceso: "28/03/2025",
  },
]

// Datos de ejemplo para items de una proforma
const itemsProformaData = [
  {
    id: 1,
    codigo: "170093",
    nombre: "IBUPROFENO 400 MG TAB",
    presentacion: "TAB",
    familia: "Ninguno",
    cantidad: 9,
    costo: 0.15,
    precio: 0.19,
    subtotal: 1.71,
    descuento: 0.0,
    importe: 1.71,
    estado: 3,
    operacion: "2500025577",
    fecha_proceso: "28/03/2025",
    tipo_atencion: "0",
    almacen: "OU",
    usuario: "MCHUYES",
    nombre_paciente: "MOLINA GONZALES MOISES BERNARDO",
    tipo_transaccion: "VD",
    tipo_pago: "R",
    fecha: "28/03/2025",
  },
]

export default function VisualizadorPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"anulacion" | "info">("anulacion")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [userName, setUserName] = useState("JHOLGUIN")
  const [currentDate, setCurrentDate] = useState("")
  const [almacen, setAlmacen] = useState("FARMACIA")
  const periodo = "Marzo 2025"

  // Actualizar fecha
  useEffect(() => {
    const now = new Date()
    const formattedDate = now
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/")

    setCurrentDate(formattedDate)

    // Obtener información del usuario del localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("hospital-user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name || "JHOLGUIN")
      }
    }
  }, [])

  const handleAnularProforma = (item: any) => {
    setDialogType("anulacion")
    setSelectedItem(item)
    setOpenDialog(true)
  }

  const handleInfoProforma = (item: any) => {
    setDialogType("info")
    setSelectedItem(item)
    setOpenDialog(true)
  }

  const handleConfirmAnulacion = () => {
    // Aquí iría la lógica para anular la proforma
    setOpenDialog(false)
  }

  const renderDialogContent = () => {
    if (dialogType === "anulacion") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Anular Proforma</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea anular esta proforma? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo de Anulación</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">Error en datos</SelectItem>
                  <SelectItem value="duplicado">Duplicado</SelectItem>
                  <SelectItem value="cancelacion">Cancelación de pedido</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="observacion">Observación</Label>
              <Input id="observacion" placeholder="Ingrese una observación" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmAnulacion}>
              Anular Proforma
            </Button>
          </DialogFooter>
        </>
      )
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>Información de Anulación</DialogTitle>
          <DialogDescription>Detalles de la anulación de la proforma</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Proforma:</div>
              <div className="text-sm">PRF-001</div>
              <div className="text-sm font-medium">Fecha de Anulación:</div>
              <div className="text-sm">28/03/2025 11:30:45</div>
              <div className="text-sm font-medium">Usuario:</div>
              <div className="text-sm">JHOLGUIN</div>
              <div className="text-sm font-medium">Motivo:</div>
              <div className="text-sm">Error en datos</div>
              <div className="text-sm font-medium">Observación:</div>
              <div className="text-sm">Se ingresó un precio incorrecto</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogFooter>
      </>
    )
  }

  const renderFilterContent = () => {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-fecha-desde">Fecha Desde</Label>
            <Input id="filter-fecha-desde" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-fecha-hasta">Fecha Hasta</Label>
            <Input id="filter-fecha-hasta" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-tipo">Tipo</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Contado">Contado</SelectItem>
                <SelectItem value="SIS">SIS</SelectItem>
                <SelectItem value="Crédito">Crédito</SelectItem>
                <SelectItem value="Exonerado">Exonerado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-usuario">Usuario</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos los usuarios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="MCHUYES">MCHUYES</SelectItem>
                <SelectItem value="GROJAS">GROJAS</SelectItem>
                <SelectItem value="ECHANAME">ECHANAME</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-medico">Médico</Label>
            <Input id="filter-medico" placeholder="Filtrar por médico" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-paciente">Paciente</Label>
            <Input id="filter-paciente" placeholder="Filtrar por paciente" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-documento">Documento</Label>
            <Input id="filter-documento" placeholder="Filtrar por documento" />
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
                <SelectItem value="anulado">Anulado</SelectItem>
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
          <h1 className="text-2xl font-bold tracking-tight">Visualizador de Proformas Emitidas</h1>
          <p className="text-muted-foreground text-sm">Consulta y gestión de proformas emitidas</p>
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
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Información de usuario, fecha, almacén y periodo */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md flex flex-wrap justify-between">
        <div>
          Usuario: <span className="font-medium">{userName}</span>
        </div>
        <div>
          Fecha: <span className="font-medium">{currentDate}</span>
        </div>
        <div>
          Almacén: <span className="font-medium">{almacen}</span>
        </div>
        <div>
          Periodo: <span className="font-medium">{periodo}</span>
        </div>
      </div>

      <Tabs defaultValue="proformas">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="proformas">Proformas</TabsTrigger>
          <TabsTrigger value="detalle">Detalle de Items</TabsTrigger>
        </TabsList>

        <div className="flex items-center py-4 justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por paciente, documento..." className="w-full pl-8" />
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

        <TabsContent value="proformas" className="border rounded-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>OrdenId</TableHead>
                  <TableHead>Num. Recibo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Historia</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Seguro</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Consultorio</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha Proceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proformasData.map((proforma) => (
                  <TableRow key={proforma.id}>
                    <TableCell className="font-medium">{proforma.ordenId}</TableCell>
                    <TableCell>{proforma.num_recibo}</TableCell>
                    <TableCell>{proforma.fecha}</TableCell>
                    <TableCell>{proforma.hora}</TableCell>
                    <TableCell>{proforma.historia}</TableCell>
                    <TableCell>{proforma.nombre}</TableCell>
                    <TableCell>{proforma.tipo}</TableCell>
                    <TableCell>{proforma.subtotal.toFixed(2)}</TableCell>
                    <TableCell>{proforma.descuento.toFixed(2)}</TableCell>
                    <TableCell>{proforma.total.toFixed(2)}</TableCell>
                    <TableCell>{proforma.cuenta}</TableCell>
                    <TableCell>{proforma.seguro}</TableCell>
                    <TableCell>{proforma.nombre_medico}</TableCell>
                    <TableCell>{proforma.nombre_consultorio}</TableCell>
                    <TableCell>{proforma.usuario}</TableCell>
                    <TableCell>{proforma.fecha_proceso}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Imprimir">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Anular"
                          onClick={() => handleAnularProforma(proforma)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Info Anulación"
                          onClick={() => handleInfoProforma(proforma)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="detalle" className="border rounded-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Presentación</TableHead>
                  <TableHead>Familia</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead>Fecha Proceso</TableHead>
                  <TableHead>Tipo Atención</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Nombre Paciente</TableHead>
                  <TableHead>Tipo Transacción</TableHead>
                  <TableHead>Tipo Pago</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsProformaData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.codigo}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.presentacion}</TableCell>
                    <TableCell>{item.familia}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>{item.costo.toFixed(2)}</TableCell>
                    <TableCell>{item.precio.toFixed(2)}</TableCell>
                    <TableCell>{item.subtotal.toFixed(2)}</TableCell>
                    <TableCell>{item.descuento.toFixed(2)}</TableCell>
                    <TableCell>{item.importe.toFixed(2)}</TableCell>
                    <TableCell>{item.estado}</TableCell>
                    <TableCell>{item.operacion}</TableCell>
                    <TableCell>{item.fecha_proceso}</TableCell>
                    <TableCell>{item.tipo_atencion}</TableCell>
                    <TableCell>{item.almacen}</TableCell>
                    <TableCell>{item.usuario}</TableCell>
                    <TableCell>{item.nombre_paciente}</TableCell>
                    <TableCell>{item.tipo_transaccion}</TableCell>
                    <TableCell>{item.tipo_pago}</TableCell>
                    <TableCell>{item.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">{renderDialogContent()}</DialogContent>
      </Dialog>
    </div>
  )
}

