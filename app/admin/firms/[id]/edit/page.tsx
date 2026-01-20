import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FirmEditForm } from "./firm-edit-form"

interface EditFirmPageProps {
  params: Promise<{ id: string }>
}

export default async function EditFirmPage({ params }: EditFirmPageProps) {
  const { id } = await params

  const firm = await prisma.firm.findUnique({
    where: { id },
    include: {
      offices: {
        include: { state: true, metro: true },
        orderBy: { isPrimary: 'desc' },
      },
      practiceAreas: {
        include: { practiceArea: true },
        orderBy: { practiceArea: { name: 'asc' } },
      },
      lawyers: {
        orderBy: { lastName: 'asc' },
      },
    },
  })

  if (!firm) {
    notFound()
  }

  // Fetch all states for dropdown
  const states = await prisma.state.findMany({
    orderBy: { name: 'asc' },
  })

  // Fetch all practice areas for checkboxes
  const allPracticeAreas = await prisma.practiceArea.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Firm: {firm.name}</h1>
        <p className="text-muted-foreground">Update firm information and details</p>
      </div>

      <FirmEditForm
        firm={firm}
        states={states}
        allPracticeAreas={allPracticeAreas}
      />
    </div>
  )
}
