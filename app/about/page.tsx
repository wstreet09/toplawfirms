import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About Us | Top Law Firms",
  description: "Learn more about Top Law Firms directory and our methodology.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 md:py-32">
        <Container>
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-rose-500">Top Law Firms</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Your trusted source for finding top-ranked legal representation across the United States
            </p>
          </div>
        </Container>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Our Mission
            </h2>
            <p className="text-xl leading-relaxed text-gray-700 text-center">
              Top Law Firms is dedicated to helping individuals and businesses find the best legal
              representation across the United States. We provide comprehensive rankings and
              information about law firms, making it easier for you to connect with the right
              legal expertise for your needs.
            </p>
          </div>
        </Container>
      </section>

      {/* Methodology Section */}
      <section className="py-20 bg-slate-900 text-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              Our Methodology
            </h2>

            <div className="mb-12">
              <p className="text-xl leading-relaxed text-center mb-12">
                Our rankings are based on a rigorous evaluation process that includes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Evaluation Point 1 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Client Feedback
                </h3>
                <p className="text-gray-300">
                  Comprehensive testimonials and client satisfaction ratings
                </p>
              </div>

              {/* Evaluation Point 2 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-4xl">👥</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Peer Reviews
                </h3>
                <p className="text-gray-300">
                  Evaluations from respected legal professionals
                </p>
              </div>

              {/* Evaluation Point 3 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Firm Data
                </h3>
                <p className="text-gray-300">
                  Detailed practice areas and capabilities
                </p>
              </div>

              {/* Evaluation Point 4 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Track Record
                </h3>
                <p className="text-gray-300">
                  Successful outcomes and case history
                </p>
              </div>

              {/* Evaluation Point 5 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-4xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Recognition
                </h3>
                <p className="text-gray-300">
                  Awards and standing in the legal community
                </p>
              </div>

              {/* Evaluation Point 6 */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Research
                </h3>
                <p className="text-gray-300">
                  In-depth analysis and verification
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Coverage Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              Our Coverage
            </h2>

            <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="aspect-square bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg shadow-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-7xl mb-4">🗺️</div>
                      <p className="text-2xl font-bold">50 States</p>
                      <p className="text-lg">Nationwide Coverage</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Comprehensive National Directory
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    We feature law firms across all 50 United States, covering major
                    metropolitan areas and specialized practice areas.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold text-xl">•</span>
                      <span className="text-gray-700">Corporate Law</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold text-xl">•</span>
                      <span className="text-gray-700">Litigation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold text-xl">•</span>
                      <span className="text-gray-700">Intellectual Property</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold text-xl">•</span>
                      <span className="text-gray-700">Real Estate</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold text-xl">•</span>
                      <span className="text-gray-700">And Many More</span>
                    </div>
                  </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Find Your Legal Representation
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-12">
              Start your search for top-ranked law firms across the United States
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/united-states">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-6 text-lg">
                  BROWSE FIRMS
                </Button>
              </Link>
              <Link href="/nominate">
                <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-800 px-12 py-6 text-lg">
                  NOMINATE A FIRM
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
