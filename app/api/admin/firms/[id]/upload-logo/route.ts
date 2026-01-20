import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get("logo") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `firm-${id}-${timestamp}.${extension}`

    // Save file to public/uploads/firm-logos
    const publicPath = join(process.cwd(), "public", "uploads", "firm-logos", filename)
    await writeFile(publicPath, buffer)

    // Update firm with new logo URL
    const logoUrl = `/uploads/firm-logos/${filename}`
    const updatedFirm = await prisma.firm.update({
      where: { id },
      data: { logoUrl },
    })

    return NextResponse.json({ logoUrl: updatedFirm.logoUrl })
  } catch (error) {
    console.error("Error uploading logo:", error)
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 })
  }
}
