import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const result = await authenticate(username, password)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error de autenticación:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error de autenticación' },
      { status: 401 }
    )
  }
}
