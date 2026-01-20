import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, createApprovalEmail } from "@/lib/email"

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get the nomination details
    const nomination = await prisma.nomination.findUnique({
      where: { id },
    })

    if (!nomination) {
      return NextResponse.json(
        { error: "Nomination not found" },
        { status: 404 }
      )
    }

    // Find or get the country (United States)
    const country = await prisma.country.findFirst({
      where: { slug: "united-states" },
    })

    if (!country) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 500 }
      )
    }

    // Find the state
    const stateSlug = createSlug(nomination.state)
    const state = await prisma.state.findFirst({
      where: { slug: stateSlug },
    })

    if (!state) {
      return NextResponse.json(
        { error: `State not found: ${nomination.state}` },
        { status: 400 }
      )
    }

    // Create the firm as inactive
    const firmSlug = createSlug(nomination.firmName)
    const firm = await prisma.firm.create({
      data: {
        name: nomination.firmName,
        slug: firmSlug,
        description: nomination.firmDescription,
        website: nomination.firmWebsite,
        countryId: country.id,
        isActive: false,
        isPremium: false,
      },
    })

    // Create the office
    await prisma.office.create({
      data: {
        firmId: firm.id,
        stateId: state.id,
        city: nomination.city,
        address: nomination.address || "",
        isPrimary: true,
      },
    })

    // Parse and link practice areas
    try {
      const practiceAreaNames = JSON.parse(nomination.practiceAreas) as string[]
      for (const paName of practiceAreaNames) {
        const paSlug = createSlug(paName)
        // Find the practice area
        const practiceArea = await prisma.practiceArea.findUnique({
          where: { slug: paSlug },
        })

        if (practiceArea) {
          // Link firm to practice area
          await prisma.firmPracticeArea.create({
            data: {
              firmId: firm.id,
              practiceAreaId: practiceArea.id,
            },
          })
        }
      }
    } catch (e) {
      console.error("Error linking practice areas:", e)
    }

    // Update nomination status
    const updatedNomination = await prisma.nomination.update({
      where: { id },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: "Admin", // TODO: Get actual admin user
      },
    })

    // Send approval email to nominator
    await sendEmail({
      to: nomination.nominatorEmail,
      subject: "Your law firm nomination has been approved",
      html: createApprovalEmail(nomination.firmName, nomination.nominatorName),
    })

    return NextResponse.json({
      success: true,
      nomination: updatedNomination,
      firm: firm
    })
  } catch (error) {
    console.error("Error approving nomination:", error)
    return NextResponse.json(
      { error: "Failed to approve nomination" },
      { status: 500 }
    )
  }
}
