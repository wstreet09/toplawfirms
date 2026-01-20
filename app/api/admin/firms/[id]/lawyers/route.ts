import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { firstName, lastName, title, email, phone, bio } = body

    const slug = createSlug(`${firstName}-${lastName}`)

    const lawyer = await prisma.lawyer.create({
      data: {
        firstName,
        lastName,
        slug,
        title,
        email,
        phone,
        bio,
        firmId: id,
      },
    })

    return NextResponse.json(lawyer)
  } catch (error) {
    console.error("Error creating lawyer:", error)
    return NextResponse.json({ error: "Failed to create lawyer" }, { status: 500 })
  }
}
