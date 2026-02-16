"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"

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
    } | null
    isPrimary: boolean
  }>
  _count: {
    offices: number
    lawyers: number
    practiceAreas: number
  }
}

export function FirmsList({ firms }: { firms: Firm[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [selectedFirms, setSelectedFirms] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

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
          office.state?.name.toLowerCase().includes(query)
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
        primaryOffice?.state?.name || "",
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

  // Selection handlers
  const toggleSelectFirm = (firmId: string) => {
    const newSelected = new Set(selectedFirms)
    if (newSelected.has(firmId)) {
      newSelected.delete(firmId)
    } else {
      newSelected.add(firmId)
    }
    setSelectedFirms(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedFirms.size === filteredFirms.length) {
      setSelectedFirms(new Set())
    } else {
      setSelectedFirms(new Set(filteredFirms.map((f) => f.id)))
    }
  }

  // Delete single firm
  const handleDeleteFirm = async (firmId: string, firmName: string) => {
    if (!confirm(`Are you sure you want to delete "${firmName}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/firms/${firmId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete firm")
      }

      router.refresh()
    } catch (error) {
      alert("Failed to delete firm. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  // Delete multiple firms
  const handleDeleteSelected = async () => {
    if (selectedFirms.size === 0) return

    const count = selectedFirms.size
    if (!confirm(`Are you sure you want to delete ${count} firm${count > 1 ? "s" : ""}? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch("/api/admin/firms/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedFirms) }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete firms")
      }

      setSelectedFirms(new Set())
      router.refresh()
    } catch (error) {
      alert("Failed to delete firms. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

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
          {selectedFirms.size > 0 && (
            <Button
              onClick={handleDeleteSelected}
              variant="destructive"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedFirms.size} Selected
            </Button>
          )}
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
        <div className="flex items-center gap-2">
          <Checkbox
            id="selectAll"
            checked={filteredFirms.length > 0 && selectedFirms.size === filteredFirms.length}
            onCheckedChange={toggleSelectAll}
          />
          <label htmlFor="selectAll" className="text-sm cursor-pointer">
            Select All
          </label>
        </div>

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
            <Card key={firm.id} className={`hover:shadow-md transition-shadow ${selectedFirms.has(firm.id) ? "ring-2 ring-rose-500" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedFirms.has(firm.id)}
                      onCheckedChange={() => toggleSelectFirm(firm.id)}
                      className="mt-1"
                    />
                    {firm.logoUrl && (
                      <div className="mr-2">
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
                            Primary Office: {firm.offices[0].city}{firm.offices[0].state ? `, ${firm.offices[0].state.name}` : ""}
                          </p>
                        )}
                        <div className="flex gap-4 mt-2">
                          <span>{firm._count.offices} offices</span>
                          <span>{firm._count.lawyers} lawyers</span>
                          <span>{firm._count.practiceAreas} practice areas</span>
                        </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFirm(firm.id, firm.name)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
