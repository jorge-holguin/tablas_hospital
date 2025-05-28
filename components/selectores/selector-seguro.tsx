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

interface Seguro {
  SEGURO: string
  NOMBRE: string
  ACTIVO?: number
}

interface SelectorSeguroProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  onlyActive?: boolean
}

export function SelectorSeguro({
  value,
  onChange,
  placeholder = "Seleccionar seguro...",
  disabled = false,
  required = false,
  className = "",
  onlyActive = true
}: SelectorSeguroProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [seguros, setSeguros] = useState<Seguro[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSeguro, setSelectedSeguro] = useState<Seguro | null>(null)

  // Cargar el seguro seleccionado al montar el componente
  useEffect(() => {
    const loadSelectedSeguro = async () => {
      if (!value) {
        setSelectedSeguro(null)
        return
      }

      try {
        // Solo cargar si no tenemos el seguro en la lista actual
        if (!seguros.some(s => s.SEGURO === value)) {
          setLoading(true)
          const response = await fetch(`/api/seguros/${value}`)
          const result = await response.json()

          if (result.success) {
            setSelectedSeguro(result.data)
          }
        } else {
          // Si ya tenemos el seguro en la lista, usarlo
          setSelectedSeguro(seguros.find(s => s.SEGURO === value) || null)
        }
      } catch (error) {
        console.error("Error al cargar seguro seleccionado:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSelectedSeguro()
  }, [value, seguros])

  // Cargar seguros cuando se abre el popover o cambia el término de búsqueda
  useEffect(() => {
    const loadSeguros = async () => {
      if (!open) return

      setLoading(true)
      try {
        const response = await fetch(
          `/api/selectores/seguros?search=${searchTerm}&limit=20`
        )
        const result = await response.json()
        setSeguros(result)
      } catch (error) {
        console.error("Error al cargar seguros:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSeguros()
  }, [open, searchTerm])

  // Manejar la selección de un seguro
  const handleSelect = (seguroId: string) => {
    const selected = seguros.find(s => s.SEGURO === seguroId) || null
    setSelectedSeguro(selected)
    onChange(seguroId)
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
          ) : selectedSeguro ? (
            `${selectedSeguro.SEGURO} - ${selectedSeguro.NOMBRE}`
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput 
            placeholder="Buscar seguro..." 
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
              <CommandEmpty>No se encontraron seguros.</CommandEmpty>
              <CommandGroup>
                {seguros.map((seguro) => (
                  <CommandItem
                    key={seguro.SEGURO}
                    value={seguro.SEGURO}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === seguro.SEGURO ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {seguro.SEGURO} - {seguro.NOMBRE}
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
