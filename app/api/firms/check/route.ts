import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get("name")

    if (!name || name.length < 2) {
      return NextResponse.json({ firms: [] })
    }

    // Search for firms with similar names
    const firms = await prisma.firm.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        offices: {
          where: { isPrimary: true },
          take: 1,
          include: {
            state: true,
          },
        },
      },
      take: 5,
    })

    return NextResponse.json({
      firms: firms.map((firm) => ({
        id: firm.id,
        name: firm.name,
        slug: firm.slug,
        isActive: firm.isActive,
        location: firm.offices[0]
          ? `${firm.offices[0].city}, ${firm.offices[0].state?.name || ""}`
          : null,
      })),
    })
  } catch (error) {
    console.error("Error checking firm:", error)
    return NextResponse.json({ error: "Failed to check firm" }, { status: 500 })
  }
}
