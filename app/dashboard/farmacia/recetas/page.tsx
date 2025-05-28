"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { ArrowLeft, Calendar as CalendarIcon, Search, Plus, Edit, Trash2, FileText, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import RecetaDialog from "./components/receta-dialog"

interface Receta {
  ID_RECETAS: number
  ATENCION_ID: string
  MODULO: string
  SEGURO: string
  ITEM: string
  CIEX: string
  PRECIO: number
  CANTIDAD: number
  DOSIS: number
  FRECUENCIA: number
  DIAS: number
  VIA: number
  ORD: number
  ESTADO: number
  FECHA: string | Date
  CANTIDAD_ENTREG: number
  TIEMPO?: number
  EDAD?: number
  INDICACIONES?: string
  COD_MEDICO?: string
  NUM_REC?: string
  CONSULTORIO?: string
  FECHA_UPDATE?: string | Date
  METODO?: string
  INDIC_GENERALES?: string
  NUEVO: number
}

export default function RecetasPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Estados para la paginación y búsqueda
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined)
  const [fechaFin, setFechaFin] = useState<Date | undefined>(undefined)
  
  // Estados para el diálogo de edición
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReceta, setEditingReceta] = useState<Receta | null>(null)
  
  // Estados para datos de referencia
  const [vias, setVias] = useState<{ id: number, nombre: string }[]>([])
  const [estados, setEstados] = useState<{ id: number, nombre: string }[]>([])
  
  // Cargar datos de referencia al iniciar
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [viasResponse, estadosResponse] = await Promise.all([
          fetch('/api/farmacia/recetas/vias'),
          fetch('/api/farmacia/recetas/estados')
        ])
        
        if (viasResponse.ok && estadosResponse.ok) {
          const viasData = await viasResponse.json()
          const estadosData = await estadosResponse.json()
          
          setVias(viasData)
          setEstados(estadosData)
        }
      } catch (error) {
        console.error('Error al cargar datos de referencia:', error)
      }
    }
    
    loadReferenceData()
  }, [])
  
  // Cargar recetas
  const loadRecetas = async () => {
    setLoading(true)
    try {
      const skip = (currentPage - 1) * pageSize
      
      // Construir parámetros de búsqueda
      const searchParams = new URLSearchParams({
        skip: skip.toString(),
        take: pageSize.toString(),
        orderBy: 'FECHA',
        orderDirection: 'desc'
      })
      
      if (searchTerm) {
        searchParams.append('search', searchTerm)
      }
      
      if (fechaInicio) {
        searchParams.append('fechaInicio', format(fechaInicio, 'yyyy-MM-dd'))
      }
      
      if (fechaFin) {
        searchParams.append('fechaFin', format(fechaFin, 'yyyy-MM-dd'))
      }
      
      // Obtener recetas y conteo total
      const [recetasResponse, countResponse] = await Promise.all([
        fetch(`/api/farmacia/recetas?${searchParams.toString()}`),
        fetch(`/api/farmacia/recetas/count?${new URLSearchParams({
          search: searchTerm,
          ...(fechaInicio && { fechaInicio: format(fechaInicio, 'yyyy-MM-dd') }),
          ...(fechaFin && { fechaFin: format(fechaFin, 'yyyy-MM-dd') })
        }).toString()}`)
      ])
      
      if (recetasResponse.ok && countResponse.ok) {
        const recetasData = await recetasResponse.json()
        const { count } = await countResponse.json()
        
        setRecetas(recetasData)
        setTotalItems(count)
      } else {
        throw new Error('Error al cargar las recetas')
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las recetas',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Cargar recetas al cambiar la página, búsqueda o fechas
  useEffect(() => {
    loadRecetas()
  }, [currentPage, pageSize, searchTerm, fechaInicio, fechaFin])
  
  // Manejar la edición de una receta
  const handleEdit = async (id: number) => {
    try {
      const response = await fetch(`/api/farmacia/recetas/${id}`)
      if (response.ok) {
        const receta = await response.json()
        setEditingReceta(receta)
        setDialogOpen(true)
      } else {
        throw new Error('Error al obtener la receta')
      }
    } catch (error) {
      console.error('Error al editar receta:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar la receta para editar',
        variant: 'destructive'
      })
    }
  }
  
  // Manejar la eliminación de una receta
  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta receta?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/farmacia/recetas/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Receta eliminada correctamente',
          variant: 'default'
        })
        loadRecetas()
      } else {
        throw new Error('Error al eliminar la receta')
      }
    } catch (error) {
      console.error('Error al eliminar receta:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la receta',
        variant: 'destructive'
      })
    }
  }
  
  // Manejar el guardado de una receta (nueva o editada)
  const handleSave = async (receta: Partial<Receta>) => {
    try {
      let response
      
      if (editingReceta) {
        // Actualizar receta existente
        response = await fetch(`/api/farmacia/recetas/${editingReceta.ID_RECETAS}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(receta)
        })
      } else {
        // Crear nueva receta
        response = await fetch('/api/farmacia/recetas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(receta)
        })
      }
      
      if (response.ok) {
        toast({
          title: 'Éxito',
          description: editingReceta ? 'Receta actualizada correctamente' : 'Receta creada correctamente',
          variant: 'default'
        })
        setDialogOpen(false)
        setEditingReceta(null)
        loadRecetas()
      } else {
        throw new Error(editingReceta ? 'Error al actualizar la receta' : 'Error al crear la receta')
      }
    } catch (error) {
      console.error('Error al guardar receta:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar la receta',
        variant: 'destructive'
      })
    }
  }
  
  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / pageSize)
  
  // Obtener el nombre de la vía de administración
  const getViaName = (viaId: number) => {
    const via = vias.find(v => v.id === viaId)
    return via ? via.nombre : `Vía ${viaId}`
  }
  
  // Obtener el nombre del estado
  const getEstadoName = (estadoId: number) => {
    const estado = estados.find(e => e.id === estadoId)
    return estado ? estado.nombre : `Estado ${estadoId}`
  }
  
  // Formatear fecha
  const formatDate = (date: string | Date) => {
    if (!date) return ''
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es })
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Recetas</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>
      
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, ítem, diagnóstico..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicio ? format(fechaInicio, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    onSelect={setFechaInicio}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFin ? format(fechaFin, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    onSelect={setFechaFin}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => {
                  setCurrentPage(1)
                  loadRecetas()
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFechaInicio(undefined)
                  setFechaFin(undefined)
                  setCurrentPage(1)
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  setEditingReceta(null)
                  setDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Receta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabla de Recetas */}
      <Card>
        <CardHeader>
          <CardTitle>Recetas ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Esqueleto de carga
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : recetas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No se encontraron recetas</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Atención</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Ítem</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Vía</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recetas.map((receta) => (
                      <TableRow key={receta.ID_RECETAS}>
                        <TableCell>{receta.ID_RECETAS}</TableCell>
                        <TableCell>{receta.ATENCION_ID}</TableCell>
                        <TableCell>{receta.MODULO}</TableCell>
                        <TableCell>{receta.ITEM}</TableCell>
                        <TableCell>{receta.CIEX}</TableCell>
                        <TableCell>{receta.CANTIDAD}</TableCell>
                        <TableCell>{getViaName(receta.VIA)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={receta.ESTADO === 1 ? "default" : receta.ESTADO === 2 ? "success" : "destructive"}
                          >
                            {getEstadoName(receta.ESTADO)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(receta.FECHA)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEdit(receta.ID_RECETAS)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDelete(receta.ID_RECETAS)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Paginación */}
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                      // Mostrar 5 páginas centradas en la página actual
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = index + 1
                      } else {
                        const start = Math.max(1, currentPage - 2)
                        const end = Math.min(totalPages, start + 4)
                        pageNum = start + index
                        if (pageNum > end) return null
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={currentPage === pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo de edición/creación */}
      <RecetaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        receta={editingReceta}
        onSave={handleSave}
        vias={vias}
        estados={estados}
      />
    </div>
  )
}
