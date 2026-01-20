import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

interface CommentsPageProps {
  params: Promise<{ firmSlug: string }>
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { firmSlug } = await params

  const firm = await prisma.firm.findUnique({
    where: { slug: firmSlug },
    include: {
      clientComments: {
        orderBy: {
          year: 'desc',
        },
      },
    },
  })

  if (!firm) {
    notFound()
  }

  if (firm.clientComments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No client comments available at this time.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{firm.clientComments.length} Client Comments</h2>
      </div>

      <div className="space-y-6">
        {firm.clientComments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="pt-6">
              <blockquote className="text-lg italic mb-4 text-foreground">
                "{comment.content}"
              </blockquote>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {comment.clientName && (
                  <div>
                    <span className="font-medium">Client:</span> {comment.clientName}
                  </div>
                )}
                {comment.projectType && (
                  <div>
                    <span className="font-medium">Type:</span> {comment.projectType}
                  </div>
                )}
                {comment.year && (
                  <div>
                    <span className="font-medium">Year:</span> {comment.year}
                  </div>
                )}
                {comment.rating && (
                  <div>
                    <span className="font-medium">Rating:</span> {comment.rating}/5 ⭐
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
