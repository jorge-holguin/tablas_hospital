"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Package, ArrowUpDown, Truck, Database, ClipboardList, BarChart3, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AlmacenesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Almacenes</h1>
          <p className="text-muted-foreground">Gestión de almacenes, inventarios y movimientos de productos</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/almacenes/ingresos">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Ingresos</CardTitle>
              <Package className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">Registro de ingresos de productos al almacén</CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/almacenes/salidas">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Salidas</CardTitle>
              <ArrowUpDown className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">Gestión de salidas de productos del almacén</CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/almacenes/transferencias">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Transferencias</CardTitle>
              <Truck className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">Transferencias entre almacenes</CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/almacenes/stock">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Stock</CardTitle>
              <Database className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">Consulta de stock disponible en almacenes</CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/almacenes/kardex">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Kardex</CardTitle>
              <ClipboardList className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">Movimientos históricos de productos</CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/almacenes/inventarios">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Inventarios</CardTitle>
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">Gestión de inventarios físicos</CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/almacenes/pedidos">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">Gestión de pedidos de productos</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

