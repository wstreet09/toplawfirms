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
    const { title, content, metaTitle, metaDesc, published } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const slug = createSlug(title)

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    })

    if (existingPage) {
      return NextResponse.json(
        { error: "A page with this title already exists" },
        { status: 409 }
      )
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDesc,
        published: published || false,
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
