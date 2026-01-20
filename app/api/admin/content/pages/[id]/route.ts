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
    const { title, content, metaTitle, metaDesc, published } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const slug = createSlug(title)

    // Check if slug already exists (excluding current page)
    const existingPage = await prisma.page.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    })

    if (existingPage) {
      return NextResponse.json(
        { error: "A page with this title already exists" },
        { status: 409 }
      )
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDesc,
        published: published ?? false,
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error updating page:", error)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.page.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting page:", error)
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
