import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const nomination = await prisma.nomination.create({
      data: {
        nominatorName: body.nominatorName,
        nominatorEmail: body.nominatorEmail,
        nominatorPhone: body.nominatorPhone || null,
        firmName: body.firmName,
        firmWebsite: body.firmWebsite || null,
        firmDescription: body.firmDescription || null,
        city: body.city,
        state: body.state,
        address: body.address || null,
        practiceAreas: JSON.stringify(body.practiceAreas || []),
        notes: body.notes || null,
        status: "pending",
      },
    })

    // TODO: Send email notification to admin
    // You can implement email notification here using a service like Resend, SendGrid, etc.

    return NextResponse.json({ success: true, nomination })
  } catch (error) {
    console.error("Error creating nomination:", error)
    return NextResponse.json(
      { error: "Failed to submit nomination" },
      { status: 500 }
    )
  }
}
