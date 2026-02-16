import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const PRICING_FILE = path.join(process.cwd(), "data", "pricing.json")

export async function GET() {
  try {
    const data = await fs.readFile(PRICING_FILE, "utf-8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error("Error reading pricing config:", error)
    return NextResponse.json({ error: "Failed to read pricing config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the data structure
    if (!body.tiers || !Array.isArray(body.tiers)) {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 })
    }

    // Write to file with pretty formatting
    await fs.writeFile(PRICING_FILE, JSON.stringify(body, null, 2), "utf-8")

    return NextResponse.json({ success: true, message: "Pricing config saved successfully" })
  } catch (error) {
    console.error("Error saving pricing config:", error)
    return NextResponse.json({ error: "Failed to save pricing config" }, { status: 500 })
  }
}
