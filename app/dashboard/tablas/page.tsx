"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Package,
  Tag,
  FileText,
  Database,
  Home,
  ShieldCheck,
  Building,
  Building2,
  Stethoscope,
  UserSquare,
} from "lucide-react"

export default function TablasPage() {
  const router = useRouter()

  // Categorías y subcategorías
  const categories = [
    {
      title: "Productos y Precios",
      description: "Gestión de productos, precios y presentaciones",
      items: [
        { name: "Items", href: "/dashboard/tablas/items", icon: <Package className="h-6 w-6 text-blue-500" /> },
        { name: "Precios", href: "/dashboard/tablas/precios", icon: <Tag className="h-6 w-6 text-blue-500" /> },
        {
          name: "Presentaciones",
          href: "/dashboard/tablas/presentaciones",
          icon: <Package className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Genéricos",
          href: "/dashboard/tablas/genericos",
          icon: <FileText className="h-6 w-6 text-blue-500" />,
        },
      ],
    },
    {
      title: "Clasificaciones",
      description: "Categorización y clasificación de productos",
      items: [
        { name: "Familias", href: "/dashboard/tablas/familias", icon: <Database className="h-6 w-6 text-blue-500" /> },
        { name: "Clases", href: "/dashboard/tablas/clases", icon: <Database className="h-6 w-6 text-blue-500" /> },
        { name: "Almacenes", href: "/dashboard/tablas/almacenes", icon: <Home className="h-6 w-6 text-blue-500" /> },
        {
          name: "Tipo de Atención",
          href: "/dashboard/tablas/tipo-atencion",
          icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
        },
      ],
    },
    {
      title: "Proveedores y Laboratorios",
      description: "Gestión de proveedores y laboratorios",
      items: [
        {
          name: "Proveedores",
          href: "/dashboard/tablas/proveedores",
          icon: <Building className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Laboratorios",
          href: "/dashboard/tablas/laboratorios",
          icon: <Building2 className="h-6 w-6 text-blue-500" />,
        },
      ],
    },
    {
      title: "Seguros y Personal",
      description: "Gestión de personal médico y seguros",
      items: [
        {
          name: "Consultorios",
          href: "/dashboard/tablas/consultorios",
          icon: <Home className="h-6 w-6 text-blue-500" />,
        },
        { name: "Médicos", href: "/dashboard/tablas/medicos", icon: <Stethoscope className="h-6 w-6 text-blue-500" /> },
        {
          name: "Personal",
          href: "/dashboard/tablas/personal",
          icon: <UserSquare className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Empresas Aseguradoras",
          href: "/dashboard/tablas/empresas-aseguradoras",
          icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tablas del Sistema</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>

      <div className="grid gap-8">
        {categories.map((category, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">{category.title}</h2>
            <p className="text-muted-foreground text-lg">{category.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {item.icon}
                        {item.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">Gestionar {item.name.toLowerCase()}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

