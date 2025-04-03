"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, FileSpreadsheet, Package, Printer, RotateCcw, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from "react"

export default function VentasPage() {
  const [currentDate, setCurrentDate] = useState("")
  const [userName, setUserName] = useState("JHOLGUIN")
  const [almacen, setAlmacen] = useState("FARMACIA")
  const periodo = "Marzo 2025"

  useEffect(() => {
    // Obtener fecha actual
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground text-sm">Gestión de proformas, paquetes y devoluciones</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* No info bar needed here as it's already in the footer */}

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Link href="/dashboard/ventas/proformas-contado" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Proformas Contado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">Registro y gestión de proformas al contado</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ventas/proformas-credito" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Proformas Crédito
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">Registro y gestión de proformas a crédito</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ventas/proformas-exoneradas" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Proformas Exoneradas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">Registro y gestión de proformas exoneradas</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ventas/paquetes" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Armado de Paquetes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">Configuración y gestión de paquetes de productos</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ventas/devoluciones" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                Devoluciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">Gestión de devoluciones de productos</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ventas/visualizador" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                Visualizador de Proformas Emitidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">Consulta y gestión de proformas emitidas</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

