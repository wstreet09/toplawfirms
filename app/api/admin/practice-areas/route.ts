import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, countryId } = body

    const slug = createSlug(name)

    const practiceArea = await prisma.practiceArea.create({
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json(practiceArea)
  } catch (error) {
    console.error("Error creating practice area:", error)
    return NextResponse.json(
      { error: "Failed to create practice area" },
      { status: 500 }
    )
  }
}
