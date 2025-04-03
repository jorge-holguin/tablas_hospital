import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Almacenes - Hospital José Agurto Tello",
  description: "Gestión de almacenes del hospital",
}

interface AlmacenesLayoutProps {
  children: React.ReactNode
}

export default function AlmacenesLayout({ children }: AlmacenesLayoutProps) {
  return <div>{children}</div>
}

