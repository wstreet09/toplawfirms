import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"
import { FirmListSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <Container className="py-8">
      <Skeleton className="h-4 w-64 mb-4" />
      <Skeleton className="h-10 w-80 mb-2" />
      <Skeleton className="h-6 w-full max-w-xl mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </aside>

        <div className="lg:col-span-3">
          <Skeleton className="h-8 w-48 mb-6" />
          <FirmListSkeleton count={6} />
        </div>
      </div>
    </Container>
  )
}
