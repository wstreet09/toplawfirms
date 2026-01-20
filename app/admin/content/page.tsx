import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export default async function AdminContentPage() {
  const [pageCount, blogPostCount] = await Promise.all([
    prisma.page.count(),
    prisma.blogPost.count(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage pages, blog posts, and site content
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-rose-500">
              {pageCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-rose-500">
              {blogPostCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Blog Posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
            <CardDescription>Manage static pages like Homepage, About, etc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/content/pages">
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                Manage Pages
              </Button>
            </Link>
            <Link href="/admin/content/pages/new">
              <Button variant="outline" className="w-full">
                Create New Page
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog</CardTitle>
            <CardDescription>Manage blog posts and articles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/content/blog">
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                Manage Blog Posts
              </Button>
            </Link>
            <Link href="/admin/content/blog/new">
              <Button variant="outline" className="w-full">
                Create New Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
