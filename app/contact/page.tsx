"use client"

import { useState } from "react"
import { Container } from "@/components/layout/container"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <Container>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl">
            Need assistance or have questions? Our helpful staff is just a click or call away.
          </p>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="bg-slate-800 py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">Get in Touch</h2>

              {isSubmitted ? (
                <div className="bg-green-900/50 border border-green-500 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-green-300">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                      <p className="text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-transparent border-b border-gray-500 py-3 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-transparent border-b border-gray-500 py-3 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-500 py-3 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-500 py-3 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full bg-transparent border-b border-gray-500 py-3 text-white focus:border-white focus:outline-none transition-colors appearance-none cursor-pointer"
                      style={{ backgroundColor: 'rgb(30, 41, 59)' }}
                    >
                      <option value="" disabled className="bg-slate-800">Subject</option>
                      <option value="general" className="bg-slate-800">General Inquiry</option>
                      <option value="profile" className="bg-slate-800">Profile Activation</option>
                      <option value="advertising" className="bg-slate-800">Advertising</option>
                      <option value="nomination" className="bg-slate-800">Nomination Question</option>
                      <option value="other" className="bg-slate-800">Other</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      placeholder="Message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-500 py-3 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="md:pl-12">
              <h2 className="text-4xl font-bold text-white mb-8">Contact Info</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Email</h3>
                  <a
                    href="mailto:info@toplawfirms.net"
                    className="text-amber-500 hover:text-amber-400 transition-colors text-lg"
                  >
                    info@toplawfirms.net
                  </a>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">For Firms</h3>
                  <p className="text-gray-300 mb-2">
                    Interested in activating your firm profile or learning about advertising opportunities?
                  </p>
                  <a
                    href="/pricing"
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    View Pricing Options
                  </a>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Nominate a Firm</h3>
                  <p className="text-gray-300 mb-2">
                    Know a law firm that deserves recognition?
                  </p>
                  <a
                    href="/nominate"
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Submit a Nomination
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
