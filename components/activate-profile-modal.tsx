"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ActivateProfileModalProps {
  isOpen: boolean
  onClose: () => void
  firmName?: string
}

export function ActivateProfileModal({ isOpen, onClose, firmName }: ActivateProfileModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    firmName: firmName || "",
    country: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual form submission logic
    // For now, just simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setSubmitSuccess(true)

    // Reset form after 2 seconds and close modal
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        firmName: firmName || "",
        country: "",
      })
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 pr-8">
            Activate your Top Law Firms Profile
          </h2>

          <div className="w-16 h-1 bg-amber-600 mb-6"></div>

          {submitSuccess ? (
            <div className="py-8 text-center">
              <div className="text-5xl mb-3">✓</div>
              <p className="text-xl font-bold text-green-600">Thank you for your submission!</p>
              <p className="text-sm text-gray-600 mt-1">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 h-10 bg-gray-50 border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                />
              </div>

              {/* First name */}
              <div>
                <Label htmlFor="firstName" className="text-sm font-semibold">
                  First name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="mt-1 h-10 bg-gray-50 border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                />
              </div>

              {/* Last name */}
              <div>
                <Label htmlFor="lastName" className="text-sm font-semibold">
                  Last name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="mt-1 h-10 bg-gray-50 border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                />
              </div>

              {/* Firm name */}
              <div>
                <Label htmlFor="firmName" className="text-sm font-semibold">
                  Firm name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                  required
                  className="mt-1 h-10 bg-gray-50 border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                />
              </div>

              {/* Country/Region */}
              <div>
                <Label htmlFor="country" className="text-sm font-semibold">
                  Country/Region<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  className="mt-1 h-10 bg-gray-50 border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                />
              </div>

              {/* Submit button */}
              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 text-base font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}

          {/* Learn more link */}
          <div className="mt-6 pt-6 border-t">
            <a
              href="/top-law-firms-profile"
              className="text-amber-700 hover:text-amber-800 font-semibold text-sm inline-flex items-center gap-1.5 group"
            >
              Learn more about Top Law Firms Profiles
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
