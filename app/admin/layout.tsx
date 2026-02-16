"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Container } from "@/components/layout/container"
import { AuthWrapper } from "@/components/admin/auth-wrapper"
import { Button } from "@/components/ui/button"

function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-white border-b">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-bold">
              Admin Panel
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/admin/firms"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Firms
              </Link>
              <Link
                href="/admin/inactive-profiles"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Inactive Profiles
              </Link>
              <Link
                href="/admin/practice-areas"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Practice Areas
              </Link>
              <Link
                href="/admin/locations"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Locations
              </Link>
              <Link
                href="/admin/nominations"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Nominations
              </Link>
              <Link
                href="/admin/content"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Content
              </Link>
              <Link
                href="/admin/leads"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Leads
              </Link>
              <Link
                href="/admin/pricing"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/admin/bulk-upload"
                className="text-sm hover:text-rose-500 transition-colors"
              >
                Bulk Upload
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Site
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  // Login page has its own layout, just return children
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="py-8">
          <Container>{children}</Container>
        </main>
      </div>
    </AuthWrapper>
  )
}
