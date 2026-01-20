import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

interface OfficesPageProps {
  params: Promise<{ firmSlug: string }>
}

export default async function OfficesPage({ params }: OfficesPageProps) {
  const { firmSlug } = await params

  const firm = await prisma.firm.findUnique({
    where: { slug: firmSlug },
    include: {
      offices: {
        include: {
          state: true,
          metro: true,
        },
        orderBy: [
          { isPrimary: 'desc' },
          { city: 'asc' },
        ],
      },
    },
  })

  if (!firm) {
    notFound()
  }

  // Group offices by state
  const officesByState = firm.offices.reduce((acc, office) => {
    const stateName = office.state?.name || 'Other'
    if (!acc[stateName]) {
      acc[stateName] = []
    }
    acc[stateName].push(office)
    return acc
  }, {} as Record<string, typeof firm.offices>)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{firm.offices.length} Office Locations</h2>
      </div>

      <div className="space-y-8">
        {Object.entries(officesByState).map(([stateName, offices]) => (
          <div key={stateName}>
            <h3 className="text-xl font-semibold mb-4">{stateName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offices.map((office) => (
                <Card key={office.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{office.city}</CardTitle>
                      {office.isPrimary && (
                        <Badge variant="secondary">Primary Office</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm">{office.address}</p>
                      <p className="text-sm">
                        {office.city}, {office.state?.name} {office.postalCode}
                      </p>
                    </div>
                    {office.metro && (
                      <p className="text-sm text-muted-foreground">
                        Metro: {office.metro.name}
                      </p>
                    )}
                    {office.phone && (
                      <p className="text-sm">
                        <a href={`tel:${office.phone}`} className="text-primary hover:underline">
                          {office.phone}
                        </a>
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
