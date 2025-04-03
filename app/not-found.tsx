"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-24 w-24 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
          <p className="text-muted-foreground mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver atrás
            </Button>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Hospital José Agurto Tello &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

