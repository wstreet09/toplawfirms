import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, createNominationReceivedEmail, createAdminNominationNotificationEmail } from "@/lib/email"

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

    // Send confirmation email to nominator
    await sendEmail({
      to: body.nominatorEmail,
      subject: "Your nomination has been received - Top Law Firms",
      html: createNominationReceivedEmail(body.firmName, body.nominatorName),
    })

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Nomination: ${body.firmName}`,
        html: createAdminNominationNotificationEmail({
          firmName: body.firmName,
          nominatorName: body.nominatorName,
          nominatorEmail: body.nominatorEmail,
          nominatorPhone: body.nominatorPhone,
          city: body.city,
          state: body.state,
          practiceAreas: body.practiceAreas || [],
          notes: body.notes,
        }),
      })
    }

    return NextResponse.json({ success: true, nomination })
  } catch (error) {
    console.error("Error creating nomination:", error)
    return NextResponse.json(
      { error: "Failed to submit nomination" },
      { status: 500 }
    )
  }
}
