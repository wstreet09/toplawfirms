"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Lead = {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string | null
  jobTitle: string | null
  phone: string | null
  source: string
  createdAt: Date
}

export function LeadsList({ leads }: { leads: Lead[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  // Get unique sources
  const sources = Array.from(new Set(leads.map((lead) => lead.source)))

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (sourceFilter !== "all" && lead.source !== sourceFilter) return false

    const query = searchQuery.toLowerCase()
    return (
      lead.firstName.toLowerCase().includes(query) ||
      lead.lastName.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.company?.toLowerCase().includes(query) ?? false)
    )
  })

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Company",
      "Job Title",
      "Phone",
      "Source",
      "Date",
    ]

    const rows = filteredLeads.map((lead) => [
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.company || "",
      lead.jobTitle || "",
      lead.phone || "",
      lead.source,
      new Date(lead.createdAt).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `leads-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lead Generation</h1>
          <p className="text-muted-foreground">
            {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <Input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchQuery || sourceFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("")
              setSourceFilter("all")
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? `No leads found matching "${searchQuery}"`
                  : "No leads captured yet"}
              </p>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Job Title</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {lead.firstName} {lead.lastName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-rose-500 hover:underline"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {lead.company || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {lead.jobTitle || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {lead.phone || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
