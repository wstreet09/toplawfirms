import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check } from "lucide-react"

export const metadata = {
  title: "Pricing | Top Law Firms",
  description: "Digital marketing solutions for law firms",
  robots: {
    index: false,
    follow: false,
  },
}

const pricingTiers = [
  {
    name: "Visibility",
    description: "Appear in search when clients are looking",
    tagline: "Build trust without added outreach",
    price: "$199",
    features: [
      "Lawyer and firm profiles on Top Law Firms",
      "Award badges and recognition",
      "SEO-enhancing backlinks to your website",
      "Enhanced search visibility",
      "Mobile-optimized profiles",
      "Basic analytics dashboard",
    ],
    cta: "Get Started",
    ctaUrl: undefined,
    highlighted: false,
    icon: "🔍",
  },
  {
    name: "Business Development",
    description: "Content support and reputation strengthening",
    tagline: "Convert visibility into client engagement",
    price: "$499",
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
    cta: "Get Started",
    ctaUrl: undefined,
    highlighted: true,
    icon: "📈",
  },
  {
    name: "Market Leader",
    description: "Strategic research partnerships and competitive advantages",
    tagline: "Lead your market with exclusive insights",
    price: "Contact Us",
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
    cta: "Contact Sales",
    ctaUrl: undefined,
    highlighted: false,
    icon: "🏆",
  },
]

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
        <Container className="py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Boost Your Visibility, Credibility and Digital Marketing Strategy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Enhance your firm's online presence and connect with potential clients
            </p>
          </div>
        </Container>
      </div>

      {/* Pricing Tiers */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={tier.highlighted ? "border-rose-500 border-2 shadow-lg relative" : ""}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-rose-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="text-4xl mb-4">{tier.icon}</div>
                <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                <CardDescription className="text-base mb-2">
                  {tier.description}
                </CardDescription>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.tagline}
                </p>
                <div className="text-3xl font-bold text-foreground">
                  {tier.price}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.ctaUrl ? (
                  <a href={tier.ctaUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button
                      className={
                        tier.highlighted
                          ? "w-full bg-rose-500 hover:bg-rose-600"
                          : "w-full"
                      }
                      size="lg"
                    >
                      {tier.cta}
                    </Button>
                  </a>
                ) : (
                  <Button
                    className={
                      tier.highlighted
                        ? "w-full bg-rose-500 hover:bg-rose-600"
                        : "w-full"
                    }
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-muted-foreground mb-6">
            Contact our team to discuss your firm's specific needs and create a tailored marketing package.
          </p>
          <Button variant="outline" size="lg">
            Schedule a Consultation
          </Button>
        </div>

        {/* Features Overview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Targeted Exposure</h3>
              <p className="text-muted-foreground">
                Reach clients actively searching for legal services in your practice areas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Generation</h3>
              <p className="text-muted-foreground">
                Convert profile visitors into qualified leads with optimized contact tools
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">
                Track your profile performance and measure ROI with detailed insights
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
