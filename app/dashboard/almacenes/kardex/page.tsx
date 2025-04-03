"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileEdit, Printer, FileSpreadsheet, ArrowLeft, Search, RefreshCw, Filter } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para la tabla de items
const itemsData = [
  {
    id: 1,
    item: "172056",
    nombre: "(CENARES) CHAQUETA DESCARTABLE TALLA L",
    presentacion: "UNI",
    stock: 0.0,
    promedio: 0.0,
    ubicacion: 0,
    nombre_ubicacion: "31/12/2025",
    sismed: "32269",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "31/12/2025",
  },
  {
    id: 2,
    item: "172075",
    nombre: "(CENARES) CHAQUETA DESCARTABLE TALLA XL",
    presentacion: "UNI",
    stock: 0.0,
    promedio: 0.0,
    ubicacion: 0,
    nombre_ubicacion: "27/12/2025",
    sismed: "43902",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "27/12/2025",
  },
  {
    id: 3,
    item: "172081",
    nombre: "(CENARES) CHAQUETA DESCARTABLE TALLA XXL",
    presentacion: "UNI",
    stock: 0.0,
    promedio: 0.0,
    ubicacion: 0,
    nombre_ubicacion: "31/03/2025",
    sismed: "44068",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "0",
    fecha_vencimiento: "31/03/2025",
  },
  {
    id: 4,
    item: "172180",
    nombre: "(CENARES) CHAQUETA Y PANTALÓN DESCARTABLE TALLA L",
    presentacion: "UNI",
    stock: 0.0,
    promedio: 0.0,
    ubicacion: 0,
    nombre_ubicacion: "31/12/2026",
    sismed: "25873",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "31/12/2026",
  },
  {
    id: 5,
    item: "172182",
    nombre: "(CENARES) CHAQUETA Y PANTALÓN DESCARTABLE TALLA M",
    presentacion: "UNI",
    stock: 0.0,
    promedio: 0.0,
    ubicacion: 0,
    nombre_ubicacion: "31/12/2026",
    sismed: "25874",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "31/12/2026",
  },
]

// Datos de ejemplo para la tabla de operaciones
const operacionesData = [
  {
    id: 1,
    operacion: "20519482",
    fecha: "08/10/2020 07:01:35",
    tipo: "STR",
    tipo_nombre: "Salida por Transferencia",
    idtransaccion: "172001965",
    stock: 46.0,
    cantidad: 46.0,
    saldo: 0.0,
    precio: 0.06,
    promedio: 0.0,
    laboratorio: "",
    nombre: "",
    marca: "",
    lote: "",
    registro: "",
    fecha_vencimiento: "",
    importe: 2.806,
    usuario: "",
    nombre_paciente: "HERRERA POVIS DIANA",
    estado: 3,
    nombre_med: "LEON ROLDAN",
  },
  {
    id: 2,
    operacion: "20486784",
    fecha: "17/09/2020 08:35:26",
    tipo: "VRS",
    tipo_nombre: "SIS",
    idtransaccion: "172010398",
    stock: 47.0,
    cantidad: 1.0,
    saldo: 46.0,
    precio: 0.06,
    promedio: 0.0,
    laboratorio: "",
    nombre: "",
    marca: "",
    lote: "",
    registro: "",
    fecha_vencimiento: "",
    importe: 0.06,
    usuario: "LGARCIA",
    nombre_paciente: "FERNANDEZ CHAVEZ JUAN",
    estado: 3,
    nombre_med: "ARICA CHAVEZ",
  },
  {
    id: 3,
    operacion: "20484534",
    fecha: "15/09/2020 13:53:51",
    tipo: "VRS",
    tipo_nombre: "SIS",
    idtransaccion: "172010194",
    stock: 48.0,
    cantidad: 1.0,
    saldo: 47.0,
    precio: 0.06,
    promedio: 0.0,
    laboratorio: "",
    nombre: "",
    marca: "",
    lote: "",
    registro: "",
    fecha_vencimiento: "",
    importe: 0.06,
    usuario: "RROJAS",
    nombre_paciente: "FERNANDEZ CHAVEZ JUAN",
    estado: 3,
    nombre_med: "ARICA CHAVEZ",
  },
]

export default function KardexPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeTab, setActiveTab] = useState("items")

  // Filtrar datos según término de búsqueda
  const filteredData = itemsData.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sismed.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Almacenes</h1>
          <p className="text-muted-foreground">Gestión de almacenes, inventarios y movimientos de productos</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Kardex de Almacén</h2>
        <p className="text-muted-foreground">Consulte el historial de movimientos de productos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="operaciones" disabled={!selectedItem}>
            Operaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
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
                  <Button variant="outline" className="gap-1">
                    <FileEdit className="h-4 w-4 text-blue-500" />
                    Editar Stock Mínimo
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ITEM</TableHead>
                      <TableHead>NOMBRE</TableHead>
                      <TableHead>PRESENTACION</TableHead>
                      <TableHead>STOCK</TableHead>
                      <TableHead>PROMEDIO</TableHead>
                      <TableHead>UBICACION</TableHead>
                      <TableHead>NOMBRE_UBICACION</TableHead>
                      <TableHead>SISMED</TableHead>
                      <TableHead>CLASE</TableHead>
                      <TableHead>APLICA_DSCTO</TableHead>
                      <TableHead>TIPO_PROGRAMA</TableHead>
                      <TableHead>FECHA_VENCIMIENTO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center h-24">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow
                          key={item.id}
                          className={selectedItem === item.id ? "bg-primary/10" : ""}
                          onClick={() => {
                            setSelectedItem(item.id)
                            setActiveTab("operaciones")
                          }}
                        >
                          <TableCell>{item.item}</TableCell>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell>{item.presentacion}</TableCell>
                          <TableCell>{item.stock.toFixed(2)}</TableCell>
                          <TableCell>{item.promedio.toFixed(2)}</TableCell>
                          <TableCell>{item.ubicacion}</TableCell>
                          <TableCell>{item.nombre_ubicacion}</TableCell>
                          <TableCell>{item.sismed}</TableCell>
                          <TableCell>{item.clase}</TableCell>
                          <TableCell>{item.aplica_dscto}</TableCell>
                          <TableCell>{item.tipo_programa}</TableCell>
                          <TableCell>{item.fecha_vencimiento}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operaciones">
          <Card>
            <CardHeader>
              <CardTitle>Operaciones del Item</CardTitle>
              <CardDescription>
                Item: {selectedItem ? itemsData.find((i) => i.id === selectedItem)?.nombre : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>OPERACION</TableHead>
                      <TableHead>FECHA</TableHead>
                      <TableHead>TIPO</TableHead>
                      <TableHead>TIPO_NOMBRE</TableHead>
                      <TableHead>IDTRANSACCION</TableHead>
                      <TableHead>STOCK</TableHead>
                      <TableHead>CANTIDAD</TableHead>
                      <TableHead>SALDO</TableHead>
                      <TableHead>PRECIO</TableHead>
                      <TableHead>IMPORTE</TableHead>
                      <TableHead>USUARIO</TableHead>
                      <TableHead>NOMBRE_PACIENTE</TableHead>
                      <TableHead>ESTADO</TableHead>
                      <TableHead>NOMBRE_MED</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operacionesData.map((operacion) => (
                      <TableRow key={operacion.id}>
                        <TableCell>{operacion.operacion}</TableCell>
                        <TableCell>{operacion.fecha}</TableCell>
                        <TableCell>{operacion.tipo}</TableCell>
                        <TableCell>{operacion.tipo_nombre}</TableCell>
                        <TableCell>{operacion.idtransaccion}</TableCell>
                        <TableCell>{operacion.stock.toFixed(2)}</TableCell>
                        <TableCell>{operacion.cantidad.toFixed(2)}</TableCell>
                        <TableCell>{operacion.saldo.toFixed(2)}</TableCell>
                        <TableCell>{operacion.precio.toFixed(4)}</TableCell>
                        <TableCell>{operacion.importe.toFixed(3)}</TableCell>
                        <TableCell>{operacion.usuario}</TableCell>
                        <TableCell>{operacion.nombre_paciente}</TableCell>
                        <TableCell>{operacion.estado}</TableCell>
                        <TableCell>{operacion.nombre_med}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setActiveTab("items")}>
                  Volver a Items
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

