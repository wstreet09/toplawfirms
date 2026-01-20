import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

interface LawyersPageProps {
  params: Promise<{ firmSlug: string }>
}

export default async function LawyersPage({ params }: LawyersPageProps) {
  const { firmSlug } = await params

  const firm = await prisma.firm.findUnique({
    where: { slug: firmSlug },
    include: {
      lawyers: {
        where: { isRecognized: true },
        include: {
          practiceAreas: {
            include: {
              practiceArea: true,
            },
          },
        },
        orderBy: {
          recognitionTier: 'asc',
        },
      },
    },
  })

  if (!firm) {
    notFound()
  }

  if (firm.lawyers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No recognized lawyers listed at this time.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{firm.lawyers.length} Recognized Lawyers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {firm.lawyers.map((lawyer) => (
          <Card key={lawyer.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {lawyer.firstName} {lawyer.lastName}
              </CardTitle>
              {lawyer.title && (
                <p className="text-sm text-muted-foreground mt-1">{lawyer.title}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {lawyer.practiceAreas.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">PRACTICE AREAS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lawyer.practiceAreas.map((lpa) => (
                      <span
                        key={lpa.id}
                        className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                      >
                        {lpa.practiceArea.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {lawyer.yearsExperience && (
                <p className="text-sm text-muted-foreground">
                  {lawyer.yearsExperience} years of experience
                </p>
              )}
              {lawyer.email && (
                <p className="text-sm">
                  <a href={`mailto:${lawyer.email}`} className="text-primary hover:underline">
                    {lawyer.email}
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
