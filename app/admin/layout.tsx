import Link from "next/link"
import { Container } from "@/components/layout/container"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
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
                  href="/admin/pricing"
                  className="text-sm hover:text-rose-500 transition-colors"
                >
                  Pricing
                </Link>
              </nav>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Site →
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  )
}
