"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileSpreadsheet, Search, RefreshCw } from "lucide-react"
import Link from "next/link"

// Tipos
interface Medico {
  id: string
  nombre: string
  colegio: string
  profesion: string
  especialidad: string
  cargo: string
  abreviatura: string
  consultorio: string
  activo: boolean
  old: string
  colesp: string
  dni: string
  hisCodMed: string
  codhis: string
  eess: string
  cc: string
}

export default function MedicosPage() {
  // Estado para los médicos
  const [medicos, setMedicos] = useState<Medico[]>([
    {
      id: "PCJ",
      nombre: "PINTADO CABALLERO JOSÉ BELÉN",
      colegio: "35862",
      profesion: "MEDICO CARDIOLOGO",
      especialidad: "0019",
      cargo: "",
      abreviatura: "MED",
      consultorio: "10",
      activo: true,
      old: "",
      colesp: "029702",
      dni: "09768720",
      hisCodMed: "47536",
      codhis: "10976872001",
      eess: "00000059947",
      cc: "N",
    },
    {
      id: "PVA",
      nombre: "PARDAVE VIZURRAGA ANTONIO ELEODORO",
      colegio: "13054",
      profesion: "MEDICO",
      especialidad: "0031",
      cargo: "",
      abreviatura: "MED",
      consultorio: "20",
      activo: true,
      old: "",
      colesp: "007437",
      dni: "07468806",
      hisCodMed: "13058",
      codhis: "10746880601",
      eess: "00000059947",
      cc: "N",
    },
    {
      id: "ABC",
      nombre: "ARROYO BASTO CARLOS ALEJANDRO",
      colegio: "32776",
      profesion: "MEDICO",
      especialidad: "0026",
      cargo: "",
      abreviatura: "MED",
      consultorio: "20",
      activo: false,
      old: "",
      colesp: "",
      dni: "00000003",
      hisCodMed: "",
      codhis: "",
      eess: "00000059947",
      cc: "N",
    },
    {
      id: "ABP",
      nombre: "ABAD BARREDO PEDRO MANUEL",
      colegio: "015091",
      profesion: "MEDICO GINECO-OBST",
      especialidad: "0024",
      cargo: "",
      abreviatura: "MED",
      consultorio: "40",
      activo: true,
      old: "",
      colesp: "019923",
      dni: "05955940",
      hisCodMed: "46009",
      codhis: "10296594001",
      eess: "00000059947",
      cc: "N",
    },
    {
      id: "ACF",
      nombre: "AQUINO CUEVA FRANCISCO JAVIER",
      colegio: "033111",
      profesion: "MEDICO",
      especialidad: "0017",
      cargo: "",
      abreviatura: "MED",
      consultorio: "10",
      activo: false,
      old: "",
      colesp: "",
      dni: "00000004",
      hisCodMed: "",
      codhis: "",
      eess: "00000059947",
      cc: "C",
    },
  ])

  // Estado para el filtro de búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar médicos según el término de búsqueda
  const filteredMedicos = medicos.filter(
    (medico) =>
      medico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para exportar a Excel
  const handleExportExcel = () => {
    alert("Exportando a Excel...")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Médicos</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/tablas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setSearchTerm("")}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Colegio</TableHead>
              <TableHead>Profesión</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Abreviatura</TableHead>
              <TableHead>Consultorio</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>HIS Código</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4">
                  No se encontraron médicos
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicos.map((medico) => (
                <TableRow key={medico.id}>
                  <TableCell>{medico.id}</TableCell>
                  <TableCell>{medico.nombre}</TableCell>
                  <TableCell>{medico.colegio}</TableCell>
                  <TableCell>{medico.profesion}</TableCell>
                  <TableCell>{medico.especialidad}</TableCell>
                  <TableCell>{medico.cargo}</TableCell>
                  <TableCell>{medico.abreviatura}</TableCell>
                  <TableCell>{medico.consultorio}</TableCell>
                  <TableCell>{medico.activo ? "Sí" : "No"}</TableCell>
                  <TableCell>{medico.dni}</TableCell>
                  <TableCell>{medico.hisCodMed}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

