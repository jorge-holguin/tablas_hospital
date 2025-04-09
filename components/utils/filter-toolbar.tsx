import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, RefreshCw } from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterActive: string | null
  onFilterActiveChange: (value: string | null) => void
  onRefresh: () => void
  placeholder?: string
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchTerm,
  onSearchChange,
  filterActive,
  onFilterActiveChange,
  onRefresh,
  placeholder = "Buscar por código o nombre..."
}) => {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder={placeholder}
          className="w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros {filterActive !== null && <span className="ml-1 h-2 w-2 rounded-full bg-primary"></span>}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={filterActive !== null ? filterActive : 'all'} 
                onValueChange={(value) => {
                  if (value === 'all') {
                    onFilterActiveChange(null)
                  } else {
                    onFilterActiveChange(value)
                  }
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Activos</SelectItem>
                  <SelectItem value="0">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={() => setFilterSheetOpen(false)}>
                Aplicar filtros
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Actualizar
      </Button>
    </div>
  )
}
