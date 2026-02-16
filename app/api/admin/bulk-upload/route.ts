import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface FirmRow {
  firmName: string
  website?: string
  phone?: string
  description?: string
  foundedYear?: number
  employeeCount?: number
  tierLevel?: number
  isActive: boolean
  isPremium: boolean
  officeAddress: string
  officeCity: string
  officeState: string
  officePostalCode?: string
  officePhone?: string
  isPrimaryOffice: boolean
  practiceAreas: string[]
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function parseBoolean(value: string): boolean {
  const lower = value.toLowerCase().trim()
  return lower === "true" || lower === "yes" || lower === "1"
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "File must have header row and at least one data row" }, { status: 400 })
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, ""))

    // Get the United States country (default)
    let country = await prisma.country.findUnique({
      where: { slug: "united-states" },
    })

    if (!country) {
      country = await prisma.country.create({
        data: {
          name: "United States",
          slug: "united-states",
          code: "US",
        },
      })
    }

    // Process each row
    const results = {
      created: 0,
      updated: 0,
      errors: [] as { row: number; error: string }[],
    }

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])

      if (values.length < headers.length) {
        results.errors.push({ row: i + 1, error: "Insufficient columns" })
        continue
      }

      try {
        // Map values to fields
        const getValue = (key: string): string => {
          const index = headers.indexOf(key)
          return index >= 0 ? values[index] || "" : ""
        }

        const firmName = getValue("firmname")
        if (!firmName) {
          results.errors.push({ row: i + 1, error: "Firm name is required" })
          continue
        }

        const officeCity = getValue("officecity")
        const officeState = getValue("officestate")
        const officeAddress = getValue("officeaddress")

        if (!officeCity || !officeState || !officeAddress) {
          results.errors.push({ row: i + 1, error: "Office address, city, and state are required" })
          continue
        }

        // Find or create state
        let state = await prisma.state.findFirst({
          where: {
            OR: [
              { code: officeState.toUpperCase() },
              { slug: officeState.toLowerCase() },
              { name: { equals: officeState, mode: "insensitive" } },
            ],
            countryId: country.id,
          },
        })

        if (!state) {
          // Create the state
          const stateSlug = officeState.toLowerCase().replace(/\s+/g, "-")
          state = await prisma.state.create({
            data: {
              name: officeState,
              slug: stateSlug,
              code: officeState.toUpperCase().substring(0, 2),
              countryId: country.id,
            },
          })
        }

        // Parse practice areas
        const practiceAreasStr = getValue("practiceareas")
        const practiceAreaNames = practiceAreasStr
          ? practiceAreasStr.split(",").map((pa) => pa.trim()).filter(Boolean)
          : []

        // Generate slug for firm
        let slug = generateSlug(firmName)

        // Check if firm already exists
        const existingFirm = await prisma.firm.findUnique({
          where: { slug },
        })

        const firmData = {
          name: firmName,
          website: getValue("website") || null,
          phone: getValue("phone") || null,
          description: getValue("description") || null,
          founded: getValue("foundedyear") ? parseInt(getValue("foundedyear")) || null : null,
          employeeCount: getValue("employeecount") ? parseInt(getValue("employeecount")) || null : null,
          tierLevel: getValue("tierlevel") ? parseInt(getValue("tierlevel")) || null : null,
          isActive: parseBoolean(getValue("isactive")),
          isPremium: parseBoolean(getValue("ispremium")),
          countryId: country.id,
        }

        let firm

        if (existingFirm) {
          // Update existing firm
          firm = await prisma.firm.update({
            where: { id: existingFirm.id },
            data: firmData,
          })
          results.updated++
        } else {
          // Create new firm
          firm = await prisma.firm.create({
            data: {
              ...firmData,
              slug,
            },
          })
          results.created++
        }

        // Create or update office
        const officeData = {
          address: officeAddress,
          city: officeCity,
          postalCode: getValue("officepostalcode") || null,
          phone: getValue("officephone") || null,
          isPrimary: parseBoolean(getValue("isprimaryoffice") || "true"),
          stateId: state.id,
        }

        // Check if office exists for this firm
        const existingOffice = await prisma.office.findFirst({
          where: {
            firmId: firm.id,
            city: officeCity,
            stateId: state.id,
          },
        })

        if (existingOffice) {
          await prisma.office.update({
            where: { id: existingOffice.id },
            data: officeData,
          })
        } else {
          await prisma.office.create({
            data: {
              ...officeData,
              firmId: firm.id,
            },
          })
        }

        // Handle practice areas
        for (const paName of practiceAreaNames) {
          const paSlug = generateSlug(paName)

          // Find or create practice area
          let practiceArea = await prisma.practiceArea.findFirst({
            where: {
              OR: [
                { slug: paSlug },
                { name: { equals: paName, mode: "insensitive" } },
              ],
            },
          })

          if (!practiceArea) {
            practiceArea = await prisma.practiceArea.create({
              data: {
                name: paName,
                slug: paSlug,
              },
            })
          }

          // Link firm to practice area if not already linked
          const existingLink = await prisma.firmPracticeArea.findUnique({
            where: {
              firmId_practiceAreaId: {
                firmId: firm.id,
                practiceAreaId: practiceArea.id,
              },
            },
          })

          if (!existingLink) {
            await prisma.firmPracticeArea.create({
              data: {
                firmId: firm.id,
                practiceAreaId: practiceArea.id,
              },
            })
          }
        }
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error)
        results.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Created ${results.created} firms, updated ${results.updated} firms${results.errors.length > 0 ? `, ${results.errors.length} errors` : ""}`,
    })
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    )
  }
}
