"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Nomination = {
  id: string
  nominatorName: string
  nominatorEmail: string
  nominatorPhone: string | null
  firmName: string
  firmWebsite: string | null
  firmDescription: string | null
  city: string
  state: string
  address: string | null
  practiceAreas: string
  notes: string | null
  status: string
  createdAt: Date
}

interface NominationsManagerProps {
  initialNominations: Nomination[]
}

export function NominationsManager({ initialNominations }: NominationsManagerProps) {
  const router = useRouter()
  const [nominations, setNominations] = useState(initialNominations)
  const [loading, setLoading] = useState(false)
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [notificationEmail, setNotificationEmail] = useState("")

  const handleApprove = async (id: string) => {
    if (!confirm("Approve this nomination?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/nominations/${id}/approve`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to approve")

      setNominations(nominations.filter(n => n.id !== id))
      router.refresh()
      alert("Nomination approved successfully!")
    } catch (error) {
      alert("Failed to approve nomination")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/nominations/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (!response.ok) throw new Error("Failed to reject")

      setNominations(nominations.filter(n => n.id !== id))
      setSelectedNomination(null)
      setRejectionReason("")
      router.refresh()
      alert("Nomination rejected")
    } catch (error) {
      alert("Failed to reject nomination")
    } finally {
      setLoading(false)
    }
  }

  const saveNotificationEmail = () => {
    // Store in localStorage for now
    localStorage.setItem("nominationNotificationEmail", notificationEmail)
    alert("Notification email saved!")
  }

  return (
    <div className="space-y-6">
      {/* Email Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="notificationEmail">
                Email address for nomination notifications
              </Label>
              <Input
                id="notificationEmail"
                type="email"
                placeholder="admin@example.com"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
              />
            </div>
            <Button onClick={saveNotificationEmail}>Save Email</Button>
          </div>
        </CardContent>
      </Card>

      {/* Nominations List */}
      {nominations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No pending nominations</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {nominations.map((nomination) => {
            const practiceAreas = JSON.parse(nomination.practiceAreas || "[]")

            return (
              <Card key={nomination.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 text-rose-500">
                        {nomination.firmName}
                      </CardTitle>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <strong>Submitted by:</strong> {nomination.nominatorName}
                        </p>
                        <p>
                          <strong>Email:</strong> {nomination.nominatorEmail}
                        </p>
                        {nomination.nominatorPhone && (
                          <p>
                            <strong>Phone:</strong> {nomination.nominatorPhone}
                          </p>
                        )}
                        <p>
                          <strong>Location:</strong> {nomination.city}, {nomination.state}
                        </p>
                        {nomination.address && (
                          <p>
                            <strong>Address:</strong> {nomination.address}
                          </p>
                        )}
                        {nomination.firmWebsite && (
                          <p>
                            <strong>Website:</strong>{" "}
                            <a
                              href={nomination.firmWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {nomination.firmWebsite}
                            </a>
                          </p>
                        )}
                        {practiceAreas.length > 0 && (
                          <p>
                            <strong>Practice Areas:</strong> {practiceAreas.join(", ")}
                          </p>
                        )}
                        {nomination.firmDescription && (
                          <p className="mt-2">
                            <strong>Description:</strong> {nomination.firmDescription}
                          </p>
                        )}
                        {nomination.notes && (
                          <p className="mt-2">
                            <strong>Notes:</strong> {nomination.notes}
                          </p>
                        )}
                        <p className="text-xs mt-2">
                          Submitted: {new Date(nomination.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                        onClick={() => handleApprove(nomination.id)}
                        disabled={loading}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedNomination(
                            selectedNomination?.id === nomination.id ? null : nomination
                          )
                        }
                      >
                        {selectedNomination?.id === nomination.id ? "Cancel" : "Reject"}
                      </Button>
                    </div>
                  </div>

                  {/* Rejection Form */}
                  {selectedNomination?.id === nomination.id && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`reason-${nomination.id}`}>
                          Rejection Reason (optional)
                        </Label>
                        <Textarea
                          id={`reason-${nomination.id}`}
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Provide a reason for rejection..."
                          rows={3}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(nomination.id)}
                        disabled={loading}
                      >
                        Confirm Rejection
                      </Button>
                    </div>
                  )}
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
