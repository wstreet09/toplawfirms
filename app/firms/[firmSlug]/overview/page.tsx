import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

interface OverviewPageProps {
  params: Promise<{ firmSlug: string }>
}

export async function generateMetadata({ params }: OverviewPageProps) {
  const { firmSlug } = await params
  const firm = await prisma.firm.findUnique({
    where: { slug: firmSlug },
  })

  if (!firm) return {}

  return {
    title: `${firm.name} - Overview | Top Law Firms`,
    description: firm.description || `Learn more about ${firm.name}, a top-ranked law firm.`,
  }
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { firmSlug } = await params

  const firm = await prisma.firm.findUnique({
    where: { slug: firmSlug },
    include: {
      offices: {
        include: {
          state: true,
          metro: true,
        },
      },
      practiceAreas: {
        include: {
          practiceArea: true,
        },
        orderBy: {
          tierLevel: 'asc',
        },
      },
      lawyers: {
        where: { isRecognized: true },
      },
    },
  })

  if (!firm) {
    notFound()
  }

  const primaryOffice = firm.offices.find((o) => o.isPrimary) || firm.offices[0]

  return (
    <div className="space-y-8">
      {/* Firm Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {firm.founded && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold">{firm.founded}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Year Founded</p>
            </CardContent>
          </Card>
        )}
        {firm.employeeCount && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold">{firm.employeeCount}+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Employees</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">{firm.lawyers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Recognized Lawyers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">{firm.offices.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{firm.offices.length === 1 ? 'Office' : 'Offices'}</p>
          </CardContent>
        </Card>
      </div>

      {/* About */}
      {firm.description && (
        <Card>
          <CardHeader>
            <CardTitle>About {firm.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{firm.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Practice Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firm.practiceAreas.map((fpa) => (
              <div key={fpa.id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{fpa.practiceArea.name}</h4>
                {fpa.practiceArea.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {fpa.practiceArea.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      {primaryOffice && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Primary Office</h4>
              <p className="text-sm text-muted-foreground">{primaryOffice.address}</p>
              <p className="text-sm text-muted-foreground">
                {primaryOffice.city}{primaryOffice.state ? `, ${primaryOffice.state.name}` : ""} {primaryOffice.postalCode}
              </p>
              {primaryOffice.phone && (
                <p className="text-sm text-muted-foreground mt-1">{primaryOffice.phone}</p>
              )}
            </div>
            {firm.website && (
              <div>
                <h4 className="font-medium mb-1">Website</h4>
                <a
                  href={firm.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {firm.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
