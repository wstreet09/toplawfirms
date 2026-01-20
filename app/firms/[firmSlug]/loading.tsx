import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Container className="py-8">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </Container>
  )
}
