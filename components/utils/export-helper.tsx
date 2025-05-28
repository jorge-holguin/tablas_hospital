import React from 'react'

interface Column {
  key: string
  header: string
  format?: (value: any, row?: Record<string, any>) => string
}

interface ExportHelperProps {
  filename: string
  data: any[]
  columns: Column[]
}

export const exportToCSV = ({ filename, data, columns }: ExportHelperProps) => {
  try {
    // Crear un array con los encabezados
    const headers = columns.map(col => col.header)
    
    // Crear un array con los datos
    const csvData = data.map(item => 
      columns.map(col => {
        const value = item[col.key]
        return col.format ? col.format(value, item) : value !== undefined && value !== null ? value : ''
      })
    )
    
    // Combinar encabezados y datos
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    // Crear un blob con el contenido CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // Crear un enlace para descargar el archivo
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    
    return true
  } catch (error) {
    console.error('Error al exportar a CSV:', error)
    return false
  }
}
