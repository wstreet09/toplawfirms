import Link from "next/link"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Browse by State | Top Law Firms",
  description: "Find top-ranked law firms by state across the United States.",
}

export default async function BrowseStatesPage() {
  const states = await prisma.state.findMany({
    include: {
      _count: {
        select: { offices: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <Container className="py-8">
      <PageHeader
        heading="Browse Law Firms by State"
        description="Find law firms in all 50 states"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {states.map((state) => (
          <Link key={state.id} href={`/united-states/${state.slug}`}>
            <Card className="hover:shadow-md hover:border-primary/50 transition-all h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{state.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {state._count.offices} {state._count.offices === 1 ? 'office' : 'offices'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}
