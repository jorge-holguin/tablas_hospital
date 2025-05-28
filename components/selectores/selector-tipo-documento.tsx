"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

interface TipoDocumento {
  TIPO_DOCUMENTO: string
  NOMBRE: string
  ACTIVO: number
}

interface SelectorTipoDocumentoProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  onlyActive?: boolean
}

export function SelectorTipoDocumento({
  value,
  onChange,
  placeholder = "Seleccionar tipo de documento...",
  disabled = false,
  required = false,
  className = "",
  onlyActive = true
}: SelectorTipoDocumentoProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<TipoDocumento | null>(null)

  // Cargar el tipo de documento seleccionado al montar el componente
  useEffect(() => {
    const loadSelectedTipoDocumento = async () => {
      if (!value) {
        setSelectedTipoDocumento(null)
        return
      }

      try {
        // Solo cargar si no tenemos el tipo de documento en la lista actual
        if (!tiposDocumento.some(td => td.TIPO_DOCUMENTO === value)) {
          setLoading(true)
          const response = await fetch(`/api/tipos-documento/${value}`)
          const result = await response.json()

          if (result.success) {
            setSelectedTipoDocumento(result.data)
          }
        } else {
          // Si ya tenemos el tipo de documento en la lista, usarlo
          setSelectedTipoDocumento(tiposDocumento.find(td => td.TIPO_DOCUMENTO === value) || null)
        }
      } catch (error) {
        console.error("Error al cargar tipo de documento seleccionado:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSelectedTipoDocumento()
  }, [value, tiposDocumento])

  // Cargar tipos de documento cuando se abre el popover o cambia el término de búsqueda
  useEffect(() => {
    const loadTiposDocumento = async () => {
      if (!open) return

      setLoading(true)
      try {
        const activo = onlyActive ? 1 : undefined
        const response = await fetch(
          `/api/selectores/tipos-documento?search=${searchTerm}&limit=20${activo !== undefined ? `&activo=${activo}` : ''}`
        )
        const result = await response.json()

        if (result.success) {
          setTiposDocumento(result.data)
        }
      } catch (error) {
        console.error("Error al cargar tipos de documento:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTiposDocumento()
  }, [open, searchTerm, onlyActive])

  // Manejar la selección de un tipo de documento
  const handleSelect = (tipoDocumentoId: string) => {
    const selected = tiposDocumento.find(td => td.TIPO_DOCUMENTO === tipoDocumentoId) || null
    setSelectedTipoDocumento(selected)
    onChange(tipoDocumentoId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : selectedTipoDocumento ? (
            `${selectedTipoDocumento.TIPO_DOCUMENTO} - ${selectedTipoDocumento.NOMBRE}`
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput 
            placeholder="Buscar tipo de documento..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {loading ? (
            <div className="p-2">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <CommandEmpty>No se encontraron tipos de documento.</CommandEmpty>
              <CommandGroup>
                {tiposDocumento.map((tipoDocumento) => (
                  <CommandItem
                    key={tipoDocumento.TIPO_DOCUMENTO}
                    value={tipoDocumento.TIPO_DOCUMENTO}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === tipoDocumento.TIPO_DOCUMENTO ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tipoDocumento.TIPO_DOCUMENTO} - {tipoDocumento.NOMBRE}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
