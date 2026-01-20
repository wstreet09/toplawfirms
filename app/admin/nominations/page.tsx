import { NominationsManager } from "./nominations-manager"
import { prisma } from "@/lib/prisma"

export default async function AdminNominationsPage() {
  const nominations = await prisma.nomination.findMany({
    where: {
      status: "pending",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Nominations</h1>
        <p className="text-muted-foreground">
          Review and approve firm nominations ({nominations.length} pending)
        </p>
      </div>

      <NominationsManager initialNominations={nominations} />
    </div>
  )
}
