import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // Añadir logs para depuración
  console.log('Middleware ejecutándose para:', request.nextUrl.pathname)
  
  const token = request.cookies.get('token')?.value
  console.log('Token encontrado:', token ? 'Sí' : 'No')

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/api/auth/login']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isPublicPath) {
    console.log('Ruta pública, permitiendo acceso')
    return NextResponse.next()
  }

  if (!token) {
    console.log('No hay token, redirigiendo a login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Para pruebas, permitir el token mock
    if (token === 'mock-jwt-token-12345') {
      console.log('Token mock válido, permitiendo acceso')
      return NextResponse.next()
    }
    
    // Verificación normal para tokens reales
    const verifiedToken = await verifyAuth(token)
    console.log('Token verificado correctamente')
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
