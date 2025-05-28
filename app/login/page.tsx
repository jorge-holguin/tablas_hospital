"use client"

import type React from "react" 
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Hospital, Lock, User } from "lucide-react"
import { setCookie } from "cookies-next"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      // Guardar token en cookie para que el middleware lo pueda leer
      setCookie('token', data.token)
      
      // Guardar información del usuario en localStorage para uso en la UI
      if (typeof window !== "undefined") {
        localStorage.setItem("hospital-user", JSON.stringify(data.user))
      }
      
      router.push("/dashboard")
    } catch (error) {
      console.error('Error de login:', error)
      setError(error instanceof Error ? error.message : 'Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  const handleViewerAccess = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'LECTOR', password: '1234' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión como visualizador')
      }

      // Guardar token en cookie para que el middleware lo pueda leer
      setCookie('token', data.token)
      
      // Guardar información del usuario en localStorage para uso en la UI
      if (typeof window !== "undefined") {
        localStorage.setItem("hospital-user", JSON.stringify(data.user))
      }
      
      router.push("/dashboard")
    } catch (error) {
      console.error('Error de login como visualizador:', error)
      setError(error instanceof Error ? error.message : 'Error al acceder como visualizador')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Hospital className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary">Hospital José Agurto Tello</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sistema Integral de Gestión Hospitalaria</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>ac
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div> */}

              {/* <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Verificando..." : "Ingresar al Sistema"}
              </Button>
               */}
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  {/* <span className="bg-background px-2 text-muted-foreground">
                    O
                  </span> */}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 ">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full bg-primary hover:bg-primary/90 text-white" 
              onClick={handleViewerAccess} 
              disabled={loading}
            >
              {loading ? "Verificando..." : "Acceder como Visualizador"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">Sistema de Farmacia - SIGSALUD</p>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          {new Date().getFullYear()} Hospital José Agurto Tello. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
