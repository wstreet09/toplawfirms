import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Page } from "@prisma/client"

export default async function PagesManagementPage() {
  const pages: Page[] = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Pages</h1>
          <p className="text-muted-foreground">{pages.length} pages total</p>
        </div>
        <Link href="/admin/content/pages/new">
          <Button className="bg-rose-500 hover:bg-rose-600">Create New Page</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {pages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No pages created yet</p>
              <Link href="/admin/content/pages/new">
                <Button className="bg-rose-500 hover:bg-rose-600">Create Your First Page</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-rose-500">{page.title}</h3>
                      {page.published ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">/{page.slug}</p>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/content/pages/${page.id}/edit`}>
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
