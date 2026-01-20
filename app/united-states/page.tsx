import Link from "next/link"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Law Firms in the United States | Top Law Firms",
  description: "Browse top-ranked law firms across all 50 states and DC. Find the best legal representation by state, metro area, or practice area.",
}


export default async function UnitedStatesPage() {
  // Fetch states with firm counts
  const states = await prisma.state.findMany({
    include: {
      _count: {
        select: { offices: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  // Fetch practice areas with firm counts
  const practiceAreas = await prisma.practiceArea.findMany({
    include: {
      _count: {
        select: { firms: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  // Get total stats
  const totalFirms = await prisma.firm.count()
  const totalLawyers = await prisma.lawyer.count()
  const totalOffices = await prisma.office.count()

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
        <Container className="py-12">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'United States' },
            ]}
          />

          <div className="mt-8 mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Top Law Firms in the United States
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl leading-relaxed">
              Welcome to Top Law Firms. Top Law Firms continues to recognize firms for their standout legal performance and prowess in specific metro regions and practice areas, highlighting their unwavering commitment to legal excellence.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{totalFirms}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Law Firms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{totalLawyers}+</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Recognized Lawyers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{totalOffices}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Office Locations</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-20">
        {/* 1. Practice Areas Mega List */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Practice Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2 max-w-5xl mx-auto px-8">
            {practiceAreas.map((pa) => (
              <Link
                key={pa.id}
                href={`/united-states/practice-areas/${pa.slug}`}
                className="text-sm hover:text-primary transition-colors block"
              >
                {pa.name}
              </Link>
            ))}
          </div>
        </section>

        {/* 2. States Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">States</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 max-w-5xl mx-auto px-8">
            {states.map((state) => (
              <Link
                key={state.id}
                href={`/united-states/${state.slug}`}
                className="text-sm hover:text-primary transition-colors"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </section>

        {/* 3. About the 2026 edition + CTA/Report Card */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">About the 2026 Edition</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                The 2026 edition of Top Law Firms represents our most comprehensive analysis yet, 
                evaluating thousands of law firms across the United States. Our rigorous methodology 
                combines peer recognition, client feedback, and objective performance metrics to 
                identify the nation's leading legal practices.
              </p>
              <p>
                This year's rankings reflect significant shifts in the legal landscape, with emerging 
                practice areas gaining prominence and established firms continuing to demonstrate 
                excellence across traditional disciplines. We've expanded our coverage to include 
                more specialized practice areas and regional markets.
              </p>
              <p>
                Our team of legal researchers and analysts spent over 12 months compiling data from 
                thousands of sources, including court filings, deal databases, client interviews, 
                and peer surveys to ensure the most accurate and up-to-date rankings.
              </p>
            </div>
          </div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>2026 Report Card</CardTitle>
              <CardDescription>Key insights from this year's analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Firms Analyzed</span>
                  <span className="font-semibold">{totalFirms.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Practice Areas</span>
                  <span className="font-semibold">{practiceAreas.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">States Covered</span>
                  <span className="font-semibold">{states.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Sources</span>
                  <span className="font-semibold">500+</span>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Download Full Report
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 4. Legal News */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Legal News & Updates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted" />
              <CardHeader>
                <CardTitle className="text-lg">Supreme Court Ruling Impacts Corporate Law</CardTitle>
                <CardDescription>Recent decisions reshape M&A landscape</CardDescription>
              </CardHeader>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted" />
              <CardHeader>
                <CardTitle className="text-lg">New Regulations in Healthcare Law</CardTitle>
                <CardDescription>Firms adapt to changing compliance requirements</CardDescription>
              </CardHeader>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted" />
              <CardHeader>
                <CardTitle className="text-lg">Tech Sector Legal Trends 2026</CardTitle>
                <CardDescription>IP and data privacy take center stage</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* 5. Insights Section */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Insights</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                The legal industry continues to evolve at a rapid pace, driven by technological 
                innovation, regulatory changes, and shifting client expectations. Our analysis 
                reveals several key trends shaping the landscape of top-tier legal practice.
              </p>
              <p>
                <strong className="text-foreground">Technology Integration:</strong> Leading firms 
                are increasingly investing in legal technology, from AI-powered document review 
                to advanced case management systems. This technological sophistication is becoming 
                a key differentiator in client selection.
              </p>
              <p>
                <strong className="text-foreground">Specialization Deepens:</strong> While full-service 
                firms remain dominant, we're seeing increased specialization within practice areas. 
                Firms are developing sub-specialties in areas like cryptocurrency regulation, 
                climate change litigation, and data privacy compliance.
              </p>
              <p>
                <strong className="text-foreground">Regional Expansion:</strong> Many top-tier firms 
                are expanding their geographic footprint, opening offices in emerging legal markets 
                and strengthening their presence in secondary cities. This expansion reflects both 
                client demand and strategic positioning.
              </p>
              <p>
                <strong className="text-foreground">Diversity & Inclusion:</strong> The industry 
                continues to make progress on diversity metrics, with notable improvements in 
                partner-level representation. However, significant work remains to achieve true 
                equity across all levels of practice.
              </p>
            </div>
          </div>
          <Card className="h-fit">
            <div className="aspect-[4/3] bg-muted rounded-t-lg" />
            <CardHeader>
              <CardTitle>Industry Report 2026</CardTitle>
              <CardDescription>
                Comprehensive analysis of legal market trends, firm performance, and emerging 
                practice areas. Download our full report for detailed insights and data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Full Report
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 6. Research Methodology */}
        <section className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Research Methodology</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Collection</h3>
              <p>
                Our research team employs a multi-faceted approach to data collection, drawing from 
                a wide range of sources including public records, court filings, deal databases, 
                client interviews, and peer surveys. We analyze thousands of data points for each 
                firm, ensuring a comprehensive and accurate assessment.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Evaluation Criteria</h3>
              <p>
                Firms are evaluated across multiple dimensions: peer recognition (40%), client 
                feedback (30%), deal volume and complexity (20%), and objective performance 
                metrics (10%). Each practice area is assessed independently, allowing firms to 
                excel in their areas of specialization.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Peer Recognition</h3>
              <p>
                We conduct extensive surveys of legal professionals, asking them to identify the 
                leading firms in their practice areas. These peer evaluations are weighted by the 
                respondent's experience and expertise, ensuring that the most knowledgeable voices 
                carry appropriate influence.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Client Feedback</h3>
              <p>
                Client interviews and feedback forms provide crucial insights into firm performance 
                from the perspective of those who have direct experience working with these firms. 
                We collect feedback on factors including responsiveness, expertise, value, and 
                overall satisfaction.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Objective Metrics</h3>
              <p>
                We analyze publicly available data including deal values, case outcomes, firm size, 
                lawyer recognition, and other quantifiable metrics. This objective data provides 
                a foundation for our rankings and helps validate subjective assessments.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality Assurance</h3>
              <p>
                All data undergoes rigorous quality assurance checks, with multiple researchers 
                reviewing each firm's profile. We maintain strict standards for data accuracy and 
                regularly update our information to reflect the most current state of the legal 
                market. Our methodology is reviewed and refined annually to ensure it remains 
                relevant and comprehensive.
              </p>
            </div>
          </div>
        </section>
      </div>
      </Container>
    </>
  )
}
