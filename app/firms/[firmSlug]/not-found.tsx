import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Firm Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The law firm you're looking for doesn't exist in our directory.
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/united-states">Browse All Firms</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </Container>
  )
}
