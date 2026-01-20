"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type Firm = {
  id: string
  name: string
  slug: string
  website: string | null
  phone: string | null
  logoUrl: string | null
  isActive: boolean
  isPremium: boolean
  description: string | null
  founded: number | null
  employeeCount: number | null
  offices: any[]
  practiceAreas: any[]
  lawyers: any[]
}

type State = {
  id: string
  name: string
  code: string
}

type PracticeArea = {
  id: string
  name: string
  slug: string
}

interface FirmEditFormProps {
  firm: Firm
  states: State[]
  allPracticeAreas: PracticeArea[]
}

export function FirmEditForm({ firm, states, allPracticeAreas }: FirmEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: firm.name,
    website: firm.website || "",
    phone: firm.phone || "",
    logoUrl: firm.logoUrl || "",
    isActive: firm.isActive,
    isPremium: firm.isPremium,
    description: firm.description || "",
    founded: firm.founded?.toString() || "",
    employeeCount: firm.employeeCount?.toString() || "",
  })

  // Office management state
  const [offices, setOffices] = useState(firm.offices)
  const [editingOffice, setEditingOffice] = useState<string | null>(null)
  const [officeForm, setOfficeForm] = useState({
    city: "",
    stateId: "",
    address: "",
    isPrimary: false,
  })
  const [showAddOffice, setShowAddOffice] = useState(false)

  // Practice area management state
  const [practiceAreas, setPracticeAreas] = useState(firm.practiceAreas)
  const [selectedPracticeAreaId, setSelectedPracticeAreaId] = useState("")

  // Lawyer management state
  const [lawyers, setLawyers] = useState(firm.lawyers)
  const [editingLawyer, setEditingLawyer] = useState<string | null>(null)
  const [lawyerForm, setLawyerForm] = useState({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    bio: "",
  })
  const [showAddLawyer, setShowAddLawyer] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("logo", file)

      const response = await fetch(`/api/admin/firms/${firm.id}/upload-logo`, {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload logo")
      }

      const data = await response.json()
      setFormData({ ...formData, logoUrl: data.logoUrl })
      router.refresh()
      alert("Logo uploaded successfully!")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload logo")
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/firms/${firm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          website: formData.website || null,
          phone: formData.phone || null,
          logoUrl: formData.logoUrl || null,
          isActive: formData.isActive,
          isPremium: formData.isPremium,
          description: formData.description || null,
          founded: formData.founded ? parseInt(formData.founded) : null,
          employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update firm")
      }

      router.push("/admin/firms")
      router.refresh()
    } catch (error) {
      console.error("Error updating firm:", error)
      alert("Failed to update firm. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Office handlers
  const handleAddOffice = async () => {
    if (!officeForm.city || !officeForm.stateId) {
      alert("City and State are required")
      return
    }

    try {
      const response = await fetch(`/api/admin/firms/${firm.id}/offices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(officeForm),
      })

      if (!response.ok) throw new Error("Failed to add office")

      const newOffice = await response.json()
      setOffices([...offices, newOffice])
      setOfficeForm({ city: "", stateId: "", address: "", isPrimary: false })
      setShowAddOffice(false)
      router.refresh()
    } catch (error) {
      alert("Failed to add office")
    }
  }

  const handleUpdateOffice = async (officeId: string) => {
    if (!officeForm.city || !officeForm.stateId) {
      alert("City and State are required")
      return
    }

    try {
      const response = await fetch(`/api/admin/firms/${firm.id}/offices/${officeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(officeForm),
      })

      if (!response.ok) throw new Error("Failed to update office")

      const updatedOffice = await response.json()
      setOffices(offices.map((o) => (o.id === officeId ? updatedOffice : o)))
      setEditingOffice(null)
      router.refresh()
    } catch (error) {
      alert("Failed to update office")
    }
  }

  const handleDeleteOffice = async (officeId: string) => {
    if (!confirm("Delete this office?")) return

    try {
      const response = await fetch(`/api/admin/firms/${firm.id}/offices/${officeId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete office")

      setOffices(offices.filter((o) => o.id !== officeId))
      router.refresh()
    } catch (error) {
      alert("Failed to delete office")
    }
  }

  const startEditOffice = (office: any) => {
    setEditingOffice(office.id)
    setOfficeForm({
      city: office.city,
      stateId: office.state.id,
      address: office.address || "",
      isPrimary: office.isPrimary,
    })
  }

  // Practice area handlers
  const handleAddPracticeArea = async () => {
    if (!selectedPracticeAreaId) return

    try {
      const response = await fetch(`/api/admin/firms/${firm.id}/practice-areas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practiceAreaId: selectedPracticeAreaId }),
      })

      if (!response.ok) throw new Error("Failed to add practice area")

      const newPracticeArea = await response.json()
      setPracticeAreas([...practiceAreas, newPracticeArea])
      setSelectedPracticeAreaId("")
      router.refresh()
    } catch (error) {
      alert("Failed to add practice area")
    }
  }

  const handleRemovePracticeArea = async (firmPracticeAreaId: string) => {
    if (!confirm("Remove this practice area?")) return

    try {
      const response = await fetch(
        `/api/admin/firms/${firm.id}/practice-areas/${firmPracticeAreaId}`,
        { method: "DELETE" }
      )

      if (!response.ok) throw new Error("Failed to remove practice area")

      setPracticeAreas(practiceAreas.filter((pa) => pa.id !== firmPracticeAreaId))
      router.refresh()
    } catch (error) {
      alert("Failed to remove practice area")
    }
  }

  // Lawyer handlers
  const handleAddLawyer = async () => {
    if (!lawyerForm.firstName || !lawyerForm.lastName) {
      alert("First name and last name are required")
      return
    }

    try {
      const response = await fetch(`/api/admin/firms/${firm.id}/lawyers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lawyerForm),
      })

      if (!response.ok) throw new Error("Failed to add lawyer")

      const newLawyer = await response.json()
      setLawyers([...lawyers, newLawyer])
      setLawyerForm({
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        phone: "",
        bio: "",
      })
      setShowAddLawyer(false)
      router.refresh()
    } catch (error) {
      alert("Failed to add lawyer")
    }
  }

  const handleUpdateLawyer = async (lawyerId: string) => {
    try {
      const response = await fetch(`/api/admin/firms/${firm.id}/lawyers/${lawyerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lawyerForm),
      })

      if (!response.ok) throw new Error("Failed to update lawyer")

      const updatedLawyer = await response.json()
      setLawyers(lawyers.map((l) => (l.id === lawyerId ? updatedLawyer : l)))
      setEditingLawyer(null)
      router.refresh()
    } catch (error) {
      alert("Failed to update lawyer")
    }
  }

  const handleDeleteLawyer = async (lawyerId: string) => {
    if (!confirm("Delete this lawyer?")) return

    try {
      const response = await fetch(`/api/admin/firms/${firm.id}/lawyers/${lawyerId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete lawyer")

      setLawyers(lawyers.filter((l) => l.id !== lawyerId))
      router.refresh()
    } catch (error) {
      alert("Failed to delete lawyer")
    }
  }

  const startEditLawyer = (lawyer: any) => {
    setEditingLawyer(lawyer.id)
    setLawyerForm({
      firstName: lawyer.firstName,
      lastName: lawyer.lastName,
      title: lawyer.title || "",
      email: lawyer.email || "",
      phone: lawyer.phone || "",
      bio: lawyer.bio || "",
    })
  }

  // Get available practice areas (not already added)
  const availablePracticeAreas = allPracticeAreas.filter(
    (pa) => !practiceAreas.some((fpa) => fpa.practiceArea.id === pa.id)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Firm Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="logoUrl" className="text-sm text-muted-foreground">
                  Enter Logo URL
                </Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 border-t"></div>
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 border-t"></div>
              </div>

              <div>
                <Label htmlFor="logoFile" className="text-sm text-muted-foreground">
                  Upload Logo File
                </Label>
                <Input
                  id="logoFile"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                {uploadingLogo && (
                  <p className="text-xs text-rose-500 mt-1">Uploading logo...</p>
                )}
                {!uploadingLogo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted formats: JPEG, PNG, WebP, SVG (Max 5MB)
                  </p>
                )}
              </div>

              {formData.logoUrl && (
                <div className="border rounded p-3 bg-muted/30">
                  <p className="text-sm font-medium mb-2">Current Logo:</p>
                  <img
                    src={formData.logoUrl}
                    alt="Current logo"
                    className="max-w-[200px] max-h-[100px] object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Brief description of the firm..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="founded">Founded Year</Label>
              <Input
                id="founded"
                type="number"
                placeholder="1990"
                value={formData.founded}
                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">Employee Count</Label>
              <Input
                id="employeeCount"
                type="number"
                placeholder="100"
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Profile Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive
                    ? "Active profiles appear in listings and allow users to view the full profile"
                    : "Inactive profiles show in listings with an 'Activate Profile' button instead"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPremium">Premium Profile</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isPremium
                    ? "Premium profiles display with a gold bar and appear first in all listings"
                    : "Standard profiles appear after premium profiles in listings"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {formData.isPremium ? "Premium" : "Standard"}
                </span>
                <Switch
                  id="isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offices */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Offices ({offices.length})</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddOffice(!showAddOffice)}
            >
              {showAddOffice ? "Cancel" : "Add Office"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddOffice && (
            <div className="p-4 border rounded-md bg-gray-50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={officeForm.city}
                    onChange={(e) => setOfficeForm({ ...officeForm, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Select
                    value={officeForm.stateId}
                    onValueChange={(value) => setOfficeForm({ ...officeForm, stateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={officeForm.address}
                  onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })}
                  placeholder="123 Main St, Suite 100"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={officeForm.isPrimary}
                  onChange={(e) => setOfficeForm({ ...officeForm, isPrimary: e.target.checked })}
                />
                <Label htmlFor="isPrimary">Primary Office</Label>
              </div>
              <Button type="button" onClick={handleAddOffice} className="bg-rose-500 hover:bg-rose-600">
                Add Office
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {offices.map((office) => (
              <div key={office.id} className="p-3 border rounded-md">
                {editingOffice === office.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input
                          value={officeForm.city}
                          onChange={(e) => setOfficeForm({ ...officeForm, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State *</Label>
                        <Select
                          value={officeForm.stateId}
                          onValueChange={(value) => setOfficeForm({ ...officeForm, stateId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.id} value={state.id}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={officeForm.address}
                        onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`isPrimary-${office.id}`}
                        checked={officeForm.isPrimary}
                        onChange={(e) => setOfficeForm({ ...officeForm, isPrimary: e.target.checked })}
                      />
                      <Label htmlFor={`isPrimary-${office.id}`}>Primary Office</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleUpdateOffice(office.id)}
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingOffice(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {office.city}, {office.state.name}
                        {office.isPrimary && (
                          <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </p>
                      {office.address && (
                        <p className="text-sm text-muted-foreground">{office.address}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEditOffice(office)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOffice(office.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {offices.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No offices added yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Practice Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Areas ({practiceAreas.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={selectedPracticeAreaId}
              onValueChange={setSelectedPracticeAreaId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select practice area to add" />
              </SelectTrigger>
              <SelectContent>
                {availablePracticeAreas.map((pa) => (
                  <SelectItem key={pa.id} value={pa.id}>
                    {pa.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddPracticeArea}
              disabled={!selectedPracticeAreaId}
              className="bg-rose-500 hover:bg-rose-600"
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {practiceAreas.map((fpa) => (
              <div key={fpa.id} className="p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{fpa.practiceArea.name}</p>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePracticeArea(fpa.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {practiceAreas.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No practice areas added yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lawyers */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lawyers ({lawyers.length})</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddLawyer(!showAddLawyer)}
            >
              {showAddLawyer ? "Cancel" : "Add Lawyer"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddLawyer && (
            <div className="p-4 border rounded-md bg-gray-50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={lawyerForm.firstName}
                    onChange={(e) => setLawyerForm({ ...lawyerForm, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={lawyerForm.lastName}
                    onChange={(e) => setLawyerForm({ ...lawyerForm, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={lawyerForm.title}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, title: e.target.value })}
                  placeholder="Partner, Associate, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={lawyerForm.email}
                    onChange={(e) => setLawyerForm({ ...lawyerForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={lawyerForm.phone}
                    onChange={(e) => setLawyerForm({ ...lawyerForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={lawyerForm.bio}
                  onChange={(e) => setLawyerForm({ ...lawyerForm, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="button" onClick={handleAddLawyer} className="bg-rose-500 hover:bg-rose-600">
                Add Lawyer
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {lawyers.map((lawyer) => (
              <div key={lawyer.id} className="p-3 border rounded-md">
                {editingLawyer === lawyer.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          value={lawyerForm.firstName}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          value={lawyerForm.lastName}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={lawyerForm.title}
                        onChange={(e) => setLawyerForm({ ...lawyerForm, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={lawyerForm.email}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={lawyerForm.phone}
                          onChange={(e) => setLawyerForm({ ...lawyerForm, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea
                        value={lawyerForm.bio}
                        onChange={(e) => setLawyerForm({ ...lawyerForm, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleUpdateLawyer(lawyer.id)}
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingLawyer(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {lawyer.firstName} {lawyer.lastName}
                      </p>
                      {lawyer.title && (
                        <p className="text-sm text-muted-foreground">{lawyer.title}</p>
                      )}
                      {lawyer.email && (
                        <p className="text-sm text-muted-foreground">{lawyer.email}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEditLawyer(lawyer)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLawyer(lawyer.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {lawyers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No lawyers added yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/firms")}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
