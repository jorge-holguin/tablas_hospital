import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Printer } from "lucide-react"

// Datos de ejemplo para las curvas ABC
const curvasABCData = [
  {
    id: 1,
    codigo: "MED001",
    nombre: "Paracetamol 500mg",
    consumo: 12500,
    valorizado: 6250.0,
    porcentaje: 25.0,
    clasificacion: "A",
  },
  {
    id: 2,
    codigo: "MED002",
    nombre: "Ibuprofeno 400mg",
    consumo: 8500,
    valorizado: 6375.0,
    porcentaje: 20.0,
    clasificacion: "A",
  },
  {
    id: 3,
    codigo: "MED003",
    nombre: "Amoxicilina 500mg",
    consumo: 5200,
    valorizado: 6240.0,
    porcentaje: 15.0,
    clasificacion: "A",
  },
  {
    id: 4,
    codigo: "MED004",
    nombre: "Loratadina 10mg",
    consumo: 3800,
    valorizado: 3420.0,
    porcentaje: 10.0,
    clasificacion: "B",
  },
  {
    id: 5,
    codigo: "MED005",
    nombre: "Omeprazol 20mg",
    consumo: 3200,
    valorizado: 4800.0,
    porcentaje: 8.0,
    clasificacion: "B",
  },
  {
    id: 6,
    codigo: "MED006",
    nombre: "Metformina 850mg",
    consumo: 2800,
    valorizado: 1820.0,
    porcentaje: 7.0,
    clasificacion: "B",
  },
  {
    id: 7,
    codigo: "MED007",
    nombre: "Enalapril 10mg",
    consumo: 2500,
    valorizado: 2000.0,
    porcentaje: 5.0,
    clasificacion: "C",
  },
  {
    id: 8,
    codigo: "MED008",
    nombre: "Salbutamol Inhalador",
    consumo: 1200,
    valorizado: 18000.0,
    porcentaje: 4.0,
    clasificacion: "C",
  },
  {
    id: 9,
    codigo: "MED009",
    nombre: "Losartán 50mg",
    consumo: 1800,
    valorizado: 1440.0,
    porcentaje: 3.5,
    clasificacion: "C",
  },
  {
    id: 10,
    codigo: "MED010",
    nombre: "Atorvastatina 20mg",
    consumo: 1500,
    valorizado: 2250.0,
    porcentaje: 2.5,
    clasificacion: "C",
  },
]

// Datos de resumen por clasificación
const resumenClasificacion = [
  { clasificacion: "A", items: 3, porcentaje: 60, color: "bg-green-500" },
  { clasificacion: "B", items: 3, porcentaje: 25, color: "bg-yellow-500" },
  { clasificacion: "C", items: 4, porcentaje: 15, color: "bg-red-500" },
]

export default function CurvasABCPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curvas ABC</h1>
          <p className="text-muted-foreground">Análisis de consumo y valorización de productos</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {resumenClasificacion.map((item) => (
          <Card
            key={item.clasificacion}
            className="border-t-4"
            style={{
              borderTopColor:
                item.color.replace("bg-", "") === "bg-green-500"
                  ? "#22c55e"
                  : item.color.replace("bg-", "") === "bg-yellow-500"
                    ? "#eab308"
                    : "#ef4444",
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">Clasificación {item.clasificacion}</CardTitle>
              <CardDescription>
                {item.items} items ({item.porcentaje}% del valor total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-4 mt-2">
                <div className={`${item.color} h-4 rounded-full`} style={{ width: `${item.porcentaje}%` }}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="periodo" className="text-sm font-medium">
            Periodo
          </label>
          <Select defaultValue="ultimo-trimestre">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimo-mes">Último mes</SelectItem>
              <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
              <SelectItem value="ultimo-semestre">Último semestre</SelectItem>
              <SelectItem value="ultimo-anio">Último año</SelectItem>
            </SelectContent>
          </Select>
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

      <Card>
        <CardHeader>
          <CardTitle>Análisis de Curvas ABC</CardTitle>
          <CardDescription>Clasificación de productos según su valor y consumo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Consumo</TableHead>
                <TableHead className="text-right">Valorizado (S/.)</TableHead>
                <TableHead className="text-right">Porcentaje (%)</TableHead>
                <TableHead>Clasificación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curvasABCData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell className="text-right">{item.consumo.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.valorizado.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.porcentaje.toFixed(2)}%</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.clasificacion === "A"
                          ? "bg-green-100 text-green-800"
                          : item.clasificacion === "B"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.clasificacion}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interpretación de Resultados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Clasificación A (60% del valor)</h3>
              <p className="text-sm text-muted-foreground">
                Productos de alto valor que requieren un control estricto de inventario. Representan aproximadamente el
                20% de los items pero constituyen el 60% del valor total.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Clasificación B (25% del valor)</h3>
              <p className="text-sm text-muted-foreground">
                Productos de valor medio que requieren un control regular. Representan aproximadamente el 30% de los
                items y constituyen el 25% del valor total.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Clasificación C (15% del valor)</h3>
              <p className="text-sm text-muted-foreground">
                Productos de bajo valor que requieren un control mínimo. Representan aproximadamente el 50% de los items
                pero solo constituyen el 15% del valor total.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Para productos A</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Realizar conteos de inventario frecuentes</li>
                <li>Mantener niveles de seguridad adecuados</li>
                <li>Monitorear constantemente la demanda</li>
                <li>Establecer relaciones sólidas con proveedores</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-1">Para productos B</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Realizar conteos periódicos</li>
                <li>Mantener niveles de seguridad moderados</li>
                <li>Revisar la demanda mensualmente</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-1">Para productos C</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Realizar conteos ocasionales</li>
                <li>Simplificar los controles de inventario</li>
                <li>Considerar pedidos de mayor volumen y menor frecuencia</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

