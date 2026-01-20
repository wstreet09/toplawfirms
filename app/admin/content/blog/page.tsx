import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export default async function BlogManagementPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
          <p className="text-muted-foreground">{posts.length} posts total</p>
        </div>
        <Link href="/admin/content/blog/new">
          <Button className="bg-rose-500 hover:bg-rose-600">Create New Post</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No blog posts created yet</p>
              <Link href="/admin/content/blog/new">
                <Button className="bg-rose-500 hover:bg-rose-600">Create Your First Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-rose-500">{post.title}</h3>
                      {post.published ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">/{post.slug}</p>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      {post.publishedAt && (
                        <span>
                          Published: {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        Updated: {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/content/blog/${post.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
