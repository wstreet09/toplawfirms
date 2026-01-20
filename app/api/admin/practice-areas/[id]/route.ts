import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description } = body

    const slug = createSlug(name)

    const updated = await prisma.practiceArea.update({
      where: { id },
      data: {
        name,
        slug,
        description,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating practice area:", error)
    return NextResponse.json(
      { error: "Failed to update practice area" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.practiceArea.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting practice area:", error)
    return NextResponse.json(
      { error: "Failed to delete practice area. It may be in use by firms." },
      { status: 500 }
    )
  }
}
