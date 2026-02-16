'use client'

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout/container"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExistingFirm {
  id: string
  name: string
  slug: string
  isActive: boolean
  location: string | null
}

const US_PRACTICE_AREAS = [
  "Administrative / Regulatory Law",
  "Alternative Dispute Resolution",
  "Antitrust Law",
  "Appellate Practice",
  "Banking and Finance Law",
  "Bankruptcy and Creditor Debtor Rights / Insolvency and Reorganization Law",
  "Business Organizations (including LLCs and Partnerships)",
  "Civil Rights Law",
  "Closely Held Companies and Family Businesses Law",
  "Commercial Litigation",
  "Communications Law",
  "Construction Law",
  "Corporate Governance and Compliance Law",
  "Corporate Law",
  "Criminal Defense: General Practice",
  "Criminal Defense: White-Collar",
  "DUI / DWI Defense",
  "Education Law",
  "Elder Law",
  "Eminent Domain and Condemnation Law",
  "Employee Benefits (ERISA) Law",
  "Energy Law",
  "Entertainment and Sports Law",
  "Environmental Law",
  "Family Law",
  "Family Law: Arbitration and Mediation",
  "Financial Services Regulation Law",
  "Government Relations Practice",
  "Health Care Law",
  "Immigration Law",
  "Insurance Law",
  "Intellectual Property Law",
  "Labor and Employment Law - Employee",
  "Labor and Employment Law - Management",
  "Land Use and Zoning Law",
  "Legal Malpractice Law",
  "Leveraged Buyouts and Private Equity Law",
  "Life Sciences Practice",
  "Litigation - Antitrust",
  "Litigation - Banking and Finance",
  "Litigation - Bankruptcy",
  "Litigation - Construction",
  "Litigation - Environmental",
  "Litigation - Intellectual Property",
  "Litigation - Labor and Employment",
  "Litigation - Patent",
  "Litigation - Real Estate",
  "Litigation - Securities",
  "Litigation - Trusts and Estates",
  "Litigation and Controversy - Tax",
  "Mass Tort Litigation / Class Actions - Defendants",
  "Mass Tort Litigation / Class Actions - Plaintiffs",
  "Medical Malpractice Law - Defendants",
  "Medical Malpractice Law - Plaintiffs",
  "Mergers and Acquisitions Law",
  "Municipal Law",
  "Native American Law",
  "Natural Resources Law",
  "Nonprofit / Charities Law",
  "Oil and Gas Law",
  "Patent Law",
  "Personal Injury Litigation - Defendants",
  "Personal Injury Litigation - Plaintiffs",
  "Privacy and Data Security Law",
  "Product Liability Litigation - Defendants",
  "Product Liability Litigation - Plaintiffs",
  "Professional Malpractice Law",
  "Project Finance Law",
  "Public Finance Law",
  "Real Estate Law",
  "Securities / Capital Markets Law",
  "Securities Regulation",
  "Tax Law",
  "Technology Law",
  "Transportation Law",
  "Trusts and Estates",
  "Venture Capital Law",
  "Workers' Compensation Law - Claimants",
  "Workers' Compensation Law - Employers"
]

const GERMANY_PRACTICE_AREAS = [
  "Administrative Law",
  "Advertising Law",
  "Agricultural Law",
  "Alternative Dispute Resolution",
  "Antitrust and Competition Law",
  "Appellate Practice",
  "Aviation Law",
  "Banking and Finance Law",
  "Bankruptcy and Insolvency Law",
  "Building and Architectural Law",
  "Capital Markets Law",
  "Chemical Industry Law",
  "Civil Law",
  "Commercial and Corporate Law",
  "Commercial Law",
  "Communications Law",
  "Company Law",
  "Competition Law",
  "Construction Law",
  "Consumer Protection Law",
  "Contract Law",
  "Copyright Law",
  "Corporate Compliance",
  "Corporate Governance",
  "Corporate Law",
  "Criminal Defense: General Practice",
  "Criminal Defense: White-Collar",
  "Data Protection and Privacy Law",
  "Design Law",
  "Distribution and Agency Law",
  "E-Commerce Law",
  "Education Law",
  "Employment Law",
  "Energy Law",
  "Entertainment and Media Law",
  "Environmental Law",
  "EU Law",
  "Family Law",
  "Financial Services Law",
  "Food Law",
  "Franchise Law",
  "Gaming Law",
  "Health Care Law",
  "Immigration Law",
  "Industrial Relations",
  "Information Technology Law",
  "Inheritance Law",
  "Insurance Law",
  "Intellectual Property Law",
  "International Arbitration",
  "International Trade Law",
  "Investment Funds Law",
  "IT and Telecommunications Law",
  "Labor Law",
  "Life Sciences Law",
  "Litigation - Banking and Finance",
  "Litigation - Commercial",
  "Litigation - Construction",
  "Litigation - Corporate",
  "Litigation - Employment",
  "Litigation - Intellectual Property",
  "Litigation - Real Estate",
  "M&A Litigation",
  "Maritime Law",
  "Media Law",
  "Medical Malpractice Law",
  "Medical Negligence Law",
  "Mergers and Acquisitions Law",
  "Mining Law",
  "Motor Vehicle Law",
  "Non-Profit Organizations and Foundations",
  "Patent Law",
  "Pharmaceutical Law",
  "Planning and Zoning Law",
  "Private Client Law",
  "Private Equity Law",
  "Private International Law",
  "Product Liability Law",
  "Product Safety Law",
  "Professional Liability Law",
  "Project Finance Law",
  "Public Law",
  "Public Procurement Law",
  "Real Estate Law",
  "Regulatory Law",
  "Renewable Energy Law",
  "Restructuring and Insolvency Law",
  "Retail Law",
  "Securities Law",
  "Social Security Law",
  "Sports Law",
  "Start-Up and Venture Capital Law",
  "State Aid Law",
  "Tax Law",
  "Technology Law",
  "Telecommunications Law",
  "Tort Law",
  "Trade Mark Law",
  "Trade Secrets Law",
  "Transport Law",
  "Travel Law",
  "Trusts and Estates",
  "Unfair Competition Law",
  "Utilities Law",
  "Venture Capital Law",
  "Wealth Management Law",
  "White Collar Crime",
  "Work Council Law"
]

export default function NominatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form data state
  const [formData, setFormData] = useState({
    nominatorFirstName: "",
    nominatorLastName: "",
    nominatorCompany: "",
    nominatorPosition: "",
    nominatorCountry: "united-states",
    nominatorState: "",
    nominatorCity: "",
    nominatorEmail: "",
    relationship: "",
    firmCountry: "united-states",
    firmName: "",
    firmAddress: "",
    firmCity: "",
    firmState: "",
    firmZip: "",
    firmPhone: "",
    firmWebsite: "",
  })

  const [selectedCountry, setSelectedCountry] = useState("united-states")
  const [practiceSearch, setPracticeSearch] = useState("")
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([])
  const [showPracticeDropdown, setShowPracticeDropdown] = useState(false)

  // Firm lookup state
  const [existingFirms, setExistingFirms] = useState<ExistingFirm[]>([])
  const [isSearchingFirm, setIsSearchingFirm] = useState(false)
  const [showFirmResults, setShowFirmResults] = useState(false)
  const [selectedExistingFirm, setSelectedExistingFirm] = useState<ExistingFirm | null>(null)

  // Debounced firm lookup
  useEffect(() => {
    const firmName = formData.firmName.trim()

    if (firmName.length < 2) {
      setExistingFirms([])
      setShowFirmResults(false)
      setSelectedExistingFirm(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearchingFirm(true)
      try {
        const response = await fetch(`/api/firms/check?name=${encodeURIComponent(firmName)}`)
        const data = await response.json()
        setExistingFirms(data.firms || [])
        setShowFirmResults(data.firms && data.firms.length > 0)

        // Check for exact match
        const exactMatch = data.firms?.find(
          (f: ExistingFirm) => f.name.toLowerCase() === firmName.toLowerCase()
        )
        if (exactMatch) {
          setSelectedExistingFirm(exactMatch)
        } else {
          setSelectedExistingFirm(null)
        }
      } catch (error) {
        console.error("Error checking firm:", error)
      } finally {
        setIsSearchingFirm(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.firmName])

  // Get practice areas based on selected country
  const getPracticeAreas = () => {
    return selectedCountry === "germany" ? GERMANY_PRACTICE_AREAS : US_PRACTICE_AREAS
  }

  const nextStep = () => {
    // Prevent moving forward if an existing firm is selected on Step 3
    if (currentStep === 3 && selectedExistingFirm) {
      return
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/nominations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nominatorName: `${formData.nominatorFirstName} ${formData.nominatorLastName}`,
          nominatorEmail: formData.nominatorEmail,
          nominatorPhone: formData.firmPhone || null,
          firmName: formData.firmName,
          firmWebsite: formData.firmWebsite || null,
          firmDescription: null,
          city: formData.firmCity,
          state: formData.firmState,
          address: formData.firmAddress || null,
          practiceAreas: selectedPracticeAreas,
          notes: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit nomination")
      }

      const data = await response.json()

      // Redirect to success page with nomination ID
      router.push(`/nominate/success?id=${data.nomination.id}`)
    } catch (error) {
      console.error("Submission error:", error)
      alert("Failed to submit nomination. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const scrollToAccountSection = () => {
    const accountSection = document.getElementById('account-section')
    if (accountSection) {
      accountSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      const formElement = document.getElementById('nomination-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
        <Container className="py-12">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Nominate' },
            ]}
          />

          <div className="mt-8 mb-4 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-rose-500">Nominate</span> a law firm
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Clients, lawyers, publicists, and other references can nominate a law firm for peer-review consideration.
            </p>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Upcoming Deadlines</h2>
              <div className="space-y-2 text-lg text-muted-foreground">
                <div><strong>United States</strong> - February 27, 2026</div>
                <div><strong>Germany</strong> - March 27, 2026</div>
              </div>
            </div>
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={scrollToAccountSection}
            >
              Begin Nomination
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Visual Process Steps */}
          <div className="mb-12 bg-gray-50 border rounded-lg p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1: Nominator */}
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-rose-500 bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-rose-500">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Nominator</h3>
                <p className="text-sm text-muted-foreground">
                  Provide your contact information and relationship to the nominated firm.
                </p>
              </div>

              {/* Step 2: Nominee Location */}
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-rose-500 bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-rose-500">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Nominee Location</h3>
                <p className="text-sm text-muted-foreground">
                  Specify the state and city where the law firm is located.
                </p>
              </div>

              {/* Step 3: Nominee Information */}
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-rose-500 bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-rose-500">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Nominee Information</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the firm's name, website, contact details, and office address.
                </p>
              </div>

              {/* Step 4: Practice Focus */}
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-rose-500 bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-rose-500">4</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Practice Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Select up to three practice areas where the firm excels.
                </p>
              </div>
            </div>
          </div>

          {/* Already have an account? */}
          <div id="account-section" className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Already have an account?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Log in to access your information and make submitting nominations even easier.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/login">Yes, Log In</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToForm}
              >
                No, Continue
              </Button>
            </div>
          </div>

          {/* Form Section - Only shown after user clicks continue */}
          {showForm && (
            <>
          {/* Step Indicator */}
          <div id="nomination-form" className="mb-12">
            <div className="flex justify-center items-center gap-8 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center gap-3 ${step <= currentStep ? '' : 'opacity-40'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step === currentStep
                        ? 'bg-rose-500 text-white'
                        : step < currentStep
                        ? 'bg-rose-500 text-white'
                        : 'border-2 border-gray-300 text-gray-400'
                    }`}>
                      <span className="text-lg font-bold">{step}</span>
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      {step === 1 && 'Nominator'}
                      {step === 2 && 'Nominee Location'}
                      {step === 3 && 'Nominee Information'}
                      {step === 4 && 'Practice Focus'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paginated Form */}
          <form onSubmit={handleSubmit} className="space-y-8 bg-gray-50 p-8 rounded-lg">
            {/* Step 1: Nominator Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">Tell us about yourself.</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="nominator-first-name" className="text-base text-muted-foreground">
                      First Name<span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="nominator-first-name"
                      value={formData.nominatorFirstName}
                      onChange={(e) => setFormData({ ...formData, nominatorFirstName: e.target.value })}
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nominator-last-name" className="text-base text-muted-foreground">
                      Last Name<span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="nominator-last-name"
                      value={formData.nominatorLastName}
                      onChange={(e) => setFormData({ ...formData, nominatorLastName: e.target.value })}
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base text-muted-foreground">
                      Email<span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.nominatorEmail}
                      onChange={(e) => setFormData({ ...formData, nominatorEmail: e.target.value })}
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="relationship" className="text-base text-muted-foreground block mb-2">
                      How do you know nominee?
                    </Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                    >
                      <SelectTrigger
                        id="relationship"
                        className="border-0 border-b border-gray-300 rounded-none px-0 focus:ring-0 bg-transparent"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lawyer">I'm a lawyer</SelectItem>
                        <SelectItem value="law-firm-employee">I work for a law firm</SelectItem>
                        <SelectItem value="publicist">I'm an outside publicist / consultant</SelectItem>
                        <SelectItem value="client">I'm a client</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Firm Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">Where does your nominee practice?</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="firm-country" className="text-base text-muted-foreground block mb-2">
                      Country<span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      defaultValue="united-states"
                      value={selectedCountry}
                      onValueChange={setSelectedCountry}
                      required
                    >
                      <SelectTrigger
                        id="firm-country"
                        className="border-0 border-b border-gray-300 rounded-none px-0 focus:ring-0 bg-transparent"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="united-states">United States</SelectItem>
                        <SelectItem value="germany">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700">
                  <p className="text-sm">
                    <strong>Note:</strong> We are only accepting nominations at this time in countries where we are actively researching.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Firm Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">Who are you nominating?</h2>

                <div className="space-y-6">
                  <div className="relative">
                    <Label htmlFor="firm-name" className="text-base text-muted-foreground">
                      Firm Name<span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="firm-name"
                        value={formData.firmName}
                        onChange={(e) => {
                          setFormData({ ...formData, firmName: e.target.value })
                          setSelectedExistingFirm(null)
                        }}
                        onFocus={() => existingFirms.length > 0 && setShowFirmResults(true)}
                        className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                        required
                      />
                      {isSearchingFirm && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          Searching...
                        </span>
                      )}
                    </div>

                    {/* Firm lookup results dropdown */}
                    {showFirmResults && existingFirms.length > 0 && !selectedExistingFirm && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                          Existing firms found:
                        </div>
                        {existingFirms.map((firm) => (
                          <button
                            key={firm.id}
                            type="button"
                            onClick={() => {
                              setSelectedExistingFirm(firm)
                              setFormData({ ...formData, firmName: firm.name })
                              setShowFirmResults(false)
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0"
                          >
                            <div className="font-medium">{firm.name}</div>
                            {firm.location && (
                              <div className="text-sm text-muted-foreground">{firm.location}</div>
                            )}
                            <div className="text-xs mt-1">
                              {firm.isActive ? (
                                <span className="text-green-600">Active Profile</span>
                              ) : (
                                <span className="text-amber-600">Inactive Profile - Activation Available</span>
                              )}
                            </div>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setShowFirmResults(false)
                            setSelectedExistingFirm(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-gray-100"
                        >
                          This is a different firm - continue with nomination
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Existing firm notification */}
                  {selectedExistingFirm && (
                    <div className={`p-4 rounded-lg border ${selectedExistingFirm.isActive ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
                      {selectedExistingFirm.isActive ? (
                        <>
                          <h3 className="font-bold text-blue-800 mb-2">This firm already has an active profile</h3>
                          <p className="text-sm text-blue-700 mb-4">
                            <strong>{selectedExistingFirm.name}</strong> is already listed in our directory with a verified profile.
                          </p>
                          <div className="flex gap-3">
                            <Link
                              href={`/firms/${selectedExistingFirm.slug}/overview`}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                              View Firm Profile
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedExistingFirm(null)
                                setFormData({ ...formData, firmName: "" })
                              }}
                              className="px-4 py-2 text-sm text-blue-600 hover:underline"
                            >
                              Nominate a different firm
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="font-bold text-amber-800 mb-2">This firm has an inactive profile</h3>
                          <p className="text-sm text-amber-700 mb-4">
                            <strong>{selectedExistingFirm.name}</strong> is listed in our directory but their profile is not yet activated.
                            You can activate this profile to unlock full features.
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <Link
                              href="/pricing"
                              className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm font-medium"
                            >
                              Activate This Profile
                            </Link>
                            <Link
                              href={`/search?q=${encodeURIComponent(selectedExistingFirm.name)}`}
                              className="px-4 py-2 text-sm text-amber-700 border border-amber-300 rounded-md hover:bg-amber-100"
                            >
                              View Listing
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedExistingFirm(null)
                                setFormData({ ...formData, firmName: "" })
                              }}
                              className="px-4 py-2 text-sm text-amber-600 hover:underline"
                            >
                              Nominate a different firm
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Only show rest of form if no existing firm selected or if firm doesn't exist */}
                  {!selectedExistingFirm && (
                    <>
                  <div>
                    <Label htmlFor="firm-address" className="text-base text-muted-foreground">
                      Street Address<span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="firm-address"
                      value={formData.firmAddress}
                      onChange={(e) => setFormData({ ...formData, firmAddress: e.target.value })}
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firm-city" className="text-base text-muted-foreground">
                        City<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="firm-city"
                        value={formData.firmCity}
                        onChange={(e) => setFormData({ ...formData, firmCity: e.target.value })}
                        className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="firm-state" className="text-base text-muted-foreground block mb-2">
                        State/Province
                      </Label>
                      <Select
                        value={formData.firmState}
                        onValueChange={(value) => setFormData({ ...formData, firmState: value })}
                      >
                        <SelectTrigger
                          id="firm-state"
                          className="border-0 border-b border-gray-300 rounded-none px-0 focus:ring-0 bg-transparent"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alabama">Alabama</SelectItem>
                          <SelectItem value="alaska">Alaska</SelectItem>
                          <SelectItem value="arizona">Arizona</SelectItem>
                          <SelectItem value="arkansas">Arkansas</SelectItem>
                          <SelectItem value="california">California</SelectItem>
                          <SelectItem value="colorado">Colorado</SelectItem>
                          <SelectItem value="connecticut">Connecticut</SelectItem>
                          <SelectItem value="delaware">Delaware</SelectItem>
                          <SelectItem value="florida">Florida</SelectItem>
                          <SelectItem value="georgia">Georgia</SelectItem>
                          <SelectItem value="hawaii">Hawaii</SelectItem>
                          <SelectItem value="idaho">Idaho</SelectItem>
                          <SelectItem value="illinois">Illinois</SelectItem>
                          <SelectItem value="indiana">Indiana</SelectItem>
                          <SelectItem value="iowa">Iowa</SelectItem>
                          <SelectItem value="kansas">Kansas</SelectItem>
                          <SelectItem value="kentucky">Kentucky</SelectItem>
                          <SelectItem value="louisiana">Louisiana</SelectItem>
                          <SelectItem value="maine">Maine</SelectItem>
                          <SelectItem value="maryland">Maryland</SelectItem>
                          <SelectItem value="massachusetts">Massachusetts</SelectItem>
                          <SelectItem value="michigan">Michigan</SelectItem>
                          <SelectItem value="minnesota">Minnesota</SelectItem>
                          <SelectItem value="mississippi">Mississippi</SelectItem>
                          <SelectItem value="missouri">Missouri</SelectItem>
                          <SelectItem value="montana">Montana</SelectItem>
                          <SelectItem value="nebraska">Nebraska</SelectItem>
                          <SelectItem value="nevada">Nevada</SelectItem>
                          <SelectItem value="new-hampshire">New Hampshire</SelectItem>
                          <SelectItem value="new-jersey">New Jersey</SelectItem>
                          <SelectItem value="new-mexico">New Mexico</SelectItem>
                          <SelectItem value="new-york">New York</SelectItem>
                          <SelectItem value="north-carolina">North Carolina</SelectItem>
                          <SelectItem value="north-dakota">North Dakota</SelectItem>
                          <SelectItem value="ohio">Ohio</SelectItem>
                          <SelectItem value="oklahoma">Oklahoma</SelectItem>
                          <SelectItem value="oregon">Oregon</SelectItem>
                          <SelectItem value="pennsylvania">Pennsylvania</SelectItem>
                          <SelectItem value="rhode-island">Rhode Island</SelectItem>
                          <SelectItem value="south-carolina">South Carolina</SelectItem>
                          <SelectItem value="south-dakota">South Dakota</SelectItem>
                          <SelectItem value="tennessee">Tennessee</SelectItem>
                          <SelectItem value="texas">Texas</SelectItem>
                          <SelectItem value="utah">Utah</SelectItem>
                          <SelectItem value="vermont">Vermont</SelectItem>
                          <SelectItem value="virginia">Virginia</SelectItem>
                          <SelectItem value="washington">Washington</SelectItem>
                          <SelectItem value="west-virginia">West Virginia</SelectItem>
                          <SelectItem value="wisconsin">Wisconsin</SelectItem>
                          <SelectItem value="wyoming">Wyoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firm-zip" className="text-base text-muted-foreground">
                        Zip Code<span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="firm-zip"
                        value={formData.firmZip}
                        onChange={(e) => setFormData({ ...formData, firmZip: e.target.value })}
                        className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="firm-phone" className="text-base text-muted-foreground">
                        Firm Phone
                      </Label>
                      <Input
                        id="firm-phone"
                        type="tel"
                        value={formData.firmPhone}
                        onChange={(e) => setFormData({ ...formData, firmPhone: e.target.value })}
                        className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="firm-website" className="text-base text-muted-foreground">
                      Firm Website<span className="text-rose-500">*</span> <span className="text-sm">(ex: firm.com)</span>
                    </Label>
                    <Input
                      id="firm-website"
                      type="url"
                      value={formData.firmWebsite}
                      onChange={(e) => setFormData({ ...formData, firmWebsite: e.target.value })}
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                      required
                    />
                  </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Practice Areas */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-2">
                  What areas does <span className="text-blue-500">{formData.firmName || "this firm"}</span> practice?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">Select up to three areas.</p>

                <div className="space-y-6">
                  <div className="relative">
                    <Label htmlFor="practice-search" className="text-base text-muted-foreground">
                      Search practice areas<span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="practice-search"
                      placeholder="Search practice areas*"
                      value={practiceSearch}
                      onChange={(e) => {
                        setPracticeSearch(e.target.value)
                        setShowPracticeDropdown(true)
                      }}
                      onFocus={() => setShowPracticeDropdown(true)}
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-rose-500 bg-transparent"
                      required={selectedPracticeAreas.length === 0}
                    />

                    {/* Dropdown with filtered results */}
                    {showPracticeDropdown && practiceSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {getPracticeAreas()
                          .filter(area =>
                            area.toLowerCase().includes(practiceSearch.toLowerCase()) &&
                            !selectedPracticeAreas.includes(area)
                          )
                          .map((area) => (
                            <button
                              key={area}
                              type="button"
                              onClick={() => {
                                if (selectedPracticeAreas.length < 3) {
                                  setSelectedPracticeAreas([...selectedPracticeAreas, area])
                                  setPracticeSearch("")
                                  setShowPracticeDropdown(false)
                                }
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                              {area}
                            </button>
                          ))}
                        {getPracticeAreas().filter(area =>
                          area.toLowerCase().includes(practiceSearch.toLowerCase()) &&
                          !selectedPracticeAreas.includes(area)
                        ).length === 0 && (
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            No practice areas found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected practice areas */}
                  {selectedPracticeAreas.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selected ({selectedPracticeAreas.length}/3):</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPracticeAreas.map((area) => (
                          <div
                            key={area}
                            className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm"
                          >
                            <span>{area}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedPracticeAreas(selectedPracticeAreas.filter(a => a !== area))}
                              className="hover:text-rose-900"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    Not sure which practice area fits best? Use our{" "}
                    <a href="/practice-areas" className="text-rose-500 hover:underline">
                      Practice Area
                    </a>{" "}
                    page to help you decide.
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="text-rose-500 hover:text-rose-600 hover:bg-transparent"
              >
                <span className="mr-2">&#60;</span> Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 3 && !!selectedExistingFirm}
                  className="bg-transparent hover:bg-transparent text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <span className="ml-2">&#62;</span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-transparent hover:bg-transparent text-rose-500 hover:text-rose-600 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Nomination"} <span className="ml-2">&#62;</span>
                </Button>
              )}
            </div>
          </form>
            </>
          )}

          {/* Methodology Note - Always Visible */}
          <Card className="bg-muted/50 mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Our Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Comprehensive Review Process:</strong> Every nomination is carefully reviewed by our research team.
                We evaluate firms based on multiple criteria including practice area expertise, professional achievements,
                and reputation within the legal community.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Peer Recognition:</strong> Final recognitions are primarily based on feedback from attorneys already
                included in our publication. We conduct extensive surveys asking lawyers to identify the best practitioners
                in their respective fields. This peer-review approach ensures that our rankings reflect the informed opinions
                of those most qualified to evaluate legal excellence.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Confidentiality:</strong> All nominations are treated as confidential. The information you provide
                will be used solely for research purposes and will not be shared with the nominated firm or any third parties.
                Your identity as a nominator will remain anonymous unless you explicitly request otherwise.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>No Guarantee of Recognition:</strong> Submitting a nomination does not guarantee that a firm will be
                included in our rankings. All firms must meet our rigorous standards and receive sufficient peer support to
                earn recognition.
              </p>
            </CardContent>
          </Card>

          {/* How Nominations Work - Always Visible */}
          <Card className="bg-muted/50 mt-8">
            <CardHeader>
              <CardTitle className="text-lg">How Nominations Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our recognition is based on feedback we receive from lawyers already highlighted in our publication.
                Nominations provide valuable information that aids our research team in identifying lawyers who should be surveyed
                during the peer-review process.
              </p>
              <p className="text-sm text-muted-foreground">
                The nomination process is simple and confidential. Use the form below to provide information about
                a lawyer you believe deserves recognition for their outstanding legal work. All nominations are
                carefully reviewed by our research team as part of our comprehensive evaluation process.
              </p>
              <p className="text-sm text-muted-foreground">
                While nominations are an important part of our research, final recognition is determined through
                a rigorous peer-review methodology that includes extensive lawyer surveys, client interviews, and
                analysis of professional achievements. Submitting a nomination does not guarantee inclusion in our rankings.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>What Happens After You Nominate?</strong>
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                <li>Your nomination is added to our research database</li>
                <li>Our team evaluates the firm against our selection criteria</li>
                <li>Qualified firms may be invited to participate in our comprehensive peer-review process</li>
                <li>Selected firms undergo evaluation by peers in their practice areas</li>
                <li>Final recognitions are based on aggregated peer feedback and objective metrics</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Who Can Nominate?</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Anyone can submit a nomination, including clients who have worked with the firm, fellow attorneys,
                law firm staff, or other professional contacts. We welcome nominations from all perspectives to
                ensure we capture a complete picture of excellence in the legal profession.
              </p>
            </CardContent>
          </Card>

          {/* Additional Information - Always Visible */}
          <Card className="border-primary/20 mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Questions?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have questions about the nomination process or our methodology, please visit our
                <a href="/methodology" className="text-primary hover:underline ml-1">Methodology</a> page
                or <a href="/about" className="text-primary hover:underline ml-1">contact us</a>.
              </p>
              <p className="text-sm text-muted-foreground">
                For information about becoming a recognized law firm, please review our
                <a href="/methodology" className="text-primary hover:underline ml-1">selection criteria</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  )
}
