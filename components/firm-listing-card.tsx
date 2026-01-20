"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivateProfileModal } from "@/components/activate-profile-modal"
import { formatEmployeeCount } from "@/lib/format"

interface FirmListingCardProps {
  firm: {
    id: string
    slug: string
    name: string
    isActive: boolean
    isPremium: boolean
    description: string | null
    logoUrl: string | null
    website: string | null
    employeeCount: number | null
    founded: number | null
    offices: {
      city: string
      state?: {
        name: string
        code: string
      }
    }[]
    practiceAreas: {
      id: string
      practiceArea: {
        name: string
      }
    }[]
  }
}

export function FirmListingCard({ firm }: FirmListingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const primaryOffice = firm.offices[0]

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Premium Gold Bar */}
        {firm.isPremium && (
          <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
        )}
      <CardHeader className="pb-4">
        <div className="flex items-start gap-6">
          {/* Logo */}
          <div className="w-20 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
            {firm.logoUrl ? (
              <img src={firm.logoUrl} alt={firm.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-muted-foreground font-semibold">LOGO</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-4">
              <CardTitle className="text-2xl mb-1 text-rose-500">{firm.name}</CardTitle>
            </div>

            {/* Description */}
            {firm.description && (
              <p className="text-sm mb-4 line-clamp-2">
                {firm.description}
              </p>
            )}

            {/* Top Services / Practice Areas */}
            {firm.practiceAreas.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-semibold mr-2">Top Services:</span>
                <div className="inline-flex flex-wrap gap-2 mt-1">
                  {firm.practiceAreas.slice(0, 3).map((fpa) => (
                    <span
                      key={fpa.id}
                      className="px-3 py-1 text-xs border rounded-full"
                    >
                      {fpa.practiceArea.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location and Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {primaryOffice && (
                <div className="flex items-center gap-2">
                  <span className="text-primary">📍</span>
                  <span>
                    {primaryOffice.city}
                    {primaryOffice.state && `, ${primaryOffice.state.code}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-primary">👥</span>
                <span>{formatEmployeeCount(firm.employeeCount)}</span>
              </div>
              {firm.founded && (
                <div className="flex items-center gap-2">
                  <span className="text-primary">📅</span>
                  <span>Founded {firm.founded}</span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {firm.isActive ? (
              <>
                <Link
                  href={`/firms/${firm.slug}/overview`}
                  className="px-6 py-2 border rounded text-center hover:bg-muted transition-colors whitespace-nowrap"
                >
                  VIEW PROFILE
                </Link>
                {firm.website && (
                  <a
                    href={firm.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    VISIT WEBSITE ↗
                  </a>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-rose-500 text-white rounded text-center hover:bg-rose-600 transition-colors whitespace-nowrap"
              >
                ACTIVATE PROFILE
              </button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>

      <ActivateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        firmName={firm.name}
      />
    </>
  )
}
