"use client"
import Link from "next/link"
import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Package,
  FileText,
  Home,
  Stethoscope,
  Building,
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  User,
  DollarSign,
  CreditCard,
  Clipboard,
  ClipboardList,
  ClipboardCheck,
  BarChart,
  Layers,
  Globe,
  HeartHandshake,
  GraduationCap,
  Briefcase,
  Church
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function TablasPage() {
  const router = useRouter()

  // Categorías y subcategorías
  const categories = [
    {
      title: "Sistema de Caja",
      description: "Tablas para el Sistema de Caja",
      items: [
        { name: "Grupo Recaudacion", href: "/dashboard/tablas/grupos-recaudacion", icon: <DollarSign className="h-6 w-6 text-blue-500" /> },
        {
          name: "Grupo Liquidacion",
          href: "/dashboard/tablas/grupos-liquidacion",
          icon: <FileText className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Clasificador",
          href: "/dashboard/tablas/clasificadores",
          icon: <Layers className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Paciente",
          href: "/dashboard/tablas/pacientes",
          icon: <User className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Consultorio",
          href: "/dashboard/tablas/consultorios",
          icon: <Building className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Orígenes",
          href: "/dashboard/tablas/origenes",
          icon: <MapPin className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Turno",
          href: "/dashboard/tablas/turnos",
          icon: <Clock className="h-6 w-6 text-blue-500" />,
        },
      ],
    },
    {
      title: "Sistema de Farmacia",
      description: "Tabla para el Sistema de Farmacia",
      items: [
        {
          name: "Tipo de Atención - Orígenes",
          href: "/dashboard/tablas/origenes",
          icon: <MapPin className="h-6 w-6 text-blue-500" />,
        },
        
        {
          name: "Consultorio",
          href: "/dashboard/tablas/consultorios",
          icon: <Building className="h-6 w-6 text-blue-500" />,
        },
        { name: "Médicos", href: "/dashboard/tablas/medicos", icon: <Stethoscope className="h-6 w-6 text-blue-500" /> },
        {
          name: "Tipo de Transacción",
          href: "/dashboard/tablas/tipo-transaccion",
          icon: <CreditCard className="h-6 w-6 text-blue-500" />,
        },
        { name: "Almacenes", href: "/dashboard/tablas/almacenes", icon: <Home className="h-6 w-6 text-blue-500" /> },
        { name: "Items", href: "/dashboard/tablas/items", icon: <Package className="h-6 w-6 text-blue-500" /> },
        {
          name: "Cuentas",
          href: "/dashboard/cuentas",
          icon: <DollarSign className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Atención",
          href: "/dashboard/tablas/tipo-atencion",
          icon: <ClipboardCheck className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Tarifario",
          href: "/dashboard/tablas/tarifario",
          icon: <ClipboardCheck className="h-6 w-6 text-blue-500" />,
        },
      ],
    }, 
    {
      title: "Sistema de Admision",
      description: "Tablas del Sistema de Admision",
      items: [
        {
          name: "Origen de Hospitalización",
          href: "/dashboard/tablas/origen-hospitalizacion",
          icon: <MapPin className="h-6 w-6 text-blue-500" />,
          badge: (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Tutorial
            </span>
          )
        },
        {
          name: "Consultorios - Especialidad",
          href: "/dashboard/tablas/consultorios",
          icon: <Building className="h-6 w-6 text-blue-500" />,
        },
        { name: "Médicos", href: "/dashboard/tablas/medicos", icon: <Stethoscope className="h-6 w-6 text-blue-500" /> },
        {
          name: "Diagnóstico",
          href: "/dashboard/tablas/diagnostico",
          icon: <ClipboardList className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Destinos",
          href: "/dashboard/tablas/destinos",
          icon: <MapPin className="h-6 w-6 text-blue-500" />,
        },
        /*{
          name: "Proveedores",
          href: "/dashboard/tablas/proveedores",
          icon: <Building className="h-6 w-6 text-blue-500" />,
        },*/
        {
          name: "Laboratorios",
          href: "/dashboard/tablas/laboratorios",
          icon: <Clipboard className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Pacientes",
          href: "/dashboard/tablas/pacientes",
          icon: <User className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Etnias",
          href: "/dashboard/tablas/etnias",
          icon: <Users className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Tipos de Documento",
          href: "/dashboard/tablas/tipos-documento",
          icon: <FileText className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Seguros",
          href: "/dashboard/tablas/seguros",
          icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Paises",
          href: "/dashboard/tablas/pais",
          icon: <Globe className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Localidades",
          href: "/dashboard/tablas/localidad",
          icon: <MapPin className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Estado Civil",
          href: "/dashboard/tablas/estado-civil",
          icon: <HeartHandshake className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Grado Instrucción",
          href: "/dashboard/tablas/grado-instruccion",
          icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Ocupaciones",
          href: "/dashboard/tablas/ocupacion",
          icon: <Briefcase className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Religiones",
          href: "/dashboard/tablas/religion",
          icon: <Church className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Diagnósticos de EMERGENCIA",
          href: "/dashboard/tablas/diagnosticos-his-v2",
          icon: <BarChart className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Entidades",
          href: "/dashboard/tablas/entidades",
          icon: <BarChart className="h-6 w-6 text-blue-500" />,
        },
      ],
    },
    {
      title: "Sistema de Consultorios Externos",
      description: "Tabla para el Sistema de Consultorios Externos",
      items: [
        {
          name: "Consultorios - Especialidad",
          href: "/dashboard/tablas/consultorios",
          icon: <Building className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Financiamientos",
          href: "/dashboard/tablas/financiamientos",
          icon: <DollarSign className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Tipos de Documento",
          href: "/dashboard/tablas/tipos-documento",
          icon: <FileText className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Ubigeos - Procedencia",
          href: "/dashboard/tablas/ubigeos",
          icon: <MapPin className="h-6 w-6 text-blue-500" />,
        },
        {
          name: "Diagnósticos HIS V2",
          href: "/dashboard/tablas/diagnosticos-his-v2",
          icon: <BarChart className="h-6 w-6 text-blue-500" />,
        },
      ],
    },
  ]

  // Crear referencias para cada sección
  const sectionRefs = {
    caja: useRef<HTMLDivElement>(null),
    farmacia: useRef<HTMLDivElement>(null),
    admision: useRef<HTMLDivElement>(null),
    consultorios: useRef<HTMLDivElement>(null)
  }

  // Función para desplazarse a una sección
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tablas del Sistema</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>

      {/* Botones de navegación rápida */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          variant="outline" 
          className="bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
          onClick={() => scrollToSection(sectionRefs.caja)}
        >
          Sistema de Caja
        </Button>
        <Button 
          variant="outline" 
          className="bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
          onClick={() => scrollToSection(sectionRefs.farmacia)}
        >
          Sistema de Farmacia
        </Button>
        <Button 
          variant="outline" 
          className="bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300"
          onClick={() => scrollToSection(sectionRefs.admision)}
        >
          Sistema de Admision
        </Button>
        <Button 
          variant="outline" 
          className="bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
          onClick={() => scrollToSection(sectionRefs.consultorios)}
        >
          Sistema de Consultorios Externos
        </Button>
      </div>

      <div className="grid gap-8">
        {categories.map((category, index) => {
          // Asignar la referencia correspondiente según el título de la categoría
          let ref = null;
          if (category.title === "Sistema de Caja") ref = sectionRefs.caja;
          else if (category.title === "Sistema de Farmacia") ref = sectionRefs.farmacia;
          else if (category.title === "Sistema de Admision") ref = sectionRefs.admision;
          else if (category.title === "Sistema de Consultorios Externos") ref = sectionRefs.consultorios;
          
          return (
          <Card key={index} ref={ref}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="mr-3">{item.icon}</div>
                    <div className="flex items-center">
                      {item.name}
                      {item.badge && item.badge}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );
        })}
      </div>
    </div>
  )
}
