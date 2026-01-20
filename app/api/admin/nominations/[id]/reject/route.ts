import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const nomination = await prisma.nomination.update({
      where: { id },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        reviewedBy: "Admin", // TODO: Get actual admin user
        rejectionReason: body.reason || null,
      },
    })

    // TODO: Send rejection email to nominator

    return NextResponse.json({ success: true, nomination })
  } catch (error) {
    console.error("Error rejecting nomination:", error)
    return NextResponse.json(
      { error: "Failed to reject nomination" },
      { status: 500 }
    )
  }
}
