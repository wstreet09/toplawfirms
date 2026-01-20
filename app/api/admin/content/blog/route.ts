import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, content, coverImage, author, published, publishedAt, metaTitle, metaDesc, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const slug = createSlug(title)

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this title already exists" },
        { status: 409 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author: author || "Admin",
        published: published || false,
        publishedAt: published && publishedAt ? new Date(publishedAt) : (published ? new Date() : null),
        metaTitle,
        metaDesc,
        tags,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
