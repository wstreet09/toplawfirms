import { notFound } from "next/navigation"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FirmListingCard } from "@/components/firm-listing-card"
import { prisma } from "@/lib/prisma"

interface StatePracticeAreaPageProps {
  params: Promise<{ state: string; practiceArea: string }>
}

export async function generateStaticParams() {
  // Generate params for popular state + practice area combinations
  const states = await prisma.state.findMany({
    select: { slug: true },
    take: 10, // Top 10 states
  })

  const practiceAreas = await prisma.practiceArea.findMany({
    select: { slug: true },
  })

  const params = []
  for (const state of states) {
    for (const practiceArea of practiceAreas) {
      params.push({
        state: state.slug,
        practiceArea: practiceArea.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: StatePracticeAreaPageProps) {
  const { state: stateSlug, practiceArea: paSlug } = await params

  const state = await prisma.state.findFirst({
    where: { slug: stateSlug },
  })

  const practiceArea = await prisma.practiceArea.findUnique({
    where: { slug: paSlug },
  })

  if (!state || !practiceArea) return {}

  return {
    title: `${practiceArea.name} Law Firms in ${state.name} | Top Law Firms`,
    description: `Find top-ranked ${practiceArea.name} firms in ${state.name}.`,
  }
}

export default async function StatePracticeAreaPage({
  params,
}: StatePracticeAreaPageProps) {
  const { state: stateSlug, practiceArea: paSlug } = await params

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

  const practiceArea = await prisma.practiceArea.findUnique({
    where: { slug: paSlug },
  })

  if (!state || !practiceArea) {
    notFound()
  }

  // Fetch firms that have this practice area AND offices in this state
  const firmPracticeAreas = await prisma.firmPracticeArea.findMany({
    where: {
      practiceAreaId: practiceArea.id,
      firm: {
        offices: {
          some: {
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
            where: { stateId: state.id },
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
            stateId: state.id,
          },
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
          { label: practiceArea.name },
        ]}
      />

      <PageHeader
        heading={`Top ${practiceArea.name} Law Firms in ${state.name}`}
        description={practiceArea.description || undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          {/* Metros */}
          {state.metros.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Metro Areas</h3>
              <div className="space-y-2">
                {state.metros.map((metro) => (
                  <div
                    key={metro.id}
                    className="block p-2 rounded-md text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span>{metro.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {metro._count.offices}
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
              {totalFirms} {totalFirms === 1 ? 'Firm' : 'Firms'}
            </h2>
            <p className="text-muted-foreground">
              Specializing in {practiceArea.name} in {state.name}
            </p>
          </div>

          {firms.length > 0 ? (
            <>
              <div className="space-y-6">
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
                No {practiceArea.name} firms found in {state.name}.
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
