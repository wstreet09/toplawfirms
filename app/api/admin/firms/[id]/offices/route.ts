import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { city, stateId, address, isPrimary } = body

    const office = await prisma.office.create({
      data: {
        city,
        stateId,
        address,
        isPrimary: isPrimary || false,
        firmId: id,
      },
      include: {
        state: true,
        metro: true,
      },
    })

    return NextResponse.json(office)
  } catch (error) {
    console.error("Error creating office:", error)
    return NextResponse.json({ error: "Failed to create office" }, { status: 500 })
  }
}
