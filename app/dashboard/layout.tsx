"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import UnifiedFooter from "@/components/unified-footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("hospital-auth-token")
      if (!token) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-4 pb-16">{children}</main>
      <UnifiedFooter />
    </div>
  )
}

