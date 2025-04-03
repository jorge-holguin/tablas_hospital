import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, Search, User } from "lucide-react"

// Datos de ejemplo para las recetas
const recetasData = [
  {
    id: 1,
    fecha: "2023-03-15",
    numero: "REC-001234",
    paciente: "Juan Pérez",
    medico: "Dr. Carlos Gómez",
    servicio: "Medicina General",
    estado: "Dispensada",
  },
  {
    id: 2,
    fecha: "2023-03-16",
    numero: "REC-001235",
    paciente: "María López",
    medico: "Dra. Ana Rodríguez",
    servicio: "Cardiología",
    estado: "Pendiente",
  },
  {
    id: 3,
    fecha: "2023-03-16",
    numero: "REC-001236",
    paciente: "Pedro Ramírez",
    medico: "Dr. Luis Torres",
    servicio: "Pediatría",
    estado: "Dispensada",
  },
  {
    id: 4,
    fecha: "2023-03-17",
    numero: "REC-001237",
    paciente: "Carmen Silva",
    medico: "Dra. Sofía Vargas",
    servicio: "Ginecología",
    estado: "Dispensada",
  },
  {
    id: 5,
    fecha: "2023-03-17",
    numero: "REC-001238",
    paciente: "Roberto Díaz",
    medico: "Dr. Carlos Gómez",
    servicio: "Medicina General",
    estado: "Pendiente",
  },
  {
    id: 6,
    fecha: "2023-03-18",
    numero: "REC-001239",
    paciente: "Lucía Mendoza",
    medico: "Dr. Javier Ruiz",
    servicio: "Traumatología",
    estado: "Dispensada",
  },
  {
    id: 7,
    fecha: "2023-03-18",
    numero: "REC-001240",
    paciente: "Fernando Castro",
    medico: "Dra. Ana Rodríguez",
    servicio: "Cardiología",
    estado: "Anulada",
  },
]

// Datos de ejemplo para el detalle de una receta
const detalleRecetaData = [
  {
    id: 1,
    codigo: "MED001",
    nombre: "Paracetamol 500mg",
    presentacion: "Tableta",
    cantidad: 20,
    indicaciones: "1 tableta cada 8 horas por 7 días",
  },
  {
    id: 2,
    codigo: "MED003",
    nombre: "Amoxicilina 500mg",
    presentacion: "Cápsula",
    cantidad: 21,
    indicaciones: "1 cápsula cada 8 horas por 7 días",
  },
  {
    id: 3,
    codigo: "MED005",
    nombre: "Omeprazol 20mg",
    presentacion: "Cápsula",
    cantidad: 14,
    indicaciones: "1 cápsula antes del desayuno por 14 días",
  },
]

export default function RecetasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recetas</h1>
          <p className="text-muted-foreground">Gestión y seguimiento de recetas médicas</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="fecha" className="text-sm font-medium">
            Fecha
          </label>
          <Select defaultValue="hoy">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="ayer">Ayer</SelectItem>
              <SelectItem value="semana">Esta semana</SelectItem>
              <SelectItem value="mes">Este mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por paciente o número..." className="w-full pl-8" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recetas del Día</CardTitle>
            <CardDescription>Total de recetas emitidas hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                Dispensadas: 10
              </div>
              <div className="text-xs">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                Pendientes: 4
              </div>
              <div className="text-xs">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                Anuladas: 1
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Médico con más Recetas</CardTitle>
            <CardDescription>Médico que ha emitido más recetas hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Dr. Carlos Gómez</div>
                <div className="text-sm text-muted-foreground">5 recetas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Medicamento más Recetado</CardTitle>
            <CardDescription>Medicamento con mayor frecuencia en recetas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-medium">Paracetamol 500mg</div>
            <div className="text-sm text-muted-foreground">Presente en 8 recetas</div>
            <div className="text-xs text-muted-foreground mt-1">Total: 160 unidades</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listado">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="listado">Listado de Recetas</TabsTrigger>
          <TabsTrigger value="detalle">Detalle de Receta</TabsTrigger>
        </TabsList>

        <TabsContent value="listado" className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recetasData.map((receta) => (
                <TableRow key={receta.id}>
                  <TableCell>{receta.fecha}</TableCell>
                  <TableCell className="font-medium">{receta.numero}</TableCell>
                  <TableCell>{receta.paciente}</TableCell>
                  <TableCell>{receta.medico}</TableCell>
                  <TableCell>{receta.servicio}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        receta.estado === "Dispensada"
                          ? "bg-green-100 text-green-800"
                          : receta.estado === "Pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {receta.estado}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="detalle">
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Receta</CardTitle>
              <CardDescription>Receta N° REC-001234 | Fecha: 15/03/2023</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Información del Paciente</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Nombre:</div>
                    <div>Juan Pérez</div>
                    <div className="text-muted-foreground">Historia Clínica:</div>
                    <div>HC-123456</div>
                    <div className="text-muted-foreground">Edad:</div>
                    <div>45 años</div>
                    <div className="text-muted-foreground">Tipo de Atención:</div>
                    <div>Consulta Externa</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Información del Médico</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Nombre:</div>
                    <div>Dr. Carlos Gómez</div>
                    <div className="text-muted-foreground">Especialidad:</div>
                    <div>Medicina General</div>
                    <div className="text-muted-foreground">CMP:</div>
                    <div>12345</div>
                    <div className="text-muted-foreground">Servicio:</div>
                    <div>Medicina General</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Medicamentos Recetados</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Presentación</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead>Indicaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalleRecetaData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>{item.presentacion}</TableCell>
                        <TableCell className="text-right">{item.cantidad}</TableCell>
                        <TableCell>{item.indicaciones}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Observaciones</div>
                <div className="text-sm p-3 border rounded-md bg-muted/20">
                  Paciente con hipertensión arterial controlada. Seguimiento en 15 días.
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="gap-1">
                  <Printer className="h-4 w-4" />
                  Imprimir Receta
                </Button>
                <Button className="bg-primary hover:bg-primary/90">Dispensar Medicamentos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

