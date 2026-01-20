import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <Container className="py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl text-center">404</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/browse/states">Browse by State</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
