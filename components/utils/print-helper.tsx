import React from 'react'

interface Column {
  key: string
  header: string
  format?: (value: any) => string
}

interface PrintHelperProps {
  title: string
  data: any[]
  columns: Column[]
}

export const printData = ({ title, data, columns }: PrintHelperProps) => {
  // Preparar los datos para imprimir
  const printContent = document.createElement('div')
  printContent.innerHTML = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { text-align: center; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="header">
          <div>Fecha: ${new Date().toLocaleDateString()}</div>
          <div>Total: ${data.length} registros</div>
        </div>
        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${col.header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${columns.map(col => {
                  const value = item[col.key];
                  const formattedValue = col.format ? col.format(value) : value;
                  return `<td>${formattedValue !== undefined && formattedValue !== null ? formattedValue : ''}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Sistema de Farmacia - SIGSALUD</p>
        </div>
      </body>
    </html>
  `
  
  // Crear un iframe para imprimir
  const printFrame = document.createElement('iframe')
  printFrame.style.position = 'absolute'
  printFrame.style.top = '-9999px'
  document.body.appendChild(printFrame)
  
  // Escribir el contenido en el iframe y disparar la impresión
  printFrame.contentDocument?.write(printContent.innerHTML)
  printFrame.contentDocument?.close()
  
  return new Promise<void>((resolve, reject) => {
    printFrame.onload = () => {
      try {
        printFrame.contentWindow?.print()
        setTimeout(() => {
          document.body.removeChild(printFrame)
          resolve()
        }, 1000)
      } catch (error) {
        document.body.removeChild(printFrame)
        reject(error)
      }
    }
  })
}
