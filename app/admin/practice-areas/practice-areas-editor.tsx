"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type PracticeArea = {
  id: string
  name: string
  slug: string
  description: string | null
}

type Country = {
  id: string
  name: string
  slug: string
}

type PracticeAreasByCountry = {
  country: Country
  practiceAreas: PracticeArea[]
}

interface PracticeAreasEditorProps {
  data: PracticeAreasByCountry[]
}

export function PracticeAreasEditor({ data }: PracticeAreasEditorProps) {
  const router = useRouter()
  const [practiceAreasByCountry, setPracticeAreasByCountry] = useState(data)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: "", description: "" })
  const [newPracticeArea, setNewPracticeArea] = useState("")

  const handleEdit = (pa: PracticeArea) => {
    setEditingId(pa.id)
    setEditForm({
      name: pa.name,
      description: pa.description || "",
    })
  }

  const handleSave = async (countryIndex: number, paId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/practice-areas/${paId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description || null,
        }),
      })

      if (!response.ok) throw new Error("Failed to update")

      const updated = await response.json()

      // Update local state
      const newData = [...practiceAreasByCountry]
      const paIndex = newData[countryIndex].practiceAreas.findIndex(p => p.id === paId)
      if (paIndex !== -1) {
        newData[countryIndex].practiceAreas[paIndex] = updated
      }
      setPracticeAreasByCountry(newData)
      setEditingId(null)
      router.refresh()
    } catch (error) {
      alert("Failed to update practice area")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (countryIndex: number, paId: string) => {
    if (!confirm("Are you sure you want to delete this practice area?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/practice-areas/${paId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      // Update local state
      const newData = [...practiceAreasByCountry]
      newData[countryIndex].practiceAreas = newData[countryIndex].practiceAreas.filter(
        p => p.id !== paId
      )
      setPracticeAreasByCountry(newData)
      router.refresh()
    } catch (error) {
      alert("Failed to delete practice area. It may be in use by firms.")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (countryIndex: number) => {
    if (!newPracticeArea.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/practice-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPracticeArea,
          countryId: practiceAreasByCountry[countryIndex].country.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to create")

      const created = await response.json()

      // Update local state
      const newData = [...practiceAreasByCountry]
      newData[countryIndex].practiceAreas.push(created)
      newData[countryIndex].practiceAreas.sort((a, b) => a.name.localeCompare(b.name))
      setPracticeAreasByCountry(newData)
      setNewPracticeArea("")
      router.refresh()
    } catch (error) {
      alert("Failed to add practice area")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {practiceAreasByCountry.map((item, countryIndex) => (
        <Card key={item.country.id}>
          <CardHeader>
            <CardTitle className="text-2xl">{item.country.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {item.practiceAreas.length} practice areas
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Practice Areas List */}
            {item.practiceAreas.map((pa) => (
              <div
                key={pa.id}
                className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50"
              >
                {editingId === pa.id ? (
                  <>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Practice area name"
                      />
                      <Textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                        placeholder="Description (optional)"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(countryIndex, pa.id)}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-medium">{pa.name}</p>
                      {pa.description && (
                        <p className="text-sm text-muted-foreground">{pa.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(pa)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(countryIndex, pa.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Add New Practice Area */}
            <div className="flex items-center gap-3 p-3 border-2 border-dashed rounded-md">
              <Input
                value={newPracticeArea}
                onChange={(e) => setNewPracticeArea(e.target.value)}
                placeholder="Add new practice area..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd(countryIndex)
                  }
                }}
              />
              <Button
                onClick={() => handleAdd(countryIndex)}
                disabled={loading || !newPracticeArea.trim()}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
