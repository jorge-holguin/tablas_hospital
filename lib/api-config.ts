// Configuración para las rutas de API
export const apiConfig = {
  // Rutas públicas que no requieren autenticación
  publicRoutes: [
    '/api/tablas/consultorios',
    '/api/tablas/origenes',
    '/api/tablas/etnias',
    '/api/tablas/tipos-documento',
    '/api/tablas/seguros',
    '/api/tablas/financiamientos',
    '/api/tablas/ubigeos',
    '/api/tablas/diagnosticos-his-v2',
    '/api/tablas/medicos'
  ],
  
  // Verificar si una ruta es pública
  isPublicRoute: (path: string) => {
    return apiConfig.publicRoutes.some(route => 
      path.startsWith(route)
    )
  }
}
