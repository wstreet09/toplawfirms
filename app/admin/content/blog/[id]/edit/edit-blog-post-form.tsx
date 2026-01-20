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

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  author: string
  published: boolean
  publishedAt: Date | null
  metaTitle: string | null
  metaDesc: string | null
  tags: string | null
  createdAt: Date
  updatedAt: Date
}

export default function EditBlogPostForm({ post }: { post: BlogPost }) {
  const router = useRouter()

  // Parse tags from JSON string to comma-separated string
  const parseTags = (tags: string | null) => {
    if (!tags) return ""
    try {
      const parsed = JSON.parse(tags)
      return Array.isArray(parsed) ? parsed.join(", ") : ""
    } catch {
      return ""
    }
  }

  const [formData, setFormData] = useState({
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    coverImage: post.coverImage || "",
    author: post.author,
    metaTitle: post.metaTitle || "",
    metaDesc: post.metaDesc || "",
    tags: parseTags(post.tags),
    published: post.published,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      alert("Title and content are required")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/content/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? JSON.stringify(formData.tags.split(",").map(t => t.trim())) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update blog post")
      }

      router.push("/admin/content/blog")
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update blog post")
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/content/blog/${post.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog post")
      }

      router.push("/admin/content/blog")
      router.refresh()
    } catch (error) {
      alert("Failed to delete blog post")
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">/{post.slug}</p>
        </div>
        <Link href="/admin/content/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Blog Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="How to Choose the Right Law Firm"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL slug will be auto-generated from the title
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the blog post..."
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Short description shown in blog listings
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your blog post content here..."
                rows={15}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="legal, law firm, corporate (comma-separated)"
              />
              <p className="text-sm text-muted-foreground">
                Enter tags separated by commas
              </p>
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
                    placeholder="Leave blank to use post title"
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
                  <Label htmlFor="published">Publish Post</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this post visible to the public
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Post"}
              </Button>

              <div className="flex gap-3">
                <Link href="/admin/content/blog">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
