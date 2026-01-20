import { notFound } from "next/navigation"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FirmListingCard } from "@/components/firm-listing-card"
import { prisma } from "@/lib/prisma"

interface PracticeAreaPageProps {
  params: Promise<{ practiceArea: string }>
}

export async function generateStaticParams() {
  const practiceAreas = await prisma.practiceArea.findMany({
    select: { slug: true },
  })

  return practiceAreas.map((pa) => ({
    practiceArea: pa.slug,
  }))
}

export async function generateMetadata({ params }: PracticeAreaPageProps) {
  const { practiceArea: paSlug } = await params
  const practiceArea = await prisma.practiceArea.findUnique({
    where: { slug: paSlug },
  })

  if (!practiceArea) return {}

  return {
    title: `${practiceArea.name} Law Firms in the United States | Top Law Firms`,
    description: practiceArea.description || `Find top-ranked ${practiceArea.name} firms across the United States.`,
  }
}

export default async function PracticeAreaPage({ params }: PracticeAreaPageProps) {
  const { practiceArea: paSlug } = await params

  const practiceArea = await prisma.practiceArea.findUnique({
    where: { slug: paSlug },
  })

  if (!practiceArea) {
    notFound()
  }

  // Fetch firms specializing in this practice area
  const firmPracticeAreas = await prisma.firmPracticeArea.findMany({
    where: {
      practiceAreaId: practiceArea.id,
    },
    take: 20,
    include: {
      firm: {
        include: {
          offices: {
            include: { state: true },
            take: 1,
            where: { isPrimary: true },
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

  // Sort firms: premium first, then active, then alphabetically
  firmPracticeAreas.sort((a, b) => {
    // Sort by isPremium (premium firms first)
    if (a.firm.isPremium !== b.firm.isPremium) {
      return a.firm.isPremium ? -1 : 1
    }
    // Then sort by isActive (active firms first)
    if (a.firm.isActive !== b.firm.isActive) {
      return a.firm.isActive ? -1 : 1
    }
    // Then sort alphabetically by name
    return a.firm.name.localeCompare(b.firm.name)
  })

  const firms = firmPracticeAreas.map((fpa) => fpa.firm)

  const totalFirms = await prisma.firmPracticeArea.count({
    where: {
      practiceAreaId: practiceArea.id,
    },
  })

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'United States', href: '/united-states' },
          { label: practiceArea.name },
        ]}
      />

      <PageHeader
        heading={`Top ${practiceArea.name} Law Firms`}
        description={practiceArea.description || undefined}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {totalFirms} {totalFirms === 1 ? 'Firm' : 'Firms'}
        </h2>
        <p className="text-muted-foreground">
          Top-ranked firms specializing in {practiceArea.name}
        </p>
      </div>

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
    </Container>
  )
}
