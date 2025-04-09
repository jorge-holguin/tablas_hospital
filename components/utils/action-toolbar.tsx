import React from 'react'
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash, FileSpreadsheet, ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"

interface ActionToolbarProps {
  onNew: () => void
  onEdit: () => void
  onDelete: () => void
  onPrint: () => void
  onExport: () => void
  backUrl: string
  selectedItems: any[]
  entityName: string
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onNew,
  onEdit,
  onDelete,
  onPrint,
  onExport,
  backUrl,
  selectedItems,
  entityName
}) => {
  return (
    <div className="flex flex-wrap justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onNew}>
          <Plus className="h-4 w-4 mr-2" />
          {`Nuevo ${entityName}`}
        </Button>

        <Button variant="outline" onClick={onEdit} disabled={selectedItems.length !== 1}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>

        <Button variant="outline" onClick={onDelete} disabled={selectedItems.length === 0}>
          <Trash className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
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
  )
}
