import { notFound } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FirmListingCard } from "@/components/firm-listing-card"
import { prisma } from "@/lib/prisma"

interface CityPageProps {
  params: Promise<{ state: string; city: string }>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generateStaticParams() {
  const offices = await prisma.office.findMany({
    select: {
      city: true,
      state: {
        select: { slug: true },
      },
    },
  })

  // Get unique state/city combinations
  const cityMap = new Map<string, string>()
  offices.forEach((office) => {
    const key = `${office.state.slug}:${office.city}`
    cityMap.set(key, office.state.slug)
  })

  return Array.from(cityMap.keys()).map((key) => {
    const [stateSlug, city] = key.split(':')
    return {
      state: stateSlug,
      city: slugify(city),
    }
  })
}

export async function generateMetadata({ params }: CityPageProps) {
  const { state: stateSlug, city: citySlug } = await params

  const state = await prisma.state.findFirst({
    where: { slug: stateSlug },
  })

  if (!state) return {}

  // Get all offices to find the city name
  const offices = await prisma.office.findMany({
    where: {
      stateId: state.id,
    },
    select: { city: true },
  })

  const city = offices.find((o) => slugify(o.city) === citySlug)?.city

  if (!city) return {}

  return {
    title: `Law Firms in ${city}, ${state.name} | Top Law Firms`,
    description: `Discover top-ranked law firms in ${city}, ${state.name}.`,
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { state: stateSlug, city: citySlug } = await params

  const state = await prisma.state.findFirst({
    where: { slug: stateSlug },
    include: {
      country: true,
    },
  })

  if (!state) {
    notFound()
  }

  // Get all offices to find the city name
  const offices = await prisma.office.findMany({
    where: {
      stateId: state.id,
    },
    select: { city: true },
  })

  const cityName = offices.find((o) => slugify(o.city) === citySlug)?.city

  if (!cityName) {
    notFound()
  }

  // Fetch firms with offices in this city
  const firms = await prisma.firm.findMany({
    where: {
      offices: {
        some: {
          city: cityName,
          stateId: state.id,
        },
      },
    },
    take: 20,
    orderBy: [
      { isPremium: 'desc' }, // Premium first (true > false)
      { isActive: 'desc' },  // Then active (true > false)
      { name: 'asc' },       // Then alphabetically
    ],
    include: {
      offices: {
        where: {
          city: cityName,
          stateId: state.id,
        },
        include: { state: true },
        take: 1,
      },
      practiceAreas: {
        include: { practiceArea: true },
        take: 3,
        orderBy: { tierLevel: 'asc' },
      },
    },
  })

  // Fetch all practice areas
  const practiceAreas = await prisma.practiceArea.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: 'asc' },
  })

  const firmCount = await prisma.firm.count({
    where: {
      offices: {
        some: {
          city: cityName,
          stateId: state.id,
        },
      },
    },
  })

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'United States', href: '/united-states' },
          { label: state.name, href: `/united-states/${state.slug}` },
          { label: cityName },
        ]}
      />

      <PageHeader
        heading={`Top Law Firms in ${cityName}`}
        description={`${firmCount} law firms with offices in ${cityName}, ${state.name}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          {/* Practice Areas */}
          {practiceAreas.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Practice Areas</h3>
              <div className="space-y-2">
                {practiceAreas.map((pa) => (
                  <Link
                    key={pa.id}
                    href={`/united-states/${state.slug}/cities/${slugify(cityName)}/practice-areas/${pa.slug}`}
                    className="block p-2 rounded-md text-sm hover:bg-accent transition-colors"
                  >
                    <span>{pa.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {firmCount} {firmCount === 1 ? 'Firm' : 'Firms'} in {cityName}
            </h2>
            <p className="text-muted-foreground">{state.name}</p>
          </div>

          {firms.length > 0 ? (
            <>
              <div className="max-w-5xl mx-auto space-y-6">
                {firms.map((firm) => (
                  <FirmListingCard key={firm.id} firm={firm} />
                ))}
              </div>

              {firmCount > 20 && (
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  Showing 20 of {firmCount} firms
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No firms found in this city.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
