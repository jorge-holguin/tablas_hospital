"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Componente de Calculadora
const CalculadoraComponent = () => {
  const [display, setDisplay] = useState("0")
  const [operation, setOperation] = useState("")
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const clearAll = () => {
    setDisplay("0")
    setOperation("")
    setPrevValue(null)
    setWaitingForOperand(false)
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (prevValue === null) {
      setPrevValue(inputValue)
    } else if (operation) {
      const currentValue = prevValue || 0
      let newValue = 0

      switch (operation) {
        case "+":
          newValue = currentValue + inputValue
          break
        case "-":
          newValue = currentValue - inputValue
          break
        case "*":
          newValue = currentValue * inputValue
          break
        case "/":
          newValue = currentValue / inputValue
          break
        default:
          break
      }

      setPrevValue(newValue)
      setDisplay(String(newValue))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculateResult = () => {
    if (!prevValue || !operation) return

    performOperation("=")
    setOperation("")
  }

  return (
    <div className="bg-background border rounded-lg shadow-lg p-4 w-64">
      <div className="bg-muted p-2 rounded mb-4 text-right text-xl font-mono h-10">{display}</div>
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" onClick={clearAll} className="col-span-2">
          AC
        </Button>
        <Button variant="outline" onClick={() => setDisplay(display.slice(0, -1) || "0")}>
          ←
        </Button>
        <Button variant="outline" onClick={() => performOperation("/")}>
          ÷
        </Button>

        <Button variant="outline" onClick={() => inputDigit("7")}>
          7
        </Button>
        <Button variant="outline" onClick={() => inputDigit("8")}>
          8
        </Button>
        <Button variant="outline" onClick={() => inputDigit("9")}>
          9
        </Button>
        <Button variant="outline" onClick={() => performOperation("*")}>
          ×
        </Button>

        <Button variant="outline" onClick={() => inputDigit("4")}>
          4
        </Button>
        <Button variant="outline" onClick={() => inputDigit("5")}>
          5
        </Button>
        <Button variant="outline" onClick={() => inputDigit("6")}>
          6
        </Button>
        <Button variant="outline" onClick={() => performOperation("-")}>
          -
        </Button>

        <Button variant="outline" onClick={() => inputDigit("1")}>
          1
        </Button>
        <Button variant="outline" onClick={() => inputDigit("2")}>
          2
        </Button>
        <Button variant="outline" onClick={() => inputDigit("3")}>
          3
        </Button>
        <Button variant="outline" onClick={() => performOperation("+")}>
          +
        </Button>

        <Button variant="outline" onClick={() => inputDigit("0")} className="col-span-2">
          0
        </Button>
        <Button variant="outline" onClick={inputDecimal}>
          .
        </Button>
        <Button variant="outline" onClick={calculateResult}>
          =
        </Button>
      </div>
    </div>
  )
}

// Componente de Footer unificado
export default function UnifiedFooter() {
  const [almacen, setAlmacen] = useState("FARMACIA")
  const [periodo, setPeriodo] = useState("Abril 2025")

  // Opciones para los selectores
  const almacenes = [
    { value: "FARMACIA", label: "FARMACIA" },
    { value: "ALMACEN_GENERAL", label: "ALMACEN GENERAL(MEDICAMENTOS)" },
    { value: "FARMACIA_EMERGENCIA", label: "FARMACIA EMERGENCIA" },
    { value: "FARMACIA_INMUNIZACION", label: "FARMACIA INMUNIZACION" },
    { value: "FARMACIA_DOSIS_UNITARIA", label: "FARMACIA DOSIS UNITARIA" },
    { value: "ALMACEN_INSUMOS", label: "ALMACEN INSUMOS" },
  ]

  const periodos = [
    { value: "Enero 2025", label: "Enero 2025" },
    { value: "Febrero 2025", label: "Febrero 2025" },
    { value: "Marzo 2025", label: "Marzo 2025" },
    { value: "Abril 2025", label: "Abril 2025" },
    { value: "Mayo 2025", label: "Mayo 2025" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-300 py-1 px-2 z-50">
      <div className="flex flex-wrap justify-between items-center text-xs">
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Calculator className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Calculadora</DialogTitle>
              </DialogHeader>
              <CalculadoraComponent />
            </DialogContent>
          </Dialog>
          <div>
            <span className="font-bold">Usuario:</span> Administrador
          </div>
          <div>
            <span className="font-bold">Fecha:</span> 01/04/2025
          </div>
          <div>
            <span className="font-bold">Almacén:</span> {almacen}
          </div>
          <div>
            <span className="font-bold">Periodo:</span> {periodo}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>Almacén:</span>
            <Select value={almacen} onValueChange={setAlmacen}>
              <SelectTrigger className="h-7 w-[180px]">
                <SelectValue placeholder="Seleccionar almacén" />
              </SelectTrigger>
              <SelectContent>
                {almacenes.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span>Periodo:</span>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="h-7 w-[180px]">
                <SelectValue placeholder="Seleccionar periodo" />
              </SelectTrigger>
              <SelectContent>
                {periodos.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

