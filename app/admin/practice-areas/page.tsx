import { PracticeAreasEditor } from "./practice-areas-editor"
import { prisma } from "@/lib/prisma"

export default async function AdminPracticeAreasPage() {
  // Fetch all countries
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
  })

  // Fetch practice areas grouped by country
  const practiceAreasByCountry = await Promise.all(
    countries.map(async (country) => {
      const practiceAreas = await prisma.practiceArea.findMany({
        orderBy: { name: "asc" },
      })
      return {
        country,
        practiceAreas,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Practice Areas</h1>
        <p className="text-muted-foreground">
          Organize practice areas by country
        </p>
      </div>

      <PracticeAreasEditor data={practiceAreasByCountry} />
    </div>
  )
}
