import Link from "next/link"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: 'Browse Law Firms by Metro Area | Top Law Firms',
  description: 'Browse top law firms by metropolitan area across the United States.',
}

export default async function BrowseMetrosPage() {
  // Fetch all metros with state info and office count
  const metros = await prisma.metro.findMany({
    include: {
      state: true,
      _count: {
        select: { offices: true },
      },
    },
    orderBy: [
      { state: { name: 'asc' } },
      { name: 'asc' },
    ],
  })

  // Group metros by state
  const metrosByState = metros.reduce((acc, metro) => {
    const stateName = metro.state.name
    if (!acc[stateName]) {
      acc[stateName] = {
        state: metro.state,
        metros: [],
      }
    }
    acc[stateName].metros.push(metro)
    return acc
  }, {} as Record<string, { state: any; metros: any[] }>)

  const stateNames = Object.keys(metrosByState).sort()

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Browse by Metro Area' },
        ]}
      />

      <PageHeader
        heading="Browse by Metro Area"
        description="Find top law firms in major metropolitan areas across the United States"
      />

      <div className="space-y-8">
        {stateNames.map((stateName) => {
          const { state, metros } = metrosByState[stateName]

          return (
            <Card key={state.id}>
              <CardHeader>
                <CardTitle className="text-2xl">{state.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {metros.map((metro) => (
                    <Link
                      key={metro.id}
                      href={`/united-states/${state.slug}/${metro.slug}`}
                      className="block p-3 border rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metro.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {metro._count.offices} {metro._count.offices === 1 ? 'office' : 'offices'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </Container>
  )
}
