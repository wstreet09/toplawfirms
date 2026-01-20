import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Container className="py-8">
      <Skeleton className="h-4 w-64 mb-4" />
      <Skeleton className="h-10 w-96 mb-2" />
      <Skeleton className="h-6 w-full max-w-2xl mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </Container>
  )
}
