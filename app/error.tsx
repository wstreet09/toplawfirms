'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We encountered an error while loading this page.
          </p>
          {error.message && (
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {error.message}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
