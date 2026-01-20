import { prisma } from "@/lib/prisma"
import { FirmsList } from "./firms-list"

export default async function AdminFirmsPage() {
  const firms = await prisma.firm.findMany({
    orderBy: { name: "asc" },
    include: {
      offices: {
        include: { state: true },
        orderBy: { isPrimary: 'desc' },
      },
      _count: {
        select: {
          offices: true,
          lawyers: true,
          practiceAreas: true,
        },
      },
    },
  })

  return <FirmsList firms={firms} />
}
