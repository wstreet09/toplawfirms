import { notFound } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FirmListingCard } from "@/components/firm-listing-card"
import { prisma } from "@/lib/prisma"

interface CityPracticeAreaPageProps {
  params: Promise<{ state: string; city: string; practiceArea: string }>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generateStaticParams() {
  // Generate params for popular city + practice area combinations
  const offices = await prisma.office.findMany({
    select: {
      city: true,
      state: {
        select: { slug: true },
      },
    },
    take: 100,
  })

  const practiceAreas = await prisma.practiceArea.findMany({
    select: { slug: true },
  })

  const params = []
  const cityStateMap = new Map<string, string>()

  offices.forEach((office) => {
    if (!office.state) return
    const key = `${office.state.slug}:${office.city}`
    cityStateMap.set(key, office.state.slug)
  })

  for (const [key] of cityStateMap) {
    const [stateSlug, city] = key.split(':')
    for (const pa of practiceAreas.slice(0, 10)) {
      params.push({
        state: stateSlug,
        city: slugify(city),
        practiceArea: pa.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: CityPracticeAreaPageProps) {
  const { state: stateSlug, city: citySlug, practiceArea: paSlug } = await params

  const state = await prisma.state.findFirst({
    where: { slug: stateSlug },
  })

  if (!state) return {}

  const offices = await prisma.office.findMany({
    where: { stateId: state.id },
    select: { city: true },
  })

  const cityName = offices.find((o) => slugify(o.city) === citySlug)?.city

  const practiceArea = await prisma.practiceArea.findUnique({
    where: { slug: paSlug },
  })

  if (!cityName || !practiceArea) return {}

  return {
    title: `${practiceArea.name} Law Firms in ${cityName}, ${state.name} | Top Law Firms`,
    description: `Find top-ranked ${practiceArea.name} firms in ${cityName}, ${state.name}.`,
  }
}

export default async function CityPracticeAreaPage({ params }: CityPracticeAreaPageProps) {
  const { state: stateSlug, city: citySlug, practiceArea: paSlug } = await params

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

  const practiceArea = await prisma.practiceArea.findUnique({
    where: { slug: paSlug },
  })

  if (!cityName || !practiceArea) {
    notFound()
  }

  // Fetch firms that have this practice area AND offices in this city
  const firmPracticeAreas = await prisma.firmPracticeArea.findMany({
    where: {
      practiceAreaId: practiceArea.id,
      firm: {
        offices: {
          some: {
            city: cityName,
            stateId: state.id,
          },
        },
      },
    },
    take: 20,
    orderBy: {
      firm: {
        name: 'asc',
      },
    },
    include: {
      firm: {
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
      },
    },
  })

  const firms = firmPracticeAreas.map((fpa) => fpa.firm)

  const totalFirms = await prisma.firmPracticeArea.count({
    where: {
      practiceAreaId: practiceArea.id,
      firm: {
        offices: {
          some: {
            city: cityName,
            stateId: state.id,
          },
        },
      },
    },
  })

  // Fetch all practice areas with firms in this city for sidebar
  const allPracticeAreas = await prisma.practiceArea.findMany({
    where: {
      firms: {
        some: {
          firm: {
            offices: {
              some: {
                city: cityName,
                stateId: state.id,
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { firms: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'United States', href: '/united-states' },
          { label: state.name, href: `/united-states/${state.slug}` },
          { label: cityName, href: `/united-states/${state.slug}/cities/${citySlug}` },
          { label: practiceArea.name },
        ]}
      />

      <PageHeader
        heading={`${practiceArea.name} Law Firms in ${cityName}`}
        description={practiceArea.description || undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          {/* Practice Areas */}
          {allPracticeAreas.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Practice Areas</h3>
              <div className="space-y-2">
                {allPracticeAreas.map((pa) => (
                  <Link
                    key={pa.id}
                    href={`/united-states/${state.slug}/cities/${citySlug}/practice-areas/${pa.slug}`}
                    className={`block p-2 rounded-md text-sm hover:bg-accent transition-colors ${
                      pa.slug === paSlug ? 'bg-accent font-medium' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{pa.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {pa._count.firms}
                      </span>
                    </div>
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
              {totalFirms} {totalFirms === 1 ? 'Firm' : 'Firms'}
            </h2>
            <p className="text-muted-foreground">
              Specializing in {practiceArea.name} in {cityName}, {state.name}
            </p>
          </div>

          {firms.length > 0 ? (
            <>
              <div className="max-w-5xl mx-auto space-y-6">
                {firms.map((firm) => (
                  <FirmListingCard key={firm.id} firm={firm} />
                ))}
              </div>

              {totalFirms > 20 && (
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  Showing 20 of {totalFirms} firms
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No {practiceArea.name} firms found in {cityName}.
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
