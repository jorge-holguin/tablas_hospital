"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Pill, Clipboard, ShoppingCart, FileBarChart2 } from "lucide-react"

export default function FarmaciaPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Módulo de Farmacia</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/farmacia/recetas")}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Gestión de Recetas
            </CardTitle>
            <CardDescription>
              Administre las recetas médicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crear, editar, buscar y gestionar recetas médicas para pacientes.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/farmacia/medicamentos")}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Pill className="mr-2 h-5 w-5 text-primary" />
              Medicamentos
            </CardTitle>
            <CardDescription>
              Catálogo de medicamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gestione el catálogo de medicamentos, dosis, presentaciones y stock.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/farmacia/dispensacion")}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clipboard className="mr-2 h-5 w-5 text-primary" />
              Dispensación
            </CardTitle>
            <CardDescription>
              Dispensación de medicamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Proceso de dispensación de medicamentos a pacientes.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/farmacia/compras")}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
              Compras
            </CardTitle>
            <CardDescription>
              Gestión de compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Administre las compras de medicamentos y suministros.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/farmacia/reportes")}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileBarChart2 className="mr-2 h-5 w-5 text-primary" />
              Reportes
            </CardTitle>
            <CardDescription>
              Informes y estadísticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Genere reportes y visualice estadísticas del módulo de farmacia.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
