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

export default function ArticulosConsultorioPage() {
  const [userName, setUserName] = useState("JHOLGUIN")
  const [currentDate, setCurrentDate] = useState("")
  const [almacen, setAlmacen] = useState("F")
  const periodo = "Marzo 2025"
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [consultorio, setConsultorio] = useState("")
  const [mostrarPor, setMostrarPor] = useState("unidades")

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
    alert("Generando reporte de Artículos por Consultorio...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Artículos por Consultorio</h1>
          <p className="text-muted-foreground text-sm">Análisis de artículos por consultorio</p>
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
          <CardTitle className="text-xl">Artículos por Consultorio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fechas" className="font-medium">
                Fechas:
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="fechaDesde">Del:</Label>
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
                  <Label htmlFor="fechaHasta">Al:</Label>
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
              <Label htmlFor="consultorio" className="font-medium">
                Consultorio:
              </Label>
              <Input
                id="consultorio"
                value={consultorio}
                onChange={(e) => setConsultorio(e.target.value)}
                className="bg-yellow-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="almacenInput" className="font-medium">
                Almacén:
              </Label>
              <Input id="almacenInput" value={almacen} onChange={(e) => setAlmacen(e.target.value)} />
            </div>

            <div className="space-y-2 border p-3 rounded-md">
              <Label className="font-medium">Mostrar:</Label>
              <RadioGroup value={mostrarPor} onValueChange={setMostrarPor} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unidades" id="r1" />
                  <Label htmlFor="r1">Unidades por artículo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="boletas" id="r2" />
                  <Label htmlFor="r2">Cantidad de Boletas</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button className="gap-1 w-32" onClick={handleImprimir}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Link href="/dashboard/reportes">
              <Button variant="outline" className="w-32">
                Salir
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

