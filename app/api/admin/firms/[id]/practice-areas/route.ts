import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { practiceAreaId } = body

    const firmPracticeArea = await prisma.firmPracticeArea.create({
      data: {
        firmId: id,
        practiceAreaId,
      },
      include: {
        practiceArea: true,
      },
    })

    return NextResponse.json(firmPracticeArea)
  } catch (error) {
    console.error("Error adding practice area:", error)
    return NextResponse.json({ error: "Failed to add practice area" }, { status: 500 })
  }
}
