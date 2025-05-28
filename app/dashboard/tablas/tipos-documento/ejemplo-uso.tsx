"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectorTipoDocumento } from "@/components/selectores/selector-tipo-documento"
import { useToast } from "@/components/ui/use-toast"

export default function EjemploUsoSelector() {
  const { toast } = useToast()
  const [tipoDocumento, setTipoDocumento] = useState("")
  const [numeroDocumento, setNumeroDocumento] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tipoDocumento) {
      toast({
        title: "Error",
        description: "Debe seleccionar un tipo de documento",
        variant: "destructive",
      })
      return
    }
    
    if (!numeroDocumento) {
      toast({
        title: "Error",
        description: "Debe ingresar un número de documento",
        variant: "destructive",
      })
      return
    }
    
    toast({
      title: "Formulario enviado",
      description: `Tipo de documento: ${tipoDocumento}, Número: ${numeroDocumento}`,
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Ejemplo de Uso del Selector</CardTitle>
          <CardDescription>
            Demostración de cómo utilizar el componente SelectorTipoDocumento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-documento">Tipo de Documento</Label>
              <SelectorTipoDocumento
                value={tipoDocumento}
                onChange={setTipoDocumento}
                placeholder="Seleccione un tipo de documento"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero-documento">Número de Documento</Label>
              <Input
                id="numero-documento"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Ingrese el número de documento"
                required
              />
            </div>
            <Button type="submit" className="w-full">Enviar</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            Este es un ejemplo de cómo integrar el selector de tipos de documento en un formulario.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Puedes usar este componente en cualquier formulario que requiera seleccionar un tipo de documento.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
