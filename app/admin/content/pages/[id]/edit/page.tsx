import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EditPageForm from "./edit-page-form"

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const page = await prisma.page.findUnique({
    where: { id },
  })

  if (!page) {
    notFound()
  }

  return <EditPageForm page={page} />
}
