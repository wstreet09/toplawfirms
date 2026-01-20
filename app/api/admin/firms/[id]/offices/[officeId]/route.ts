import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; officeId: string }> }
) {
  try {
    const { officeId } = await params
    const body = await request.json()
    const { city, stateId, address, isPrimary } = body

    const office = await prisma.office.update({
      where: { id: officeId },
      data: {
        city,
        stateId,
        address,
        isPrimary,
      },
      include: {
        state: true,
        metro: true,
      },
    })

    return NextResponse.json(office)
  } catch (error) {
    console.error("Error updating office:", error)
    return NextResponse.json({ error: "Failed to update office" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; officeId: string }> }
) {
  try {
    const { officeId } = await params

    await prisma.office.delete({
      where: { id: officeId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting office:", error)
    return NextResponse.json({ error: "Failed to delete office" }, { status: 500 })
  }
}
