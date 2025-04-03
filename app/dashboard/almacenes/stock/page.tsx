"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, FileSpreadsheet, ArrowLeft, Search, RefreshCw, Filter } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para la tabla de items
const itemsData = [
  {
    id: 1,
    item: "172091",
    nombre: "(CENARES) ALCOHOL ETÍLICO (ETANOL) 70° 1 L",
    presentacion: "SOL",
    tipo_producto: "INSUMOS MEDICOS A $70°",
    concentra: "",
    cod_sismed: "10221",
    nom_sismed: "ALCOHOL ETILICO (ETA)",
    fraccion: "1",
    variable: "N",
    activo: "1",
    modulo: "FARMACIA",
  },
  {
    id: 2,
    item: "172552",
    nombre: "(CENARES) ALGODÓN HIDRÓFILO 500 g",
    presentacion: "UNI",
    tipo_producto: "INSUMOS MEDICOS A $",
    concentra: "",
    cod_sismed: "10249",
    nom_sismed: "ALGODÓN HIDRÓFILO",
    fraccion: "1",
    variable: "N",
    activo: "1",
    modulo: "FARMACIA",
  },
  {
    id: 3,
    item: "172045",
    nombre: "(CENARES) BOTA DESCARTABLE",
    presentacion: "UNI",
    tipo_producto: "INSUMOS MEDICOS A $",
    concentra: "",
    cod_sismed: "31590",
    nom_sismed: "",
    fraccion: "1",
    variable: "N",
    activo: "1",
    modulo: "FARMACIA",
  },
  {
    id: 4,
    item: "172044",
    nombre: "(CENARES) BOTA DESCARTABLE CUBRE CALZADO PARA CIRUJANO",
    presentacion: "UNI",
    tipo_producto: "INSUMOS MEDICOS A $",
    concentra: "",
    cod_sismed: "18931",
    nom_sismed: "BOTA DESCARTABLE P",
    fraccion: "1",
    variable: "N",
    activo: "1",
    modulo: "FARMACIA",
  },
  {
    id: 5,
    item: "172132",
    nombre: "(CENARES) CARETA PROTECTORA DE POLICARBONATO UNIDAD",
    presentacion: "UNI",
    tipo_producto: "INSUMOS MEDICOS A $",
    concentra: "",
    cod_sismed: "43815",
    nom_sismed: "",
    fraccion: "1",
    variable: "N",
    activo: "1",
    modulo: "FARMACIA",
  },
]

// Datos de ejemplo para la tabla de stock por almacén
const stockAlmacenData = [
  {
    id: 1,
    almStock: "CG",
    promedio: 0.0,
    ubicacion: 0.0,
    nombre_ubicacion: "30/11/2029",
    sismed: "10221",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "30/11/2029",
  },
  {
    id: 2,
    almStock: "A",
    promedio: 0.0,
    ubicacion: 4000.0,
    nombre_ubicacion: "30/11/2029",
    sismed: "10221",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "30/11/2029",
  },
  {
    id: 3,
    almStock: "AI",
    promedio: 1788.0,
    ubicacion: 6.72,
    nombre_ubicacion: "30/11/2029",
    sismed: "10221",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "30/11/2029",
  },
  {
    id: 4,
    almStock: "AM",
    promedio: 0.0,
    ubicacion: 0.0,
    nombre_ubicacion: "30/11/2029",
    sismed: "10221",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "30/11/2029",
  },
  {
    id: 5,
    almStock: "CB",
    promedio: 0.0,
    ubicacion: 0.0,
    nombre_ubicacion: "30/11/2029",
    sismed: "10221",
    clase: "I",
    aplica_dscto: "S",
    tipo_programa: "CEN",
    fecha_vencimiento: "30/11/2029",
  },
]

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeTab, setActiveTab] = useState("items")

  // Filtrar datos según término de búsqueda
  const filteredData = itemsData.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cod_sismed.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <h2 className="text-2xl font-bold tracking-tight">Stock de Almacenes</h2>
        <p className="text-muted-foreground">Consulte el stock disponible de productos por almacén</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="stock" disabled={!selectedItem}>
            Stock por Almacén
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

              {/* Segunda fila: búsqueda a la izquierda, filtros a la derecha */}
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
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ITEM</TableHead>
                      <TableHead>NOMBRE</TableHead>
                      <TableHead>PRESENTACION</TableHead>
                      <TableHead>TIPO PRODUCTO</TableHead>
                      <TableHead>CONCENTRA</TableHead>
                      <TableHead>COD_SISMED</TableHead>
                      <TableHead>NOM_SISMED</TableHead>
                      <TableHead>FRACCION</TableHead>
                      <TableHead>VARIABLE</TableHead>
                      <TableHead>ACTIVO</TableHead>
                      <TableHead>MODULO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center h-24">
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
                            setActiveTab("stock")
                          }}
                        >
                          <TableCell>{item.item}</TableCell>
                          <TableCell>{item.nombre}</TableCell>
                          <TableCell>{item.presentacion}</TableCell>
                          <TableCell>{item.tipo_producto}</TableCell>
                          <TableCell>{item.concentra}</TableCell>
                          <TableCell>{item.cod_sismed}</TableCell>
                          <TableCell>{item.nom_sismed}</TableCell>
                          <TableCell>{item.fraccion}</TableCell>
                          <TableCell>{item.variable}</TableCell>
                          <TableCell>{item.activo}</TableCell>
                          <TableCell>{item.modulo}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Stock por Almacén</CardTitle>
              <CardDescription>
                Item: {selectedItem ? itemsData.find((i) => i.id === selectedItem)?.nombre : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ALMACEN</TableHead>
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
                    {stockAlmacenData.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell>{stock.almStock}</TableCell>
                        <TableCell>{stock.promedio.toFixed(2)}</TableCell>
                        <TableCell>{stock.promedio.toFixed(2)}</TableCell>
                        <TableCell>{stock.ubicacion.toFixed(2)}</TableCell>
                        <TableCell>{stock.nombre_ubicacion}</TableCell>
                        <TableCell>{stock.sismed}</TableCell>
                        <TableCell>{stock.clase}</TableCell>
                        <TableCell>{stock.aplica_dscto}</TableCell>
                        <TableCell>{stock.tipo_programa}</TableCell>
                        <TableCell>{stock.fecha_vencimiento}</TableCell>
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

