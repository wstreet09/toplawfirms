import Link from "next/link"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Browse by Practice Area | Top Law Firms",
  description: "Find top-ranked law firms by legal practice area.",
}

export default async function BrowsePracticeAreasPage() {
  const practiceAreas = await prisma.practiceArea.findMany({
    include: {
      _count: {
        select: { firms: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <Container className="py-8">
      <PageHeader
        heading="Browse Law Firms by Practice Area"
        description="Find firms specializing in your legal needs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceAreas.map((pa) => (
          <Link key={pa.id} href={`/united-states/practice-areas/${pa.slug}`}>
            <Card className="hover:shadow-md hover:border-primary/50 transition-all h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{pa.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {pa._count.firms} {pa._count.firms === 1 ? 'firm' : 'firms'}
                </p>
                {pa.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pa.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}
