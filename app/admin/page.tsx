import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  // Get counts for dashboard
  const [firmCount, practiceAreaCount, nominationCount, stateCount] =
    await Promise.all([
      prisma.firm.count(),
      prisma.practiceArea.count(),
      prisma.state.count(),
      prisma.nomination.count({ where: { status: "pending" } }),
    ])

  const stats = [
    { label: "Law Firms", count: firmCount, href: "/admin/firms" },
    { label: "Practice Areas", count: practiceAreaCount, href: "/admin/practice-areas" },
    { label: "States", count: stateCount, href: "/admin/locations" },
    { label: "Pending Nominations", count: nominationCount, href: "/admin/nominations" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your law firm directory, content, and nominations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-rose-500">
                  {stat.count}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Firms</CardTitle>
            <CardDescription>Add, edit, or remove law firms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link
                href="/admin/firms/new"
                className="inline-flex items-center justify-center rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
              >
                Add New Firm
              </Link>
              <Link
                href="/admin/firms"
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                View All
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Nominations</CardTitle>
            <CardDescription>Process pending firm nominations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/nominations"
              className="inline-flex items-center justify-center rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
            >
              Review Nominations
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Areas</CardTitle>
            <CardDescription>Manage practice area categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/practice-areas"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Manage Areas
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
            <CardDescription>Manage states, cities, and metros</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/locations"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Manage Locations
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Content</CardTitle>
            <CardDescription>Edit pages and site content</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/content"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Edit Content
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
