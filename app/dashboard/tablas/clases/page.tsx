"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash, FileSpreadsheet, ArrowLeft, Filter, RefreshCw, Printer } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function ClasesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Datos de ejemplo
  const clases = [
    { id: 1, codigo: "0", nombre: "Ninguno", activo: "0", clasificador: "1.3.1.6.12" },
    { id: 2, codigo: "A", nombre: "MEDICAMENTOS", activo: "1", clasificador: "1.3.1.6.12" },
    { id: 3, codigo: "B", nombre: "MEDICAMENTOS NATURALES", activo: "0", clasificador: "1.3.1.6.12" },
    { id: 4, codigo: "C", nombre: "GRATUITOS", activo: "0", clasificador: "1.3.1.6.12" },
    { id: 5, codigo: "D", nombre: "MEDICAMENTOS HOMEOPATICOS", activo: "0", clasificador: "1.3.1.6.12" },
    { id: 6, codigo: "E", nombre: "GALENICOS", activo: "0", clasificador: "1.3.1.6.12" },
    { id: 7, codigo: "F", nombre: "DISPOSITIVOS MEDICOS", activo: "1", clasificador: "1.3.1.6.12" },
    { id: 8, codigo: "G", nombre: "INSUMOS QUIMICOS PARA PREPARAD", activo: "0", clasificador: "1.3.1.6.12" },
    { id: 9, codigo: "H", nombre: "PRODUCTOS DE TOCADOR", activo: "0", clasificador: "1.3.1.6.12" },
    { id: 10, codigo: "I", nombre: "INSUMOS MEDICOS A SERV.", activo: "1", clasificador: "1.3.1.6.13" },
  ]

  // Filtrar clases basado en el término de búsqueda
  const filteredClases = clases.filter(
    (clase) =>
      clase.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clase.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredClases.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar selección individual
  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === filteredClases.length) {
        setSelectAll(true)
      }
    }
  }

  const handleRefresh = () => {
    setSearchTerm("")
    toast({
      title: "Actualizado",
      description: "La lista ha sido actualizada",
    })
  }

  const handlePrint = () => {
    toast({
      title: "Imprimiendo",
      description: "Enviando documento a la impresora",
    })
  }

  const handleExport = () => {
    toast({
      title: "Exportando",
      description: "Exportando datos a Excel",
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Tabla de Clases</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar por código o nombre..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Clase
          </Button>

          <Button variant="outline" disabled={selectedItems.length !== 1}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>

          <Button variant="outline" disabled={selectedItems.length === 0}>
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>

          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>

          <Link href="/dashboard/tablas">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Seleccionar todos" />
                  </TableHead>
                  <TableHead>CLASE</TableHead>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>ACTIVO</TableHead>
                  <TableHead>CLASIFICADOR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClases.length > 0 ? (
                  filteredClases.map((clase) => (
                    <TableRow key={clase.id} className={selectedItem === clase.id ? "bg-primary/10" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(clase.id)}
                          onCheckedChange={() => handleSelectItem(clase.id)}
                          aria-label={`Seleccionar clase ${clase.codigo}`}
                        />
                      </TableCell>
                      <TableCell onClick={() => setSelectedItem(clase.id)}>{clase.codigo}</TableCell>
                      <TableCell onClick={() => setSelectedItem(clase.id)}>{clase.nombre}</TableCell>
                      <TableCell onClick={() => setSelectedItem(clase.id)}>{clase.activo}</TableCell>
                      <TableCell onClick={() => setSelectedItem(clase.id)}>{clase.clasificador}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

