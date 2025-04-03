"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Printer, FileSpreadsheet, ArrowLeft, FileEdit } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function PreciosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("items")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Datos de ejemplo para items
  const items = [
    {
      id: 1,
      codigo: "172091",
      descripcion: "(CENARES) ALCOHOL ETÍLICO (ETANOL) 70° 1 L",
      presentacion: "SOL",
      tipo_producto: "INSUMOS MEDICOS A $70°",
      concentra: "70°",
      cod_sismed: "10221",
      nom_sismed: "ALCOHOL ETILICO (ETA)",
      fraccion: "1",
      variable: "N",
      activo: "1",
      modulo: "FARMACIA",
    },
    {
      id: 2,
      codigo: "172552",
      descripcion: "(CENARES) ALGODÓN HIDRÓFILO 500 g",
      presentacion: "UNI",
      tipo_producto: "INSUMOS MEDICOS A $",
      concentra: "",
      cod_sismed: "10249",
      nom_sismed: "ALGODON HIDROFILO",
      fraccion: "1",
      variable: "N",
      activo: "1",
      modulo: "FARMACIA",
    },
    {
      id: 3,
      codigo: "172045",
      descripcion: "(CENARES) BOTA DESCARTABLE",
      presentacion: "PAR",
      tipo_producto: "INSUMOS MEDICOS A $",
      concentra: "",
      cod_sismed: "31590",
      nom_sismed: "",
      fraccion: "1",
      variable: "N",
      activo: "1",
      modulo: "FARMACIA",
    },
  ]

  // Datos de ejemplo para precios
  const precios = [
    {
      id: 1,
      item: "172091",
      fecha: "11/12/2024",
      hora: "16:09:29",
      promedio: 6.702,
      costo: 6.9,
      utilidad: 24.8,
      preciopub: 8.611,
      descuen: 0,
      precio: 8.611,
      sysinsert: "ECHATE 11/12/2024 16",
      sysupdate: "",
      ingresoid: "24002806",
      documento: "107912",
    },
    {
      id: 2,
      item: "172091",
      fecha: "11/12/2024",
      hora: "16:12:15",
      promedio: 6.721,
      costo: 6.9,
      utilidad: 24.8,
      preciopub: 8.611,
      descuen: 0,
      precio: 8.611,
      sysinsert: "ECHATE 11/12/2024 16",
      sysupdate: "",
      ingresoid: "24002807",
      documento: "112562",
    },
    {
      id: 3,
      item: "172091",
      fecha: "27/11/2024",
      hora: "09:15:41",
      promedio: 6.649,
      costo: 6.9,
      utilidad: 24.8,
      preciopub: 8.611,
      descuen: 0,
      precio: 8.611,
      sysinsert: "ECHATE 27/11/2024 09",
      sysupdate: "",
      ingresoid: "24002737",
      documento: "098013",
    },
  ]

  // Filtrar items basado en el término de búsqueda
  const filteredItems = items.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cod_sismed.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
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
      if (selectedItems.length + 1 === filteredItems.length) {
        setSelectAll(true)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Precios de Items</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="precios" disabled={!selectedItem}>
            Precios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-1">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </Button>
                  <Link href="/dashboard/tablas">
                    <Button variant="outline" className="gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      Regresar
                    </Button>
                  </Link>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por código o descripción..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          aria-label="Seleccionar todos"
                        />
                      </TableHead>
                      <TableHead>ITEM</TableHead>
                      <TableHead>NOMBRE</TableHead>
                      <TableHead>PRESENTACION</TableHead>
                      <TableHead>TIPO_PRODUCTO</TableHead>
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
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/10" : ""}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                              aria-label={`Seleccionar item ${item.codigo}`}
                            />
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.codigo}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.descripcion}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.presentacion}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.tipo_producto}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.concentra}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.cod_sismed}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.nom_sismed}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.fraccion}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.variable}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.activo}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedItem(item.id)
                              setActiveTab("precios")
                            }}
                          >
                            {item.modulo}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-4">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precios">
          <Card>
            <CardHeader>
              <CardTitle>Precios del Item</CardTitle>
              <div className="text-sm text-muted-foreground">
                Item: {selectedItem ? items.find((i) => i.id === selectedItem)?.descripcion : ""}
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ITEM</TableHead>
                      <TableHead>FECHA</TableHead>
                      <TableHead>HORA</TableHead>
                      <TableHead>PROMEDIO</TableHead>
                      <TableHead>COSTO</TableHead>
                      <TableHead>UTILIDAD</TableHead>
                      <TableHead>PRECIOPUB</TableHead>
                      <TableHead>DESCUEN</TableHead>
                      <TableHead>PRECIO</TableHead>
                      <TableHead>SYSINSERT</TableHead>
                      <TableHead>SYSUPDATE</TableHead>
                      <TableHead>INGRESOID</TableHead>
                      <TableHead>DOCUMENTO</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {precios.map((precio) => (
                      <TableRow key={precio.id}>
                        <TableCell>{precio.item}</TableCell>
                        <TableCell>{precio.fecha}</TableCell>
                        <TableCell>{precio.hora}</TableCell>
                        <TableCell>{precio.promedio.toFixed(3)}</TableCell>
                        <TableCell>{precio.costo.toFixed(1)}</TableCell>
                        <TableCell>{precio.utilidad.toFixed(1)}</TableCell>
                        <TableCell>{precio.preciopub.toFixed(3)}</TableCell>
                        <TableCell>{precio.descuen}</TableCell>
                        <TableCell>{precio.precio.toFixed(3)}</TableCell>
                        <TableCell>{precio.sysinsert}</TableCell>
                        <TableCell>{precio.sysupdate}</TableCell>
                        <TableCell>{precio.ingresoid}</TableCell>
                        <TableCell>{precio.documento}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileEdit className="h-4 w-4 text-blue-500" />
                            <span className="sr-only">Editar precio</span>
                          </Button>
                        </TableCell>
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

