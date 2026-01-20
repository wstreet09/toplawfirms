import { Suspense } from "react"
import { Container } from "@/components/layout/container"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function SuccessContent({ searchParams }: { searchParams: { id?: string } }) {
  const nominationId = searchParams.id

  if (!nominationId) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No nomination ID provided. Please try submitting your nomination again.</p>
          <Link href="/nominate">
            <Button className="mt-4 bg-rose-500 hover:bg-rose-600">
              Return to Nomination Form
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const nomination = await prisma.nomination.findUnique({
    where: { id: nominationId },
  })

  if (!nomination) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nomination not found. Please try submitting your nomination again.</p>
          <Link href="/nominate">
            <Button className="mt-4 bg-rose-500 hover:bg-rose-600">
              Return to Nomination Form
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const practiceAreas = JSON.parse(nomination.practiceAreas || "[]")

  return (
    <>
      {/* Success Message */}
      <Card className="border-green-500 bg-green-50 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-green-700 flex items-center gap-3">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Nomination Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          <p className="text-lg">
            Thank you for submitting your nomination. Our research team will review it carefully as part of our
            comprehensive evaluation process.
          </p>
          <p className="mt-4">
            <strong>Submission ID:</strong> {nomination.id}
          </p>
          <p className="text-sm mt-2">
            You will receive a confirmation email at <strong>{nomination.nominatorEmail}</strong> shortly.
          </p>
        </CardContent>
      </Card>

      {/* Nomination Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Nomination Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nominator Information */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-rose-500">Your Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {nomination.nominatorName}
              </p>
              <p>
                <strong>Email:</strong> {nomination.nominatorEmail}
              </p>
              {nomination.nominatorPhone && (
                <p>
                  <strong>Phone:</strong> {nomination.nominatorPhone}
                </p>
              )}
            </div>
          </div>

          {/* Firm Information */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-rose-500">Law Firm Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Firm Name:</strong> {nomination.firmName}
              </p>
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
              {nomination.firmDescription && (
                <p>
                  <strong>Description:</strong> {nomination.firmDescription}
                </p>
              )}
            </div>
          </div>

          {/* Practice Areas */}
          {practiceAreas.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3 text-rose-500">Practice Areas</h3>
              <div className="flex flex-wrap gap-2">
                {practiceAreas.map((area: string) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {nomination.notes && (
            <div>
              <h3 className="text-xl font-bold mb-3 text-rose-500">Additional Notes</h3>
              <p className="text-sm">{nomination.notes}</p>
            </div>
          )}

          {/* Submission Date */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Submitted on {new Date(nomination.createdAt).toLocaleDateString()} at{" "}
              {new Date(nomination.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            <li>Your nomination has been added to our research database</li>
            <li>Our team will evaluate the firm against our selection criteria</li>
            <li>Qualified firms may be invited to participate in our comprehensive peer-review process</li>
            <li>Selected firms undergo evaluation by peers in their practice areas</li>
            <li>Final recognitions are based on aggregated peer feedback and objective metrics</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Note:</strong> Submitting a nomination does not guarantee that a firm will be included in our
            rankings. All firms must meet our rigorous standards and receive sufficient peer support to earn
            recognition.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Link href="/nominate">
          <Button variant="outline" size="lg">
            Submit Another Nomination
          </Button>
        </Link>
        <Link href="/">
          <Button className="bg-rose-500 hover:bg-rose-600" size="lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </>
  )
}

export default async function NominationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
        <Container className="py-12">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Nominate", href: "/nominate" },
              { label: "Success" },
            ]}
          />

          <div className="mt-8 mb-4 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <span className="text-rose-500">Thank You</span> for Your Nomination
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Your submission has been received and will be carefully reviewed by our research team.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent searchParams={params} />
          </Suspense>
        </div>
      </Container>
    </>
  )
}
