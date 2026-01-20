import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/layout/container"
import { Breadcrumb } from "@/components/breadcrumb"
import { prisma } from "@/lib/prisma"

interface FirmLayoutProps {
  children: React.ReactNode
  params: Promise<{ firmSlug: string }>
}

export async function generateStaticParams() {
  const firms = await prisma.firm.findMany({
    select: { slug: true },
  })

  return firms.map((firm) => ({
    firmSlug: firm.slug,
  }))
}

export default async function FirmLayout({ children, params }: FirmLayoutProps) {
  const { firmSlug } = await params

  const firm = await prisma.firm.findUnique({
    where: { slug: firmSlug },
    include: {
      country: true,
    },
  })

  if (!firm) {
    notFound()
  }

  const tabs = [
    { label: 'Overview', href: `/firms/${firm.slug}/overview` },
    { label: 'Recognized Lawyers', href: `/firms/${firm.slug}/lawyers` },
    { label: 'Client Comments', href: `/firms/${firm.slug}/comments` },
    { label: 'Insights', href: `/firms/${firm.slug}/insights` },
    { label: 'Offices', href: `/firms/${firm.slug}/offices` },
  ]

  return (
    <div className="pb-16">
      {/* Firm Header */}
      <div className="border-b bg-muted/30">
        <Container className="py-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'United States', href: '/united-states' },
              { label: firm.name },
            ]}
          />

          <div className="mt-4 flex items-start gap-6">
            {firm.logoUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={firm.logoUrl}
                  alt={`${firm.name} logo`}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2 text-rose-500">{firm.name}</h1>
              {firm.website && (
                <a
                  href={firm.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {firm.website}
                </a>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <Container>
          <nav className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="py-4 text-sm font-medium border-b-2 border-transparent hover:border-primary/50 transition-colors whitespace-nowrap"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      {/* Tab Content */}
      <Container className="py-8">
        {children}
      </Container>
    </div>
  )
}
