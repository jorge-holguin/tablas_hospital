import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma/client'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key')

export async function verifyAuth(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}

export async function authenticate(username: string, password: string) {
  // Excepción especial para el usuario LECTOR
  if (username === 'LECTOR' && password === '1234') {
    console.log('Acceso especial para usuario de solo lectura')
    
    // Crear token para usuario de solo lectura
    const token = await new SignJWT({ 
      id: 'LECTOR',
      username: 'LECTOR',
      role: 'SOLO_LECTURA' 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(secret)

    return { 
      token, 
      user: {
        USUARIO: 'LECTOR',
        PERFIL: 'SOLO_LECTURA', 
        NOMBRE: 'Usuario de Lectura'
      }
    }
  }
  
  // Autenticación normal para otros usuarios
  const user = await prisma.uSUARIO.findUnique({
    where: { MODULO_USUARIO: { MODULO: "FARMACIA", USUARIO: username } }
  })

  if (!user) throw new Error('Usuario no encontrado')

  // Verificar si el usuario está activo
  if (Number(user.ACTIVO) !== 1) {
    throw new Error('Usuario inactivo')
  }

  // Comparación directa de contraseñas sin encriptación
  if (user.CONTRASENA !== password) {
    throw new Error('Contraseña incorrecta')
  }

  // Asumiendo que el campo CARGO se usa como rol/perfil
  const token = await new SignJWT({ 
    id: user.USUARIO,
    username: user.USUARIO,
    role: user.CARGO 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret)

  return { 
    token, 
    user: {
      USUARIO: user.USUARIO,
      PERFIL: user.CARGO, 
      NOMBRE: user.NOMBRE
    }
  }
}
