"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Home, FileText, DollarSign } from "lucide-react"

export default function Dashboard() {
  const [userName, setUserName] = useState("Usuario")

  useEffect(() => {
    // Obtener información del usuario del localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("hospital-user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name)
      }
    }
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {userName}</h1>
        <p className="text-muted-foreground text-sm">Sistema Integral de Gestión para el Hospital José Agurto Tello</p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
        <Link href="/dashboard/tablas" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors shadow-sm hover:shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                Tablas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-sm">
                Gestión de tablas maestras: Items, Precios, Presentaciones, Familias y más.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/almacenes" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors shadow-sm hover:shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <Home className="h-8 w-8 text-primary" />
                Almacenes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-sm">
                Gestión de ingresos, salidas, transferencias, stock, kardex, inventarios y pedidos.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reportes" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors shadow-sm hover:shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Reportes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-sm">
                Parte diario, consumo valorizado, listados, recetas, curvas ABC y más.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ventas" className="block">
          <Card className="hospital-card h-full hover:border-primary cursor-pointer transition-colors shadow-sm hover:shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-sm">
                Proformas contado, crédito, exoneradas, armado de paquetes y devoluciones.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

