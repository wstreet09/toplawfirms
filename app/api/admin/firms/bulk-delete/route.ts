import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No firm IDs provided" },
        { status: 400 }
      )
    }

    // Delete firms and all related data (cascading delete)
    await prisma.firm.deleteMany({
      where: {
        id: { in: ids },
      },
    })

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    console.error("Bulk delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete firms" },
      { status: 500 }
    )
  }
}
