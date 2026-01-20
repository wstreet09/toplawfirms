import { notFound } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FirmCard } from "@/components/firm-card"
import { ActivateProfileButton } from "@/components/activate-profile-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { formatEmployeeCount } from "@/lib/format"

interface StatePageProps {
  params: Promise<{ state: string }>
}

export async function generateStaticParams() {
  const states = await prisma.state.findMany({
    select: { slug: true },
  })

  return states.map((state) => ({
    state: state.slug,
  }))
}

export async function generateMetadata({ params }: StatePageProps) {
  const { state: stateSlug } = await params
  const state = await prisma.state.findFirst({
    where: { slug: stateSlug },
  })

  if (!state) return {}

  return {
    title: `Law Firms in ${state.name} | Top Law Firms`,
    description: `Discover top-ranked law firms in ${state.name}. Browse by city, metro area, and practice area.`,
  }
}

export default async function StatePage({ params }: StatePageProps) {
  const { state: stateSlug } = await params

  const state = await prisma.state.findFirst({
    where: { slug: stateSlug },
    include: {
      country: true,
      metros: {
        include: {
          _count: {
            select: { offices: true },
          },
        },
        orderBy: { name: 'asc' },
      },
    },
  })

  if (!state) {
    notFound()
  }

  // Fetch all offices in this state to get unique cities
  const offices = await prisma.office.findMany({
    where: {
      stateId: state.id,
    },
    select: {
      city: true,
    },
  })

  // Get unique cities with counts
  const cityMap = new Map<string, number>()
  offices.forEach((office) => {
    cityMap.set(office.city, (cityMap.get(office.city) || 0) + 1)
  })

  const cities = Array.from(cityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => a.city.localeCompare(b.city))

  // Helper function to create city slugs
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Fetch all practice areas
  const practiceAreas = await prisma.practiceArea.findMany({
    orderBy: { name: 'asc' },
  })

  // Fetch all firms with offices in this state
  const firms = await prisma.firm.findMany({
    where: {
      offices: {
        some: {
          stateId: state.id,
        },
      },
    },
    include: {
      offices: {
        where: {
          stateId: state.id,
        },
      },
      practiceAreas: {
        include: {
          practiceArea: true,
        },
      },
    },
    orderBy: [
      { isPremium: 'desc' }, // Premium first (true > false)
      { isActive: 'desc' },  // Then active (true > false)
      { name: 'asc' },       // Then alphabetically
    ],
  })

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
        <Container className="py-12">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'United States', href: '/united-states' },
              { label: state.name },
            ]}
          />

          <div className="mt-8 mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Top Law Firms in {state.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl leading-relaxed">
              Discover top-ranked law firms in {state.name}. Browse by practice area, city, and metro region to find the best legal representation for your needs.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="space-y-20">
          {/* Practice Areas Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Practice Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2 max-w-5xl mx-auto px-8">
              {practiceAreas.map((pa) => (
                <Link
                  key={pa.id}
                  href={`/united-states/${state.slug}/practice-areas/${pa.slug}`}
                  className="text-sm hover:text-primary transition-colors block"
                >
                  {pa.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Cities Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 max-w-5xl mx-auto px-8">
              {cities.map(({ city, count }) => (
                <Link
                  key={city}
                  href={`/united-states/${state.slug}/cities/${slugify(city)}`}
                  className="text-sm hover:text-primary transition-colors"
                >
                  <span className="font-medium">{city}</span>
                  <span className="text-muted-foreground ml-1">({count})</span>
                </Link>
              ))}
            </div>
            {cities.length === 0 && (
              <div className="text-center">
                <p className="text-muted-foreground">No cities found in this state.</p>
              </div>
            )}
          </section>

          {/* Law Firms Listing */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Law Firms in {state.name}</h2>
            <div className="max-w-5xl mx-auto space-y-6">
              {firms.map((firm) => (
                <Card key={firm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Premium Gold Bar */}
                  {firm.isPremium && (
                    <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-6">
                      {/* Logo */}
                      <div className="w-20 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        {firm.logoUrl ? (
                          <img src={firm.logoUrl} alt={firm.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs text-muted-foreground font-semibold">LOGO</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <CardTitle className="text-2xl mb-1 text-rose-500">{firm.name}</CardTitle>
                        </div>

                        {/* Description */}
                        {firm.description && (
                          <p className="text-sm mb-4 line-clamp-2">
                            {firm.description}
                          </p>
                        )}

                        {/* Top Services / Practice Areas */}
                        {firm.practiceAreas.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm font-semibold mr-2">Top Services:</span>
                            <div className="inline-flex flex-wrap gap-2 mt-1">
                              {firm.practiceAreas.slice(0, 3).map((fpa) => (
                                <span
                                  key={fpa.id}
                                  className="px-3 py-1 text-xs border rounded-full"
                                >
                                  {fpa.practiceArea.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Location and Stats */}
                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="text-primary">📍</span>
                            <span>{firm.offices[0]?.city || state.name}, {state.code}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">👥</span>
                            <span>{formatEmployeeCount(firm.employeeCount)}</span>
                          </div>
                          {firm.founded && (
                            <div className="flex items-center gap-2">
                              <span className="text-primary">📅</span>
                              <span>Founded {firm.founded}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {firm.isActive ? (
                          <>
                            <Link
                              href={`/firms/${firm.slug}`}
                              className="px-6 py-2 border rounded text-center hover:bg-muted transition-colors whitespace-nowrap"
                            >
                              VIEW PROFILE
                            </Link>
                            {firm.website && (
                              <a
                                href={firm.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90 transition-colors whitespace-nowrap"
                              >
                                VISIT WEBSITE ↗
                              </a>
                            )}
                          </>
                        ) : (
                          <ActivateProfileButton
                            firmName={firm.name}
                            className="px-6 py-2 bg-rose-500 text-white rounded text-center hover:bg-rose-600 transition-colors whitespace-nowrap"
                          />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {firms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No law firms found in this state.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}
