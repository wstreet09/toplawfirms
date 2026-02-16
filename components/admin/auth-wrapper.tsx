"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsAuthenticated(true)
      return
    }

    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth")
      const data = await response.json()

      if (!data.authenticated) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/admin/login")
    }
  }

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
