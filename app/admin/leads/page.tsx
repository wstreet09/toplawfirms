import { prisma } from "@/lib/prisma"
import { LeadsList } from "./leads-list"

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <LeadsList leads={leads} />
}
