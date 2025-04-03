"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Datos de ejemplo para la tabla de transferencias
const transferenciasData = [
  {
    id: 1,
    estado: 2,
    transferenciaId: "25000649",
    documento: "25000649",
    fecha: "31/03/2025",
    hora: "18:12:07",
    fecha_proceso: "31/03/2025",
    hora_proceso: "18:24:05",
    deAlmacen: "F",
    aAlmacen: "DU",
    total: 67.4,
    usuario: "MALVAREZ",
    observacion: "TRANSFERENCIA",
  },
  {
    id: 2,
    estado: 2,
    transferenciaId: "25000648",
    documento: "PPA-558",
    fecha: "31/03/2025",
    hora: "14:42:24",
    fecha_proceso: "31/03/2025",
    hora_proceso: "14:45:19",
    deAlmacen: "A",
    aAlmacen: "CE",
    total: 213.68,
    usuario: "EROMERO",
    observacion: "CAMPAÑA MÉDICA",
  },
  {
    id: 3,
    estado: 2,
    transferenciaId: "25000647",
    documento: "25000647",
    fecha: "31/03/2025",
    hora: "13:26:28",
    fecha_proceso: "31/03/2025",
    hora_proceso: "13:26:55",
    deAlmacen: "DU",
    aAlmacen: "F",
    total: 224.64,
    usuario: "MARIH",
    observacion: "",
  },
  {
    id: 4,
    estado: 2,
    transferenciaId: "25000646",
    documento: "PPA-646",
    fecha: "31/03/2025",
    hora: "11:19:24",
    fecha_proceso: "31/03/2025",
    hora_proceso: "11:20:45",
    deAlmacen: "A",
    aAlmacen: "DU",
    total: 5000,
    usuario: "ECHATE",
    observacion: "REQUERIMIENTO O2",
  },
  {
    id: 5,
    estado: 2,
    transferenciaId: "25000645",
    documento: "25000645",
    fecha: "31/03/2025",
    hora: "10:18:50",
    fecha_proceso: "31/03/2025",
    hora_proceso: "11:19:12",
    deAlmacen: "DU",
    aAlmacen: "A",
    total: 299.52,
    usuario: "MALVAREZ",
    observacion: "SOBRE STOCK",
  },
]

// Datos de ejemplo para la tabla de detalles
const detallesData = [
  {
    id: 1,
    item: "170421",
    nombre: "BENZOATO DE BENCILO 25 g/100 mL (25 %) 120 mL",
    presentacion: "LOC",
    cantidad: 4.0,
    precio: 4.16,
    importe: 16.64,
    estado: 2,
    deAlmacen: "A",
    aAlmacen: "CE",
    fecha_proceso: "31/03/2025",
    lote: "",
    fecha_vcto: "31/03/2025",
  },
  {
    id: 2,
    item: "170437",
    nombre: "YODO POVIDONA 10 g/100 mL 125 mL",
    presentacion: "SOL",
    cantidad: 20.0,
    precio: 4.99,
    importe: 99.84,
    estado: 2,
    deAlmacen: "A",
    aAlmacen: "CE",
    fecha_proceso: "31/03/2025",
    lote: "",
    fecha_vcto: "31/03/2025",
  },
  {
    id: 3,
    item: "172544",
    nombre: "(P.DIAB) MONOFILAMENTO DE NAILON 13 cm x 2.5 cm + 4 cm CALIBRADO",
    presentacion: "UNI",
    cantidad: 8.0,
    precio: 12.15,
    importe: 97.2,
    estado: 2,
    deAlmacen: "A",
    aAlmacen: "CE",
    fecha_proceso: "31/03/2025",
    lote: "",
    fecha_vcto: "31/03/2025",
  },
]

export default function TransferenciasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransferencia, setSelectedTransferencia] = useState(null)
  const [activeTab, setActiveTab] = useState("transferencias")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Filtrar datos según término de búsqueda
  const filteredData = transferenciasData.filter(
    (transferencia) =>
      transferencia.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transferencia.observacion.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <h2 className="text-2xl font-bold tracking-tight">Transferencias entre Almacenes</h2>
        <p className="text-muted-foreground">Gestione las transferencias de productos entre almacenes</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transferencias">Transferencias</TabsTrigger>
          <TabsTrigger value="detalles" disabled={!selectedTransferencia}>
            Detalles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transferencias">
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
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          aria-label="Seleccionar todos"
                        />
                      </TableHead>
                      <TableHead className="w-12">ESTADO</TableHead>
                      <TableHead>TRANSFERENCIA ID</TableHead>
                      <TableHead>DOCUMENTO</TableHead>
                      <TableHead>FECHA</TableHead>
                      <TableHead>HORA</TableHead>
                      <TableHead>FECHA_PROCESO</TableHead>
                      <TableHead>HORA_PROCESO</TableHead>
                      <TableHead>DE ALMACEN</TableHead>
                      <TableHead>A ALMACEN</TableHead>
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
                      filteredData.map((transferencia) => (
                        <TableRow
                          key={transferencia.id}
                          className={selectedTransferencia === transferencia.id ? "bg-primary/10" : ""}
                          onClick={() => {
                            setSelectedTransferencia(transferencia.id)
                            setActiveTab("detalles")
                          }}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedItems.includes(transferencia.id)}
                              onCheckedChange={() => handleSelectItem(transferencia.id)}
                              aria-label={`Seleccionar transferencia ${transferencia.transferenciaId}`}
                            />
                          </TableCell>
                          <TableCell>{transferencia.estado}</TableCell>
                          <TableCell>{transferencia.transferenciaId}</TableCell>
                          <TableCell>{transferencia.documento}</TableCell>
                          <TableCell>{transferencia.fecha}</TableCell>
                          <TableCell>{transferencia.hora}</TableCell>
                          <TableCell>{transferencia.fecha_proceso}</TableCell>
                          <TableCell>{transferencia.hora_proceso}</TableCell>
                          <TableCell>{transferencia.deAlmacen}</TableCell>
                          <TableCell>{transferencia.aAlmacen}</TableCell>
                          <TableCell>{transferencia.total.toFixed(2)}</TableCell>
                          <TableCell>{transferencia.usuario}</TableCell>
                          <TableCell>{transferencia.observacion}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalles">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Transferencia</CardTitle>
              <CardDescription>
                Transferencia ID:{" "}
                {selectedTransferencia
                  ? transferenciasData.find((t) => t.id === selectedTransferencia)?.transferenciaId
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ITEM</TableHead>
                      <TableHead>NOMBRE</TableHead>
                      <TableHead>PRESENTACION</TableHead>
                      <TableHead>CANTIDAD</TableHead>
                      <TableHead>PRECIO</TableHead>
                      <TableHead>IMPORTE</TableHead>
                      <TableHead>ESTADO</TableHead>
                      <TableHead>DE ALMACEN</TableHead>
                      <TableHead>A ALMACEN</TableHead>
                      <TableHead>FECHA_PROCESO</TableHead>
                      <TableHead>LOTE</TableHead>
                      <TableHead>FECHA_VCTO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detallesData.map((detalle) => (
                      <TableRow key={detalle.id}>
                        <TableCell>{detalle.item}</TableCell>
                        <TableCell>{detalle.nombre}</TableCell>
                        <TableCell>{detalle.presentacion}</TableCell>
                        <TableCell>{detalle.cantidad.toFixed(2)}</TableCell>
                        <TableCell>{detalle.precio.toFixed(2)}</TableCell>
                        <TableCell>{detalle.importe.toFixed(2)}</TableCell>
                        <TableCell>{detalle.estado}</TableCell>
                        <TableCell>{detalle.deAlmacen}</TableCell>
                        <TableCell>{detalle.aAlmacen}</TableCell>
                        <TableCell>{detalle.fecha_proceso}</TableCell>
                        <TableCell>{detalle.lote}</TableCell>
                        <TableCell>{detalle.fecha_vcto}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setActiveTab("transferencias")}>
                  Volver a Transferencias
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

