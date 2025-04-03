"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Printer } from "lucide-react"

export default function KardexCuentaPage() {
  const [userName, setUserName] = useState("JHOLGUIN")
  const [currentDate, setCurrentDate] = useState("")
  const [almacen, setAlmacen] = useState("FARMACIA")
  const periodo = "Marzo 2025"
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [numeroCuenta, setNumeroCuenta] = useState("")
  const [tipoReporte, setTipoReporte] = useState("detallado")
  const [formatoHospitalizacion, setFormatoHospitalizacion] = useState(false)

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
    alert("Generando reporte de Kardex Detallado por Cuenta...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kardex Detallado por Cuenta</h1>
          <p className="text-muted-foreground text-sm">Movimientos detallados por cuenta</p>
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

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Kardex Detallado por Cargo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numeroCuenta" className="text-red-800 font-medium">
                N° Cuenta de Paciente:
              </Label>
              <Input
                id="numeroCuenta"
                value={numeroCuenta}
                onChange={(e) => setNumeroCuenta(e.target.value)}
                className="bg-yellow-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-red-800 font-medium">Periodo:</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="fechaDesde">Desde:</Label>
                  <Select defaultValue={fechaDesde || currentDate}>
                    <SelectTrigger id="fechaDesde">
                      <SelectValue placeholder="Fecha desde" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={currentDate}>{currentDate}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fechaHasta">Hasta:</Label>
                  <Select defaultValue={fechaHasta || currentDate}>
                    <SelectTrigger id="fechaHasta">
                      <SelectValue placeholder="Fecha hasta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={currentDate}>{currentDate}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-red-800 font-medium">Tipo de Reporte:</Label>
              <RadioGroup value={tipoReporte} onValueChange={setTipoReporte} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detallado" id="r1" />
                  <Label htmlFor="r1">Reporte Detallado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="consolidado" id="r2" />
                  <Label htmlFor="r2">Reporte Consolidado</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="formatoHospitalizacion"
                checked={formatoHospitalizacion}
                onCheckedChange={(checked) => setFormatoHospitalizacion(checked as boolean)}
              />
              <Label htmlFor="formatoHospitalizacion">Formato de Hospitalización</Label>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button className="gap-1" onClick={handleImprimir}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Link href="/dashboard/reportes">
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

