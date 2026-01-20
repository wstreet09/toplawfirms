import { redirect } from "next/navigation"

interface FirmPageProps {
  params: Promise<{ firmSlug: string }>
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { firmSlug } = await params
  redirect(`/firms/${firmSlug}/overview`)
}
