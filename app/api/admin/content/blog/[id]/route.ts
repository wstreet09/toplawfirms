import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, excerpt, content, coverImage, author, published, publishedAt, metaTitle, metaDesc, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const slug = createSlug(title)

    // Check if slug already exists (excluding current post)
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this title already exists" },
        { status: 409 }
      )
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author,
        published: published ?? false,
        publishedAt: published && publishedAt ? new Date(publishedAt) : (published ? new Date() : null),
        metaTitle,
        metaDesc,
        tags,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
