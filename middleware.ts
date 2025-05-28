import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { apiConfig } from '@/lib/api-config'

export async function middleware(request: NextRequest) {
  // Añadir logs para depuración
  console.log('Middleware ejecutándose para:', request.nextUrl.pathname)
  
  const token = request.cookies.get('token')?.value
  console.log('Token encontrado:', token ? 'Sí' : 'No')

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/api/auth/login', '/dashboard', '/dashboard/tablas', '/dashboard/tablas/:path*']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isPublicPath) {
    console.log('Ruta pública, permitiendo acceso')
    return NextResponse.next()
  }

  if (!token) {
    // Si la ruta comienza con /dashboard/tablas o es una API de tablas, permitir acceso sin token
    if (request.nextUrl.pathname.startsWith('/dashboard/tablas') || 
        (request.nextUrl.pathname.startsWith('/api/tablas') && apiConfig.isPublicRoute(request.nextUrl.pathname))) {
      console.log('Acceso permitido sin token (usuario lector)')
      return NextResponse.next()
    }
    
    // Para otras rutas protegidas, redirigir a login
    console.log('No hay token, redirigiendo a login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Para pruebas, permitir el token mock
    if (token === 'mock-jwt-token-12345') {
      console.log('Token mock válido, permitiendo acceso')
      return NextResponse.next()
    }
    
    // Verificar si es una ruta de API de tablas (solo lectura)
    const isTablesApiRoute = request.nextUrl.pathname.startsWith('/api/tablas');
    const isGetRequest = request.method === 'GET';
    
    // Si es una solicitud GET a la API de tablas, permitir incluso con token expirado
    if (isTablesApiRoute && isGetRequest) {
      try {
        // Intentar verificar el token, pero no fallar si está expirado
        const verifiedToken = await verifyAuth(token)
        console.log('Token verificado correctamente')
        return NextResponse.next()
      } catch (tokenError) {
        // Si el token está expirado pero es una ruta de tablas de solo lectura, permitir acceso
        console.log('Token expirado pero permitiendo acceso a API de tablas (solo lectura)')
        return NextResponse.next()
      }
    }
    
    // Verificación normal para tokens reales en otras rutas
    const verifiedToken = await verifyAuth(token)
    console.log('Token verificado correctamente')
    
    // Verificar restricciones para el usuario LECTOR (rol SOLO_LECTURA)
    if (verifiedToken.role === 'SOLO_LECTURA') {
      // Rutas restringidas para el usuario LECTOR
      const restrictedPaths = [
        '/dashboard/almacenes',
        '/dashboard/ventas',
        '/dashboard/reportes'
      ]
      
      // Verificar si la ruta actual está restringida
      const isRestrictedPath = restrictedPaths.some(path => 
        request.nextUrl.pathname.startsWith(path)
      )
      
      if (isRestrictedPath) {
        console.log('Usuario LECTOR intentando acceder a ruta restringida, redirigiendo a dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    
    return NextResponse.next()
  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ]
}
