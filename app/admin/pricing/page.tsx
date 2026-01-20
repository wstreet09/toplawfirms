"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/layout/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PricingTier {
  id: string
  name: string
  description: string
  tagline: string
  price: string
  icon: string
  highlighted: boolean
  cta: string
  ctaUrl?: string
  features: string[]
}

export default function AdminPricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([
    {
      id: "visibility",
      name: "Visibility",
      description: "Appear in search when clients are looking",
      tagline: "Build trust without added outreach",
      price: "$199",
      icon: "🔍",
      highlighted: false,
      cta: "Get Started",
      features: [
        "Lawyer and firm profiles on Top Law Firms",
        "Award badges and recognition",
        "SEO-enhancing backlinks to your website",
        "Enhanced search visibility",
        "Mobile-optimized profiles",
        "Basic analytics dashboard",
      ],
    },
    {
      id: "business-development",
      name: "Business Development",
      description: "Content support and reputation strengthening",
      tagline: "Convert visibility into client engagement",
      price: "$499",
      icon: "📈",
      highlighted: true,
      cta: "Get Started",
      features: [
        "Everything in Visibility",
        "Content Pro - Generate original, search-optimized content that signals authority to AI and Google",
        "Content publishing on Top Law Firms",
        "Press release generation tools",
        "Concierge profile setup service",
        "Expanded search card visibility",
        "Featured firm placement",
        "Priority customer support",
      ],
    },
    {
      id: "market-leader",
      name: "Market Leader",
      description: "Strategic research partnerships and competitive advantages",
      tagline: "Lead your market with exclusive insights",
      price: "Contact Us",
      icon: "🏆",
      highlighted: false,
      cta: "Contact Sales",
      features: [
        "Everything in Business Development",
        "Research PRO access with data uploader",
        "One-on-one consultations with experts",
        "Early rankings access",
        "Exclusive industry webinars",
        "Client Insights Report",
        "Detailed client feedback data",
        "Dedicated account manager",
        "Custom market analysis",
      ],
    },
  ])

  const [editingTier, setEditingTier] = useState<PricingTier | null>(null)
  const [newFeature, setNewFeature] = useState("")

  const handleEditTier = (tier: PricingTier) => {
    setEditingTier({ ...tier })
  }

  const handleSaveTier = () => {
    if (!editingTier) return

    setTiers(tiers.map(t => t.id === editingTier.id ? editingTier : t))
    setEditingTier(null)
  }

  const handleCancelEdit = () => {
    setEditingTier(null)
    setNewFeature("")
  }

  const handleAddFeature = () => {
    if (!editingTier || !newFeature.trim()) return

    setEditingTier({
      ...editingTier,
      features: [...editingTier.features, newFeature.trim()],
    })
    setNewFeature("")
  }

  const handleRemoveFeature = (index: number) => {
    if (!editingTier) return

    setEditingTier({
      ...editingTier,
      features: editingTier.features.filter((_, i) => i !== index),
    })
  }

  const handleUpdateFeature = (index: number, value: string) => {
    if (!editingTier) return

    setEditingTier({
      ...editingTier,
      features: editingTier.features.map((f, i) => i === index ? value : f),
    })
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pricing Management</h1>
          <p className="text-muted-foreground">
            Manage pricing tiers, features, and pricing displayed on the pricing page
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Tiers List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pricing Tiers</h2>
            {tiers.map((tier) => (
              <Card key={tier.id} className={tier.highlighted ? "border-rose-500 border-2" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{tier.icon}</span>
                        <CardTitle>{tier.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{tier.description}</p>
                      <p className="text-xs text-muted-foreground italic">{tier.tagline}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTier(tier)}
                      disabled={editingTier?.id === tier.id}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="text-lg font-bold">{tier.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Button Text:</span>
                      <span className="text-sm">{tier.cta}</span>
                    </div>
                    {tier.ctaUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Button URL:</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{tier.ctaUrl}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Highlighted:</span>
                      <span className="text-sm">{tier.highlighted ? "Yes" : "No"}</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Features ({tier.features.length}):</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        {tier.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                        {tier.features.length > 3 && (
                          <li className="italic">... and {tier.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Panel */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            {editingTier ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit {editingTier.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Tier Name</Label>
                    <Input
                      id="name"
                      value={editingTier.name}
                      onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={editingTier.description}
                      onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={editingTier.tagline}
                      onChange={(e) => setEditingTier({ ...editingTier, tagline: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={editingTier.price}
                      onChange={(e) => setEditingTier({ ...editingTier, price: e.target.value })}
                      placeholder="e.g., $199 or Contact Us"
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input
                      id="icon"
                      value={editingTier.icon}
                      onChange={(e) => setEditingTier({ ...editingTier, icon: e.target.value })}
                      placeholder="e.g., 🔍"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta">Button Text</Label>
                    <Input
                      id="cta"
                      value={editingTier.cta}
                      onChange={(e) => setEditingTier({ ...editingTier, cta: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ctaUrl">Button URL (Optional)</Label>
                    <Input
                      id="ctaUrl"
                      value={editingTier.ctaUrl || ""}
                      onChange={(e) => setEditingTier({ ...editingTier, ctaUrl: e.target.value })}
                      placeholder="e.g., https://payment.stripe.com/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to disable button link. Can be external payment URL or internal page.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="highlighted"
                      checked={editingTier.highlighted}
                      onChange={(e) => setEditingTier({ ...editingTier, highlighted: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="highlighted" className="cursor-pointer">
                      Highlight as "Most Popular"
                    </Label>
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="space-y-2 mt-2">
                      {editingTier.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={feature}
                            onChange={(e) => handleUpdateFeature(index, e.target.value)}
                            rows={2}
                            className="flex-1"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add new feature..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddFeature()
                          }
                        }}
                      />
                      <Button onClick={handleAddFeature} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveTier} className="flex-1">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Select a pricing tier to edit
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Changes made here are currently stored in the browser session only.
              To persist changes, you'll need to update the pricing page file directly or implement a database-backed pricing system.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
