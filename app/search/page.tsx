import { Suspense } from 'react'
import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/layout/page-header'
import { FirmListingCard } from '@/components/firm-listing-card'
import { FirmListSkeleton } from '@/components/loading-skeleton'
import { prisma } from '@/lib/prisma'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchFilters } from './search-filters'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    state?: string
    practiceArea?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''

  return {
    title: query ? `Search results for "${query}" | Top Law Firms` : 'Search Law Firms | Top Law Firms',
    description: 'Search for top law firms by name, location, or practice area.',
    robots: 'noindex', // Don't index search results pages
  }
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const stateSlug = params.state
  const practiceAreaSlug = params.practiceArea
  const page = parseInt(params.page || '1')
  const pageSize = 20

  // Build where clause
  const where: any = {}

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (stateSlug) {
    where.offices = {
      some: {
        state: {
          slug: stateSlug,
        },
      },
    }
  }

  if (practiceAreaSlug) {
    where.practiceAreas = {
      some: {
        practiceArea: {
          slug: practiceAreaSlug,
        },
      },
    }
  }

  // Fetch firms
  const [firms, total] = await Promise.all([
    prisma.firm.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: [
        { isPremium: 'desc' }, // Premium first (true > false)
        { isActive: 'desc' },  // Then active (true > false)
        { name: 'asc' },       // Then alphabetically
      ],
      include: {
        offices: {
          take: 1,
          include: { state: true },
        },
        practiceAreas: {
          take: 3,
          include: { practiceArea: true },
          orderBy: { tierLevel: 'asc' },
        },
      },
    }),
    prisma.firm.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {total} {total === 1 ? 'Result' : 'Results'}
          {query && <span className="text-muted-foreground"> for "{query}"</span>}
        </h2>
      </div>

      {firms.length > 0 ? (
        <>
          <div className="max-w-5xl mx-auto space-y-6">
            {firms.map((firm) => (
              <FirmListingCard key={firm.id} firm={firm} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {page > 1 && (
                <a
                  href={`/search?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                  className="px-4 py-2 border rounded-md hover:bg-accent"
                >
                  Previous
                </a>
              )}
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/search?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                  className="px-4 py-2 border rounded-md hover:bg-accent"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No firms found matching your search criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  // Fetch states and practice areas for filters
  const [states, practiceAreas] = await Promise.all([
    prisma.state.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.practiceArea.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ])

  return (
    <Container className="py-8">
      <PageHeader
        heading="Search Law Firms"
        description="Find top law firms by name, location, or practice area"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <SearchFilters
            states={states}
            practiceAreas={practiceAreas}
            currentParams={params}
          />
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Suspense fallback={<FirmListSkeleton count={6} />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </Container>
  )
}
