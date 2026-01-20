"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivateProfileModal } from "@/components/activate-profile-modal"

interface FirmCardProps {
  firm: {
    slug: string
    name: string
    isActive: boolean
    isPremium: boolean
    tierLevel: number | null
    description: string | null
    offices: {
      city: string
      state: {
        name: string
      }
      isPrimary: boolean
    }[]
    practiceAreas: {
      practiceArea: {
        name: string
      }
    }[]
  }
}

export function FirmCard({ firm }: FirmCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const primaryOffice = firm.offices.find((o) => o.isPrimary) || firm.offices[0]
  const topPracticeAreas = firm.practiceAreas.slice(0, 3)

  // If firm is active, show normal clickable card
  if (firm.isActive) {
    return (
      <Link href={`/firms/${firm.slug}/overview`}>
        <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 overflow-hidden">
          {/* Premium Gold Bar */}
          {firm.isPremium && (
            <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
          )}
          <CardHeader className="pb-3">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-rose-500">
              {firm.name}
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {primaryOffice && (
              <p className="text-sm text-muted-foreground">
                {primaryOffice.city}, {primaryOffice.state.name}
              </p>
            )}

            {firm.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {firm.description}
              </p>
            )}

            {topPracticeAreas.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {topPracticeAreas.map((pa, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                  >
                    {pa.practiceArea.name}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                VIEW PROFILE
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // If firm is inactive, show non-clickable card with activation button
  return (
    <>
      <Card className="h-full border-2 border-dashed overflow-hidden">
        {/* Premium Gold Bar */}
        {firm.isPremium && (
          <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
        )}
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {firm.name}
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {primaryOffice && (
            <p className="text-sm text-muted-foreground">
              {primaryOffice.city}, {primaryOffice.state.name}
            </p>
          )}

          {topPracticeAreas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topPracticeAreas.map((pa, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                >
                  {pa.practiceArea.name}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-rose-500 hover:bg-rose-600"
            >
              ACTIVATE PROFILE
            </Button>
          </div>
        </CardContent>
      </Card>

      <ActivateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        firmName={firm.name}
      />
    </>
  )
}
