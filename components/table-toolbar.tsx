"use client"

import React, { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Printer, FileSpreadsheet, ArrowLeft, Plus, Pencil, Trash2, Filter } from "lucide-react"
import Link from "next/link"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface TableToolbarProps {
  title?: string
  searchPlaceholder?: string
  searchQuery?: string
  backUrl?: string
  showNewButton?: boolean
  showEditButton?: boolean
  showDeleteButton?: boolean
  showFilterButton?: boolean
  newButtonText?: string
  disableEdit?: boolean
  disableDelete?: boolean
  onSearch?: (query: string) => void
  onSearchChange?: (query: string) => void
  onRefresh?: () => void
  onNew?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onPrint?: () => void
  onExport?: () => void
  onFilter?: () => void
}

export function TableToolbar({
  title,
  searchPlaceholder = "Buscar por código o descripción...",
  searchQuery = "",
  backUrl = "/dashboard/tablas",
  showNewButton = true,
  showEditButton = true,
  showDeleteButton = true,
  showFilterButton = true,
  newButtonText = "Nuevo",
  disableEdit = true,
  disableDelete = true,
  onSearch,
  onSearchChange,
  onRefresh,
  onNew,
  onEdit,
  onDelete,
  onPrint,
  onExport,
  onFilter,
}: TableToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInternalSearchQuery(value)
    
    if (onSearchChange) {
      onSearchChange(value)
    }
    
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleDelete = () => {
    setConfirmDialogOpen(true)
  }

  const confirmDelete = () => {
    if (onDelete) {
      onDelete()
    }
    setConfirmDialogOpen(false)
  }

  useEffect(() => {
    setInternalSearchQuery(searchQuery)
  }, [searchQuery])

  return (
    <div className="space-y-4">
      {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full"
              value={internalSearchQuery}
              onChange={handleSearch}
            />
          </div>

          {showFilterButton && (
            <Button variant="outline" onClick={onFilter}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          )}
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {showNewButton && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onNew}>
                <Plus className="h-4 w-4 mr-2" />
                {newButtonText}
              </Button>
            )}

            {showEditButton && (
              <Button variant="outline" disabled={disableEdit} onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}

            {showDeleteButton && (
              <Button variant="outline" disabled={disableDelete} onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>

            <Button variant="outline" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>

            <Button variant="outline" onClick={onExport}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>

            <Link href={backUrl}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="¿Está seguro de eliminar?"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  )
}
