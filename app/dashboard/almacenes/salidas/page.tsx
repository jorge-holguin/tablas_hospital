"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FilePlus,
  FileEdit,
  Trash2,
  BarChart2,
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Search,
  RefreshCw,
  Filter,
} from "lucide-react"

// Datos de ejemplo para la tabla
const salidasData = [
  {
    id: 1,
    estado: 2,
    salidaId: "25000650",
    documento: "PPA-650",
    tipo_nombre: "Salida por Transferencia",
    fecha: "31/03/2025",
    hora: "18:12:07",
    fecha_proceso: "31/03/2025",
    hora_proceso: "18:24:05",
    almacen: "F",
    total: 67.4,
    usuario: "MALVAREZ",
    observacion: "SALIDA POR TRANSFERENCIA",
  },
  {
    id: 2,
    estado: 2,
    salidaId: "25000648",
    documento: "PPA-558",
    tipo_nombre: "Salida por Consumo",
    fecha: "31/03/2025",
    hora: "14:42:24",
    fecha_proceso: "31/03/2025",
    hora_proceso: "14:45:19",
    almacen: "A",
    total: 213.68,
    usuario: "EROMERO",
    observacion: "CAMPAÑA MÉDICA",
  },
  {
    id: 3,
    estado: 2,
    salidaId: "25000647",
    documento: "25000647",
    tipo_nombre: "Salida por Transferencia",
    fecha: "31/03/2025",
    hora: "13:26:28",
    fecha_proceso: "31/03/2025",
    hora_proceso: "13:26:55",
    almacen: "DU",
    total: 224.64,
    usuario: "MARIH",
    observacion: "",
  },
  {
    id: 4,
    estado: 2,
    salidaId: "25000646",
    documento: "PPA-646",
    tipo_nombre: "Salida por Consumo",
    fecha: "31/03/2025",
    hora: "11:19:24",
    fecha_proceso: "31/03/2025",
    hora_proceso: "11:20:45",
    almacen: "A",
    total: 5000,
    usuario: "ECHATE",
    observacion: "REQUERIMIENTO O2",
  },
  {
    id: 5,
    estado: 2,
    salidaId: "25000645",
    documento: "25000645",
    tipo_nombre: "Salida por Transferencia",
    fecha: "31/03/2025",
    hora: "10:18:50",
    fecha_proceso: "31/03/2025",
    hora_proceso: "11:19:12",
    almacen: "DU",
    total: 299.52,
    usuario: "MALVAREZ",
    observacion: "SOBRE STOCK",
  },
]

export default function SalidasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSalida, setSelectedSalida] = useState(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Filtrar datos según término de búsqueda
  const filteredData = salidasData.filter(
    (salida) =>
      salida.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salida.tipo_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salida.observacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar selección individual
  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === filteredData.length) {
        setSelectAll(true)
      }
    }
  }

  // Verificar si hay elementos seleccionados
  const hasSelection = selectedItems.length > 0

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Almacenes</h1>
          <p className="text-muted-foreground">Gestión de almacenes, inventarios y movimientos de productos</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Salidas de Almacén</h2>
        <p className="text-muted-foreground">Gestione las salidas de productos del almacén</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Primera fila: botones principales a la derecha */}
          <div className="flex justify-end mb-4 gap-2">
            <Button variant="outline" className="gap-1">
              <RefreshCw className="h-4 w-4 text-blue-500" />
              Actualizar
            </Button>
            <Button variant="outline" className="gap-1">
              <Printer className="h-4 w-4 text-blue-500" />
              Imprimir
            </Button>
            <Button variant="outline" className="gap-1">
              <FileSpreadsheet className="h-4 w-4 text-blue-500" />
              Excel
            </Button>
            <Button variant="outline" className="gap-1" asChild>
              <Link href="/dashboard/almacenes">
                <ArrowLeft className="h-4 w-4 text-blue-500" />
                Volver
              </Link>
            </Button>
          </div>

          {/* Segunda fila: búsqueda a la izquierda, filtros y botones de acción a la derecha */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por documento, proveedor..."
                className="w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4 text-blue-500" />
                Filtros
              </Button>
              <Button className="gap-1">
                <FilePlus className="h-4 w-4" />
                Nuevo Documento
              </Button>
              <Button variant={hasSelection ? "default" : "outline"} className="gap-1" disabled={!hasSelection}>
                <FileEdit className="h-4 w-4" />
                Editar documento
              </Button>
              <Button variant={hasSelection ? "destructive" : "outline"} className="gap-1" disabled={!hasSelection}>
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
              <Button variant={hasSelection ? "default" : "outline"} className="gap-1" disabled={!hasSelection}>
                <BarChart2 className="h-4 w-4" />
                Procesar Stock
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Seleccionar todos" />
                  </TableHead>
                  <TableHead className="w-12">ESTADO</TableHead>
                  <TableHead>SALIDA ID</TableHead>
                  <TableHead>DOCUMENTO</TableHead>
                  <TableHead>TIPO_NOMBRE</TableHead>
                  <TableHead>FECHA</TableHead>
                  <TableHead>HORA</TableHead>
                  <TableHead>FECHA_PROCESO</TableHead>
                  <TableHead>HORA_PROCESO</TableHead>
                  <TableHead>ALMACEN</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>USUARIO</TableHead>
                  <TableHead>OBSERVACION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center h-24">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((salida) => (
                    <TableRow
                      key={salida.id}
                      className={selectedSalida === salida.id ? "bg-primary/10" : ""}
                      onClick={() => setSelectedSalida(salida.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.includes(salida.id)}
                          onCheckedChange={() => handleSelectItem(salida.id)}
                          aria-label={`Seleccionar salida ${salida.salidaId}`}
                        />
                      </TableCell>
                      <TableCell>{salida.estado}</TableCell>
                      <TableCell>{salida.salidaId}</TableCell>
                      <TableCell>{salida.documento}</TableCell>
                      <TableCell>{salida.tipo_nombre}</TableCell>
                      <TableCell>{salida.fecha}</TableCell>
                      <TableCell>{salida.hora}</TableCell>
                      <TableCell>{salida.fecha_proceso}</TableCell>
                      <TableCell>{salida.hora_proceso}</TableCell>
                      <TableCell>{salida.almacen}</TableCell>
                      <TableCell>{salida.total.toFixed(2)}</TableCell>
                      <TableCell>{salida.usuario}</TableCell>
                      <TableCell>{salida.observacion}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

