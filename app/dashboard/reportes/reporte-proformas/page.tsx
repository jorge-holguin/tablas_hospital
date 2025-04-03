"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Printer } from "lucide-react"

export default function ReporteProformasPage() {
  const [userName, setUserName] = useState("JHOLGUIN")
  const [currentDate, setCurrentDate] = useState("")
  const [almacen, setAlmacen] = useState("FARMACIA")
  const periodo = "Marzo 2025"
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [numDesde, setNumDesde] = useState("")
  const [numHasta, setNumHasta] = useState("")
  const [tipoPago, setTipoPago] = useState("")
  const [tipoTransaccion, setTipoTransaccion] = useState("")
  const [estado, setEstado] = useState("")
  const [tipoAtencion, setTipoAtencion] = useState("")
  const [usuario, setUsuario] = useState("")
  const [especialidad, setEspecialidad] = useState("")
  const [paciente, setPaciente] = useState("")
  const [item, setItem] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("fechas")

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
    setFechaDesde(formattedDate)
    setFechaHasta(formattedDate)

    // Obtener información del usuario del localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("hospital-user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name || "JHOLGUIN")
      }
    }
  }, [])

  const handleImprimir = () => {
    alert("Generando reporte de proformas...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reporte de Proformas</h1>
          <p className="text-muted-foreground text-sm">Análisis detallado de proformas</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/reportes">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
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

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Reportes de Boletas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            defaultValue="fechas"
            className="flex space-x-4 mb-4"
            value={filtroTipo}
            onValueChange={setFiltroTipo}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fechas" id="r1" />
              <Label htmlFor="r1" className="font-medium">
                Fechas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="numBoletas" id="r2" />
              <Label htmlFor="r2" className="font-medium">
                Nro Boletas
              </Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-right pt-2 text-blue-800 font-bold">
              <Label htmlFor="fechaDesde">Desde:</Label>
            </div>
            <div className="col-span-3">
              {filtroTipo === "fechas" ? (
                <Select defaultValue={fechaDesde || currentDate}>
                  <SelectTrigger id="fechaDesde">
                    <SelectValue placeholder="Fecha desde" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={currentDate}>{currentDate}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="numDesde" value={numDesde} onChange={(e) => setNumDesde(e.target.value)} />
              )}
            </div>

            <div className="text-right pt-2 text-blue-800 font-bold">
              <Label htmlFor="fechaHasta">Hasta:</Label>
            </div>
            <div className="col-span-3">
              {filtroTipo === "fechas" ? (
                <Select defaultValue={fechaHasta || currentDate}>
                  <SelectTrigger id="fechaHasta">
                    <SelectValue placeholder="Fecha hasta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={currentDate}>{currentDate}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="numHasta" value={numHasta} onChange={(e) => setNumHasta(e.target.value)} />
              )}
            </div>
          </div>

          <div className="border-t border-b py-4 my-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2 text-gray-700">Tipo de Pago:</div>
                <Input id="tipoPago" value={tipoPago} onChange={(e) => setTipoPago(e.target.value)} />
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-700">Tipo de Transacción:</div>
                <Input
                  id="tipoTransaccion"
                  value={tipoTransaccion}
                  onChange={(e) => setTipoTransaccion(e.target.value)}
                />
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-700">Estado:</div>
                <Select defaultValue={estado}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="anulado">Anulado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-700">Tipo de Atención:</div>
                <Input id="tipoAtencion" value={tipoAtencion} onChange={(e) => setTipoAtencion(e.target.value)} />
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-700">Usuario:</div>
                <Input id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-700">Especialidad:</div>
                <Input id="especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-700">Paciente (H.C.):</div>
                <Input id="paciente" value={paciente} onChange={(e) => setPaciente(e.target.value)} />
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-700">Almacén:</div>
                <Input id="almacenInput" value={almacen} onChange={(e) => setAlmacen(e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-medium mb-2 text-gray-700">Item:</div>
              <Input id="item" value={item} onChange={(e) => setItem(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button className="gap-1 w-40" onClick={handleImprimir}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Link href="/dashboard/reportes">
              <Button variant="outline" className="w-40">
                Salir
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

