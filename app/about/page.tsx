import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Shield, Award, Users, Scale, Star, Clock, CheckCircle, Building2 } from "lucide-react"

export const metadata = {
  title: "About Us | Top Law Firms",
  description: "Learn about Top Law Firms - recognizing legal excellence through rigorous peer review and comprehensive evaluation.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 md:py-28">
        <Container>
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-rose-500 font-semibold text-lg mb-4">
              Recognizing Legal Excellence Since 2024
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Identifying the <span className="text-rose-500">Top 1%</span> of Law Firms
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We celebrate law firms that demonstrate exceptional legal expertise, outstanding client service,
              and a proven track record of success in their practice areas.
            </p>
          </div>
        </Container>
      </section>

      {/* Key Information Blocks */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Block 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <Shield className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Excellence</h3>
              <p className="text-gray-600">
                Only firms meeting our rigorous quality standards earn recognition
              </p>
            </div>

            {/* Block 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <Scale className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Process</h3>
              <p className="text-gray-600">
                Comprehensive peer-review methodology ensures fair, unbiased evaluation
              </p>
            </div>

            {/* Block 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <Award className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Elite Recognition</h3>
              <p className="text-gray-600">
                Top-tier firms earn distinction for exceptional legal practice
              </p>
            </div>

            {/* Block 4 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Client Focused</h3>
              <p className="text-gray-600">
                Helping individuals and businesses find the right legal representation
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Methodology Section */}
      <section className="py-20 bg-slate-900 text-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Our Selection Process
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A rigorous 4-step methodology ensures only the most qualified firms earn recognition
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-slate-800 rounded-lg p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3">Nomination</h3>
                  <p className="text-gray-400">
                    Firms are nominated by clients, peers, or through our research team's identification of outstanding legal practices.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-slate-800 rounded-lg p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3">Research & Analysis</h3>
                  <p className="text-gray-400">
                    Our team conducts in-depth analysis of firm credentials, case outcomes, client feedback, and professional standing.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-slate-800 rounded-lg p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3">Peer Review</h3>
                  <p className="text-gray-400">
                    Recognized attorneys evaluate nominees in their practice areas, providing expert assessment of legal capabilities.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="bg-slate-800 rounded-lg p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-3">Recognition</h3>
                  <p className="text-gray-400">
                    Firms meeting our standards receive official recognition and are featured in our directory with detailed profiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              By The Numbers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2">5,000+</div>
                <p className="text-gray-600 font-medium">Firms Evaluated</p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2">100+</div>
                <p className="text-gray-600 font-medium">Practice Areas</p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2">50</div>
                <p className="text-gray-600 font-medium">States Covered</p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl md:text-5xl font-bold text-rose-500 mb-2">Top 1%</div>
                <p className="text-gray-600 font-medium">Earn Recognition</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Our Standards of Excellence
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The criteria that define a Top Law Firm
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Standard 1 */}
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Outstanding Client Reviews</h3>
                  <p className="text-gray-600">
                    Consistent positive feedback from clients demonstrating exceptional service,
                    communication, and successful case outcomes.
                  </p>
                </div>
              </div>

              {/* Standard 2 */}
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Responsive & Accessible</h3>
                  <p className="text-gray-600">
                    Demonstrated commitment to client communication with timely responses
                    and transparent case updates throughout representation.
                  </p>
                </div>
              </div>

              {/* Standard 3 */}
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
                  <p className="text-gray-600">
                    History of successful case resolutions, favorable verdicts, and effective
                    legal strategies that deliver results for clients.
                  </p>
                </div>
              </div>

              {/* Standard 4 */}
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Professional Standing</h3>
                  <p className="text-gray-600">
                    Recognition from peers, bar associations, and legal organizations
                    reflecting expertise and ethical practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-slate-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Legal Representation
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-10">
              Browse our directory of recognized law firms or nominate a firm you believe deserves recognition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/united-states">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-6 text-lg">
                  Browse Firms
                </Button>
              </Link>
              <Link href="/nominate">
                <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-800 px-10 py-6 text-lg">
                  Nominate a Firm
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-800 px-10 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
