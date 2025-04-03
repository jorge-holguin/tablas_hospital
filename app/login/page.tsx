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

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simular verificación de credenciales
    setTimeout(() => {
      if (username === "admin" && password === "1234") {
        // Simular almacenamiento de token JWT
        if (typeof window !== "undefined") {
          localStorage.setItem("hospital-auth-token", "mock-jwt-token-12345")
          localStorage.setItem("hospital-user", JSON.stringify({ name: "Administrador", role: "admin" }))
        }
        router.push("/dashboard")
      } else {
        setError("Usuario o contraseña incorrectos")
      }
      setLoading(false)
    }, 1000)
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

              <div className="space-y-2">
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
                <Label htmlFor="password">Contraseña</Label>
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
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Verificando..." : "Ingresar al Sistema"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>Credenciales de prueba: admin / 1234</p>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hospital José Agurto Tello. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}

