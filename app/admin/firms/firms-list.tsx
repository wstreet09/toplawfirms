"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Firm = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  isActive: boolean
  offices: Array<{
    id: string
    city: string
    state: {
      id: string
      name: string
      code: string
    }
    isPrimary: boolean
  }>
  _count: {
    offices: number
    lawyers: number
    practiceAreas: number
  }
}

export function FirmsList({ firms }: { firms: Firm[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Filter firms based on search query and status
  const filteredFirms = firms.filter((firm) => {
    // Status filter
    if (statusFilter === "active" && !firm.isActive) return false
    if (statusFilter === "inactive" && firm.isActive) return false

    // Search filter
    const query = searchQuery.toLowerCase()
    return (
      firm.name.toLowerCase().includes(query) ||
      firm.offices.some(
        (office) =>
          office.city.toLowerCase().includes(query) ||
          office.state.name.toLowerCase().includes(query)
      )
    )
  })

  // Export to CSV
  const handleExport = () => {
    // Create CSV headers
    const headers = [
      "Firm Name",
      "Primary Office City",
      "Primary Office State",
      "Total Offices",
      "Total Lawyers",
      "Total Practice Areas",
      "Website URL",
    ]

    // Create CSV rows
    const rows = filteredFirms.map((firm) => {
      const primaryOffice = firm.offices[0]
      return [
        firm.name,
        primaryOffice?.city || "",
        primaryOffice?.state.name || "",
        firm._count.offices,
        firm._count.lawyers,
        firm._count.practiceAreas,
        `/firms/${firm.slug}/overview`,
      ]
    })

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `law-firms-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Count active and inactive firms
  const activeFirms = firms.filter((f) => f.isActive).length
  const inactiveFirms = firms.filter((f) => !f.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Law Firms</h1>
          <p className="text-muted-foreground">
            {filteredFirms.length} of {firms.length} firms
            {statusFilter !== "all" && ` (${statusFilter})`}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {activeFirms} active • {inactiveFirms} inactive
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            Export to CSV
          </Button>
          <Link href="/admin/firms/new">
            <Button className="bg-rose-500 hover:bg-rose-600">Add New Firm</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <Input
          type="text"
          placeholder="Search by firm name, city, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Profiles</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>

        {(searchQuery || statusFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Firms List */}
      <div className="space-y-4">
        {filteredFirms.length === 0 ? (
          <Card>
            <CardHeader>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No firms found matching "${searchQuery}"`
                    : "No firms found"}
                </p>
              </div>
            </CardHeader>
          </Card>
        ) : (
          filteredFirms.map((firm) => (
            <Card key={firm.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  {firm.logoUrl && (
                    <div className="mr-4">
                      <Image
                        src={firm.logoUrl}
                        alt={`${firm.name} logo`}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl text-rose-500">
                        {firm.name}
                      </CardTitle>
                      {firm.isActive ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {firm.offices[0] && (
                        <p>
                          Primary Office: {firm.offices[0].city}, {firm.offices[0].state.name}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2">
                        <span>{firm._count.offices} offices</span>
                        <span>{firm._count.lawyers} lawyers</span>
                        <span>{firm._count.practiceAreas} practice areas</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/firms/${firm.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/firms/${firm.slug}/overview`} target="_blank">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
