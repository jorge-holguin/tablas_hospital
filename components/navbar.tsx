"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { deleteCookie } from "cookies-next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  Home,
  FileText,
  DollarSign,
  Menu,
  LogOut,
  User,
  Hospital,
  ChevronRight,
  Package,
  Tag,
  Building,
  Building2,
  ShieldCheck,
  Stethoscope,
  UserSquare,
  EyeIcon,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useReadOnlyPermissions } from "@/hooks/useReadOnlyPermissions"

// Define types for navigation items
interface SubItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
}

interface SubCategory {
  name: string;
  subItems: SubItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  subItems?: SubItem[];
  subCategories?: SubCategory[];
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState("Usuario")
  const { isReadOnly, user, hasAccessToSection } = useReadOnlyPermissions()

  useEffect(() => {
    // Obtener información del usuario del localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("hospital-user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.NOMBRE || user.name || "Usuario")
      }
    }
  }, [])

  const handleLogout = () => {
    // Eliminar token y datos de usuario
    deleteCookie('token')
    if (typeof window !== "undefined") {
      localStorage.removeItem("hospital-user")
    }
    router.push("/login")
  }

  // Estructura de navegación con categorías y subcategorías
  const navItems: NavItem[] = [
    {
      name: "Tablas",
      href: "/dashboard/tablas",
      icon: <Database className="h-5 w-5" />,
      subCategories: [
        {
          name: "Productos y Precios",
          subItems: [
            { name: "Items", href: "/dashboard/tablas/items", icon: <Package className="h-4 w-4" /> },
            { name: "PreNsentaciones", href: "/dashboard/tablas/presentaciones", icon: <Package className="h-4 w-4" /> },
            { name: "Genéricos", href: "/dashboard/tablas/genericos", icon: <FileText className="h-4 w-4" /> },
          ],
        },
        {
          name: "Clasificaciones",
          subItems: [
            { name: "Familias", href: "/dashboard/tablas/familias", icon: <Database className="h-4 w-4" /> },
            { name: "Clases", href: "/dashboard/tablas/clases", icon: <Database className="h-4 w-4" /> },
            { name: "Almacenes", href: "/dashboard/tablas/almacenes", icon: <Home className="h-4 w-4" /> },
            {
              name: "Tipo de Atención",
              href: "/dashboard/tablas/tipo-atencion",
              icon: <ShieldCheck className="h-4 w-4" />,
            },
          ],
        },
        {
          name: "Proveedores y Laboratorios",
          subItems: [
            { name: "Proveedores", href: "/dashboard/tablas/proveedores", icon: <Building className="h-4 w-4" /> },
            { name: "Laboratorios", href: "/dashboard/tablas/laboratorios", icon: <Building2 className="h-4 w-4" /> },
          ],
        },
        {
          name: "Seguros y Personal",
          subItems: [
            { name: "Consultorios", href: "/dashboard/tablas/consultorios", icon: <Home className="h-4 w-4" /> },
            { name: "Médicos", href: "/dashboard/tablas/medicos", icon: <Stethoscope className="h-4 w-4" /> },
            { name: "Especialidades", href: "/dashboard/tablas/especialidades", icon: <Stethoscope className="h-4 w-4" /> },
            { name: "Personal", href: "/dashboard/tablas/personal", icon: <UserSquare className="h-4 w-4" /> },
            {
              name: "Empresas Aseguradoras",
              href: "/dashboard/tablas/empresas-aseguradoras",
              icon: <ShieldCheck className="h-4 w-4" />,
            },
          ],
        },
      ],
    },
    {
      name: "Almacenes",
      href: "/dashboard/almacenes",
      icon: <Home className="h-5 w-5" />,
      subItems: [
        { name: "Ingresos", href: "/dashboard/almacenes/ingresos" },
        { name: "Salidas", href: "/dashboard/almacenes/salidas" },
        { name: "Transferencias", href: "/dashboard/almacenes/transferencias" },
        { name: "Stock", href: "/dashboard/almacenes/stock" },
        { name: "Kardex", href: "/dashboard/almacenes/kardex" },
        { name: "Inventarios", href: "/dashboard/almacenes/inventarios" },
        { name: "Pedidos", href: "/dashboard/almacenes/pedidos" },
      ],
    },
    {
      name: "Ventas",
      href: "/dashboard/ventas",
      icon: <DollarSign className="h-5 w-5" />,
      subItems: [
        { name: "Proformas Contado", href: "/dashboard/ventas/proformas-contado" },
        { name: "Proformas Crédito", href: "/dashboard/ventas/proformas-credito" },
        { name: "Proformas Exoneradas", href: "/dashboard/ventas/proformas-exoneradas" },
        { name: "Armado de Paquetes", href: "/dashboard/ventas/paquetes" },
        { name: "Devoluciones", href: "/dashboard/ventas/devoluciones" },
        { name: "Visualizador de Proformas", href: "/dashboard/ventas/visualizador" },
      ],
    },
    {
      name: "Reportes",
      href: "/dashboard/reportes",
      icon: <FileText className="h-5 w-5" />,
      subItems: [
        {
          name: "Reportes Generales",
          href: "/dashboard/reportes/generales",
          subItems: [
            { name: "Parte Diario de Farmacia", href: "/dashboard/reportes/parte-diario" },
            { name: "Consumo Valorizado", href: "/dashboard/reportes/consumo-valorizado" },
            { name: "Listado de Proformas", href: "/dashboard/reportes/listado-proformas" },
            { name: "Reporte de Proformas", href: "/dashboard/reportes/reporte-proformas" },
            { name: "Recetas por Departamento", href: "/dashboard/reportes/recetas-departamento" },
            { name: "Recetas por Profesional", href: "/dashboard/reportes/recetas-profesional" },
          ],
        },
        {
          name: "Reportes de Análisis ABC",
          href: "/dashboard/reportes/analisis-abc",
          subItems: [
            { name: "Curva ABC Consumo", href: "/dashboard/reportes/curva-abc-consumo" },
            { name: "Curva ABC Importe", href: "/dashboard/reportes/curva-abc-importe" },
            { name: "Curva ABC Demanda", href: "/dashboard/reportes/curva-abc-demanda" },
          ],
        },
        {
          name: "Reportes de Kardex",
          href: "/dashboard/reportes/kardex",
          subItems: [
            { name: "Por Cuenta", href: "/dashboard/reportes/kardex-cuenta" },
            { name: "Por Historia Clínica", href: "/dashboard/reportes/kardex-historia" },
            { name: "Pacientes sin Cuenta", href: "/dashboard/reportes/kardex-sin-cuenta" },
          ],
        },
        {
          name: "Reportes Adicionales",
          href: "/dashboard/reportes/adicionales",
          subItems: [
            { name: "Artículos por Consultorio", href: "/dashboard/reportes/articulos-consultorio" },
            { name: "Proformas y Ventas por Usuario", href: "/dashboard/reportes/ventas-usuario" },
            { name: "Recetas Despachadas", href: "/dashboard/reportes/recetas-despachadas" },
            { name: "Devolución de Medicamentos", href: "/dashboard/reportes/devoluciones-medicamentos" },
          ],
        },
      ],
    },
  ]

  // Función para renderizar los submenús en la versión móvil
  const renderMobileSubMenu = (items: SubItem[]) => {
    if (!items) return null

    return (
      <div className="pl-4 flex flex-col gap-1 mt-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm ${pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center gap-2 mb-6">
                <Hospital className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary">Hospital José Agurto Tello</span>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 text-sm ${pathname === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>

                {navItems
                  .filter(item => {
                    // Extraer el nombre de la sección de la URL
                    const sectionName = item.href.split('/').pop() || '';
                    // Verificar si el usuario tiene acceso a esta sección
                    return hasAccessToSection(sectionName);
                  })
                  .map((item) => (
                  <div key={item.href} className="flex flex-col gap-1">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 text-sm ${pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>

                    {item.subCategories && (
                      <div className="pl-7 flex flex-col gap-2 mt-1">
                        {item.subCategories.map((category, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            {category.subItems && renderMobileSubMenu(category.subItems)}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.subItems && !item.subCategories && (
                      <div className="pl-7 flex flex-col gap-1 mt-1">
                        {item.subItems.map((subItem) => (
                          <div key={typeof subItem === "object" ? subItem.href : ""} className="flex flex-col gap-1">
                            {typeof subItem === "object" && (
                              <>
                                <Link
                                  href={subItem.href}
                                  className={`text-sm ${pathname === subItem.href ? "text-primary font-medium" : "text-muted-foreground"}`}
                                >
                                  {subItem.name}
                                </Link>
                                {'subItems' in subItem && subItem.subItems && renderMobileSubMenu(subItem.subItems)}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="ghost" className="justify-start px-2" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Cerrar Sesión
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <Hospital className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary hidden md:inline-block">Hospital José Agurto Tello</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems
            .filter(item => {
              // Extraer el nombre de la sección de la URL
              const sectionName = item.href.split('/').pop() || '';
              // Verificar si el usuario tiene acceso a esta sección
              return hasAccessToSection(sectionName);
            })
            .map((item) => (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`flex items-center gap-2 text-sm ${pathname === item.href ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
              >
                {item.icon}
                {item.name}
              </Link>

              {/* Menú desplegable para categorías */}
              {item.subCategories && (
                <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-background rounded-md shadow-md border p-2 flex flex-col gap-1">
                    {item.subCategories.map((category, idx) => (
                      <div key={idx} className="relative group/category">
                        <div className="text-sm font-medium px-3 py-2 rounded-sm flex justify-between items-center hover:bg-muted">
                          {category.name}
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <div className="absolute left-full top-0 pt-0 pl-2 w-64 opacity-0 invisible group-hover/category:opacity-100 group-hover/category:visible transition-all duration-200 z-50">
                          <div className="bg-background rounded-md shadow-md border p-2 flex flex-col gap-1">
                            {category.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`text-sm px-3 py-2 rounded-sm flex items-center gap-2 ${pathname === subItem.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
                              >
                                {subItem.icon}
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menú desplegable para subítems (para Almacenes, Ventas, etc.) */}
              {item.subItems && !item.subCategories && (
                <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-background rounded-md shadow-md border p-2 flex flex-col gap-1">
                    {item.subItems.map((subItem) => (
                      <div key={typeof subItem === "object" ? subItem.href : ""} className="relative group/subitem">
                        {typeof subItem === "object" && (
                          <>
                            <Link
                              href={subItem.href}
                              className={`text-sm px-3 py-2 rounded-sm flex justify-between items-center ${pathname === subItem.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              {subItem.name}
                              {'subItems' in subItem && subItem.subItems && <ChevronRight className="h-4 w-4" />}
                            </Link>

                            {'subItems' in subItem && subItem.subItems && (
                              <div className="absolute left-full top-0 pt-0 pl-2 w-64 opacity-0 invisible group-hover/subitem:opacity-100 group-hover/subitem:visible transition-all duration-200 z-50">
                                <div className="bg-background rounded-md shadow-md border p-2 flex flex-col gap-1">
                                  {subItem.subItems.map((nestedItem: SubItem) => (
                                    <Link
                                      key={nestedItem.href}
                                      href={nestedItem.href}
                                      className={`text-sm px-3 py-2 rounded-sm ${pathname === nestedItem.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
                                    >
                                      {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                {isReadOnly ? <EyeIcon className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
                <span className="text-sm">Hola, {userName}</span>
                {isReadOnly && (
                  <Badge variant="outline" className="ml-2 text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                    Solo Lectura
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              {isReadOnly && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Modo Solo Lectura
                  </Badge>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
