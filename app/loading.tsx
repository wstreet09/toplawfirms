import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Container className="py-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-12 w-full max-w-2xl mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </Container>
  )
}
