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
  { params }: { params: Promise<{ id: string; lawyerId: string }> }
) {
  try {
    const { lawyerId } = await params
    const body = await request.json()
    const { firstName, lastName, title, email, phone, bio } = body

    const slug = createSlug(`${firstName}-${lastName}`)

    const lawyer = await prisma.lawyer.update({
      where: { id: lawyerId },
      data: {
        firstName,
        lastName,
        slug,
        title,
        email,
        phone,
        bio,
      },
    })

    return NextResponse.json(lawyer)
  } catch (error) {
    console.error("Error updating lawyer:", error)
    return NextResponse.json({ error: "Failed to update lawyer" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lawyerId: string }> }
) {
  try {
    const { lawyerId } = await params

    await prisma.lawyer.delete({
      where: { id: lawyerId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lawyer:", error)
    return NextResponse.json({ error: "Failed to delete lawyer" }, { status: 500 })
  }
}
