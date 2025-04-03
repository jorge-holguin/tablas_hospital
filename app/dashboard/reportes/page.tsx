"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Calendar, FileText, History, LineChart, ListFilter, Package, PieChart, RefreshCw, User, Users } from 'lucide-react'

export default function ReportesPage() {
  const [userName, setUserName] = useState("JHOLGUIN")
  const [currentDate, setCurrentDate] = useState("")
  const [almacen, setAlmacen] = useState("FARMACIA")
  const periodo = "Marzo 2025"

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

    // Obtener información del usuario del localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("hospital-user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name || "JHOLGUIN")
      }
    }
  }, [])

  const reportesGenerales = [
    {
      id: 1,
      nombre: "Parte Diario de Farmacia",
      descripcion: "Reporte diario de movimientos de farmacia",
      icon: Calendar,
      href: "/dashboard/reportes/parte-diario",
    },
    {
      id: 2,
      nombre: "Consumo Valorizado por Tipo de Atención",
      descripcion: "Análisis de consumo por tipo de atención",
      icon: BarChart3,
      href: "/dashboard/reportes/consumo-valorizado",
    },
    {
      id: 3,
      nombre: "Listado de Proformas entre Fechas",
      descripcion: "Reporte de proformas en un rango de fechas",
      icon: FileText,
      href: "/dashboard/reportes/listado-proformas",
    },
    {
      id: 4,
      nombre: "Reporte de Proformas",
      descripcion: "Análisis detallado de proformas",
      icon: FileText,
      href: "/dashboard/reportes/reporte-proformas",
    },
    {
      id: 5,
      nombre: "Recetas por Departamento",
      descripcion: "Análisis de recetas por departamento",
      icon: Package,
      href: "/dashboard/reportes/recetas-departamento",
    },
    {
      id: 6,
      nombre: "Recetas por Profesional",
      descripcion: "Análisis de recetas por médico",
      icon: User,
      href: "/dashboard/reportes/recetas-profesional",
    },
  ]

  const reportesABC = [
    {
      id: 7,
      nombre: "Curva ABC Consumo",
      descripcion: "Análisis ABC por consumo",
      icon: LineChart,
      href: "/dashboard/reportes/curva-abc-consumo",
    },
    {
      id: 8,
      nombre: "Curva ABC Importe",
      descripcion: "Análisis ABC por importe",
      icon: PieChart,
      href: "/dashboard/reportes/curva-abc-importe",
    },
    {
      id: 9,
      nombre: "Curva ABC Demanda Insatisfecha",
      descripcion: "Análisis ABC de demanda insatisfecha",
      icon: BarChart3,
      href: "/dashboard/reportes/curva-abc-demanda",
    },
  ]

  const reportesKardex = [
    {
      id: 10,
      nombre: "Kardex Detallado de Paciente por N° de Cuenta",
      descripcion: "Movimientos detallados por cuenta",
      icon: FileText,
      href: "/dashboard/reportes/kardex-cuenta",
    },
    {
      id: 11,
      nombre: "Kardex Detallado del Paciente por N° de Historia Clínica",
      descripcion: "Movimientos detallados por historia clínica",
      icon: History,
      href: "/dashboard/reportes/kardex-historia",
    },
    {
      id: 12,
      nombre: "Kardex Detallado de Paciente sin Cuenta",
      descripcion: "Movimientos detallados de pacientes sin cuenta",
      icon: FileText,
      href: "/dashboard/reportes/kardex-sin-cuenta",
    },
  ]

  const reportesAdicionales = [
    {
      id: 13,
      nombre: "Artículos por Consultorio",
      descripcion: "Análisis de artículos por consultorio",
      icon: Package,
      href: "/dashboard/reportes/articulos-consultorio",
    },
    {
      id: 14,
      nombre: "Proformas y Ventas por Usuario",
      descripcion: "Análisis de ventas por usuario",
      icon: Users,
      href: "/dashboard/reportes/ventas-usuario",
    },
    {
      id: 15,
      nombre: "Informe de Recetas Despachadas",
      descripcion: "Reporte de recetas atendidas",
      icon: FileText,
      href: "/dashboard/reportes/recetas-despachadas",
    },
    {
      id: 16,
      nombre: "Reporte de Devolución de Medicamentos",
      descripcion: "Análisis de devoluciones",
      icon: RefreshCw,
      href: "/dashboard/reportes/devoluciones-medicamentos",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground text-sm">Generación de reportes y análisis estadísticos</p>
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

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Reportes Generales
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {reportesGenerales.map((reporte) => (
              <Link key={reporte.id} href={reporte.href} className="block">
                <Card className="h-full hover:border-primary cursor-pointer transition-colors">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <reporte.icon className="h-5 w-5 text-primary" />
                      {reporte.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="text-xs">{reporte.descripcion}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Reportes de Análisis ABC
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {reportesABC.map((reporte) => (
              <Link key={reporte.id} href={reporte.href} className="block">
                <Card className="h-full hover:border-primary cursor-pointer transition-colors">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <reporte.icon className="h-5 w-5 text-primary" />
                      {reporte.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="text-xs">{reporte.descripcion}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Reportes de Kardex
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {reportesKardex.map((reporte) => (
              <Link key={reporte.id} href={reporte.href} className="block">
                <Card className="h-full hover:border-primary cursor-pointer transition-colors">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <reporte.icon className="h-5 w-5 text-primary" />
                      {reporte.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="text-xs">{reporte.descripcion}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-primary" />
            Reportes Adicionales
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {reportesAdicionales.map((reporte) => (
              <Link key={reporte.id} href={reporte.href} className="block">
                <Card className="h-full hover:border-primary cursor-pointer transition-colors">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <reporte.icon className="h-5 w-5 text-primary" />
                      {reporte.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="text-xs">{reporte.descripcion}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

