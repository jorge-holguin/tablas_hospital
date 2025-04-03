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
  Check,
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Search,
  RefreshCw,
  Filter,
} from "lucide-react"

// Datos de ejemplo para la tabla de pedidos
const pedidosData = [
  {
    id: 1,
    pedidoId: "PED-2025-001",
    documento: "PED-001",
    tipo: "NORMAL",
    fecha: "05/04/2025",
    hora: "09:15:22",
    fecha_aprobacion: "05/04/2025",
    hora_aprobacion: "10:30:45",
    almacen: "F",
    total: 12450.75,
    usuario: "JHOLGUN",
    observacion: "Pedido mensual de medicamentos",
  },
  {
    id: 2,
    pedidoId: "PED-2025-002",
    documento: "PED-002",
    tipo: "URGENTE",
    fecha: "10/04/2025",
    hora: "14:22:10",
    fecha_aprobacion: "10/04/2025",
    hora_aprobacion: "15:05:33",
    almacen: "A",
    total: 5678.9,
    usuario: "EROMERO",
    observacion: "Pedido urgente para emergencias",
  },
  {
    id: 3,
    pedidoId: "PED-2025-003",
    documento: "PED-003",
    tipo: "NORMAL",
    fecha: "15/04/2025",
    hora: "11:05:47",
    fecha_aprobacion: "16/04/2025",
    hora_aprobacion: "09:15:22",
    almacen: "DU",
    total: 8765.43,
    usuario: "MALVAREZ",
    observacion: "Pedido de insumos médicos",
  },
  {
    id: 4,
    pedidoId: "PED-2025-004",
    documento: "PED-004",
    tipo: "PROGRAMADO",
    fecha: "20/04/2025",
    hora: "08:30:15",
    fecha_aprobacion: "",
    hora_aprobacion: "",
    almacen: "CE",
    total: 15432.1,
    usuario: "JHOLGUN",
    observacion: "Pedido programado para mayo",
  },
  {
    id: 5,
    pedidoId: "PED-2025-005",
    documento: "PED-005",
    tipo: "URGENTE",
    fecha: "25/04/2025",
    hora: "16:45:33",
    fecha_aprobacion: "",
    hora_aprobacion: "",
    almacen: "A",
    total: 3456.78,
    usuario: "EROMERO",
    observacion: "Pedido urgente de antibióticos",
  },
]

// Datos de ejemplo para la tabla de detalles
const detallesData = [
  {
    id: 1,
    item: "172091",
    nombre: "(CENARES) ALCOHOL ETÍLICO (ETANOL) 70° 1 L",
    presentacion: "SOL",
    cantidad: 50,
    precio: 12.5,
    importe: 625.0,
    estado: 1,
    almacen: "F",
    fecha_entrega: "10/05/2025",
    lote: "LOT-2025-001",
  },
  {
    id: 2,
    item: "172552",
    nombre: "(CENARES) ALGODÓN HIDRÓFILO 500 g",
    presentacion: "UNI",
    cantidad: 30,
    precio: 15.75,
    importe: 472.5,
    estado: 1,
    almacen: "F",
    fecha_entrega: "10/05/2025",
    lote: "LOT-2025-002",
  },
  {
    id: 3,
    item: "172045",
    nombre: "(CENARES) BOTA DESCARTABLE",
    presentacion: "UNI",
    cantidad: 100,
    precio: 5.25,
    importe: 525.0,
    estado: 1,
    almacen: "F",
    fecha_entrega: "10/05/2025",
    lote: "LOT-2025-003",
  },
]

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [activeTab, setActiveTab] = useState("pedidos")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Filtrar datos según término de búsqueda
  const filteredData = pedidosData.filter(
    (pedido) =>
      pedido.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.observacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <h2 className="text-2xl font-bold tracking-tight">Pedidos</h2>
        <p className="text-muted-foreground">Gestione los pedidos de productos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="detalles" disabled={!selectedPedido}>
            Detalles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos">
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
                    Nuevo Pedido
                  </Button>
                  <Button variant={hasSelection ? "default" : "outline"} className="gap-1" disabled={!hasSelection}>
                    <FileEdit className="h-4 w-4" />
                    Editar Pedido
                  </Button>
                  <Button variant={hasSelection ? "destructive" : "outline"} className="gap-1" disabled={!hasSelection}>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                  <Button variant={hasSelection ? "default" : "outline"} className="gap-1" disabled={!hasSelection}>
                    <Check className="h-4 w-4" />
                    Aprobar Pedido
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
                      <TableHead>PEDIDO ID</TableHead>
                      <TableHead>DOCUMENTO</TableHead>
                      <TableHead>TIPO</TableHead>
                      <TableHead>FECHA</TableHead>
                      <TableHead>HORA</TableHead>
                      <TableHead>FECHA_APROBACION</TableHead>
                      <TableHead>HORA_APROBACION</TableHead>
                      <TableHead>ALMACEN</TableHead>
                      <TableHead>TOTAL</TableHead>
                      <TableHead>USUARIO</TableHead>
                      <TableHead>OBSERVACION</TableHead>
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
                      filteredData.map((pedido) => (
                        <TableRow
                          key={pedido.id}
                          className={selectedPedido === pedido.id ? "bg-primary/10" : ""}
                          onClick={() => {
                            setSelectedPedido(pedido.id)
                            setActiveTab("detalles")
                          }}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedItems.includes(pedido.id)}
                              onCheckedChange={() => handleSelectItem(pedido.id)}
                              aria-label={`Seleccionar pedido ${pedido.pedidoId}`}
                            />
                          </TableCell>
                          <TableCell>{pedido.pedidoId}</TableCell>
                          <TableCell>{pedido.documento}</TableCell>
                          <TableCell>{pedido.tipo}</TableCell>
                          <TableCell>{pedido.fecha}</TableCell>
                          <TableCell>{pedido.hora}</TableCell>
                          <TableCell>{pedido.fecha_aprobacion}</TableCell>
                          <TableCell>{pedido.hora_aprobacion}</TableCell>
                          <TableCell>{pedido.almacen}</TableCell>
                          <TableCell>{pedido.total.toFixed(2)}</TableCell>
                          <TableCell>{pedido.usuario}</TableCell>
                          <TableCell>{pedido.observacion}</TableCell>
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
              <CardTitle>Detalles del Pedido</CardTitle>
              <CardDescription>
                Pedido ID: {selectedPedido ? pedidosData.find((p) => p.id === selectedPedido)?.pedidoId : ""}
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
                      <TableHead>ALMACEN</TableHead>
                      <TableHead>FECHA_ENTREGA</TableHead>
                      <TableHead>LOTE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detallesData.map((detalle) => (
                      <TableRow key={detalle.id}>
                        <TableCell>{detalle.item}</TableCell>
                        <TableCell>{detalle.nombre}</TableCell>
                        <TableCell>{detalle.presentacion}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>{detalle.precio.toFixed(2)}</TableCell>
                        <TableCell>{detalle.importe.toFixed(2)}</TableCell>
                        <TableCell>{detalle.estado}</TableCell>
                        <TableCell>{detalle.almacen}</TableCell>
                        <TableCell>{detalle.fecha_entrega}</TableCell>
                        <TableCell>{detalle.lote}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setActiveTab("pedidos")}>
                  Volver a Pedidos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

