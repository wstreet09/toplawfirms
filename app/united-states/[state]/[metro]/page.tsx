import { notFound } from "next/navigation"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FirmListingCard } from "@/components/firm-listing-card"
import { prisma } from "@/lib/prisma"

interface MetroPageProps {
  params: Promise<{ state: string; metro: string }>
}

export async function generateStaticParams() {
  const metros = await prisma.metro.findMany({
    include: {
      state: true,
    },
    select: {
      slug: true,
      state: {
        select: { slug: true },
      },
    },
  })

  return metros.map((metro) => ({
    state: metro.state.slug,
    metro: metro.slug,
  }))
}

export async function generateMetadata({ params }: MetroPageProps) {
  const { state: stateSlug, metro: metroSlug } = await params

  const metro = await prisma.metro.findFirst({
    where: {
      slug: metroSlug,
      state: { slug: stateSlug },
    },
    include: {
      state: true,
    },
  })

  if (!metro) return {}

  return {
    title: `Law Firms in ${metro.name}, ${metro.state.name} | Top Law Firms`,
    description: `Discover top-ranked law firms in the ${metro.name} metro area.`,
  }
}

export default async function MetroPage({ params }: MetroPageProps) {
  const { state: stateSlug, metro: metroSlug } = await params

  const metro = await prisma.metro.findFirst({
    where: {
      slug: metroSlug,
      state: { slug: stateSlug },
    },
    include: {
      state: {
        include: {
          country: true,
        },
      },
    },
  })

  if (!metro) {
    notFound()
  }

  // Fetch firms with offices in this metro
  const firms = await prisma.firm.findMany({
    where: {
      offices: {
        some: {
          metroId: metro.id,
        },
      },
    },
    take: 20,
    orderBy: { name: 'asc' },
    include: {
      offices: {
        where: { metroId: metro.id },
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

  // Fetch practice areas with firms in this metro
  const practiceAreas = await prisma.practiceArea.findMany({
    where: {
      firms: {
        some: {
          firm: {
            offices: {
              some: {
                metroId: metro.id,
              },
            },
          },
        },
      },
    },
    include: {
      _count: {
        select: { firms: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  const firmCount = await prisma.firm.count({
    where: {
      offices: {
        some: {
          metroId: metro.id,
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
          { label: metro.state.name, href: `/united-states/${metro.state.slug}` },
          { label: metro.name },
        ]}
      />

      <PageHeader
        heading={`Top Law Firms in ${metro.name}`}
        description={`${firmCount} law firms with offices in the ${metro.name} metro area`}
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
                  <div
                    key={pa.id}
                    className="block p-2 rounded-md text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span>{pa.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {pa._count.firms}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {firmCount} {firmCount === 1 ? 'Firm' : 'Firms'} in {metro.name}
            </h2>
            <p className="text-muted-foreground">{metro.state.name}</p>
          </div>

          {firms.length > 0 ? (
            <>
              <div className="space-y-6">
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
              <p className="text-muted-foreground">No firms found in this metro area.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
