"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function NewPagePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    metaTitle: "",
    metaDesc: "",
    published: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      alert("Title and content are required")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/content/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create page")
      }

      router.push("/admin/content/pages")
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create page")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create New Page</h1>
          <p className="text-muted-foreground">Add a new static page to your site</p>
        </div>
        <Link href="/admin/content/pages">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="About Us"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL slug will be auto-generated from the title
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your page content here..."
                rows={12}
                required
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Leave blank to use page title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDesc">Meta Description</Label>
                  <Textarea
                    id="metaDesc"
                    value={formData.metaDesc}
                    onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                    placeholder="Brief description for search engines"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Publish Page</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this page visible to the public
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Page"}
              </Button>
              <Link href="/admin/content/pages">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
