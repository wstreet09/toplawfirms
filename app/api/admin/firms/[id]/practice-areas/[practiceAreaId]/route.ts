import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; practiceAreaId: string }> }
) {
  try {
    const { practiceAreaId } = await params

    await prisma.firmPracticeArea.delete({
      where: { id: practiceAreaId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing practice area:", error)
    return NextResponse.json({ error: "Failed to remove practice area" }, { status: 500 })
  }
}
