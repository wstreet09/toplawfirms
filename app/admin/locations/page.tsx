import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export default async function AdminLocationsPage() {
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { offices: true },
      },
    },
  })

  const metros = await prisma.metro.findMany({
    orderBy: { name: "asc" },
    include: {
      state: true,
      _count: {
        select: { offices: true },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Locations</h1>
        <p className="text-muted-foreground">
          Manage states, cities, and metro areas
        </p>
      </div>

      {/* States Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">States</h2>
          <Link href="/admin/locations/states/new">
            <Button className="bg-rose-500 hover:bg-rose-600">
              Add New State
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {states.map((state) => (
            <Card key={state.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{state.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Code: {state.code}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {state._count.offices} offices
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/admin/locations/states/${state.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/united-states/${state.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Metro Areas Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Metro Areas</h2>
          <Link href="/admin/locations/metros/new">
            <Button className="bg-rose-500 hover:bg-rose-600">
              Add New Metro
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metros.map((metro) => (
            <Card key={metro.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{metro.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    State: {metro.state.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {metro._count.offices} offices
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/admin/locations/metros/${metro.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link
                      href={`/united-states/${metro.state.slug}/${metro.slug}`}
                      target="_blank"
                    >
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
