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

    const { name, website, phone, logoUrl, isActive, isPremium, description, founded, employeeCount } = body

    // Generate new slug if name changed
    const slug = createSlug(name)

    const updatedFirm = await prisma.firm.update({
      where: { id },
      data: {
        name,
        slug,
        website,
        phone,
        logoUrl,
        isActive,
        isPremium,
        description,
        founded,
        employeeCount,
      },
    })

    return NextResponse.json(updatedFirm)
  } catch (error) {
    console.error("Error updating firm:", error)
    return NextResponse.json(
      { error: "Failed to update firm" },
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

    await prisma.firm.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting firm:", error)
    return NextResponse.json(
      { error: "Failed to delete firm" },
      { status: 500 }
    )
  }
}
