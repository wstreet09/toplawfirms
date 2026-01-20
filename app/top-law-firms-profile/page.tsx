import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Top Law Firms Profile | Activate Your Firm Profile",
  description: "Discover the value of a Top Law Firms profile. Elevate your stature and broaden your reach by securing an enhanced profile.",
}

export default function TopLawFirmsProfilePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Device mockup placeholder */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                {/* Placeholder for device mockup - you can replace with actual images */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg shadow-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">📱 💻</div>
                    <p className="text-sm">Profile Preview</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Hero text */}
            <div className="order-1 lg:order-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover the Value of a <span className="text-rose-500">Top Law Firms</span> Profile
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8">
                Are you a law firm recognized in the Top Law Firms{" "}
                <Link href="/united-states" className="text-amber-600 hover:underline">
                  rankings
                </Link>
                ? Elevate your stature and broaden your reach by securing a profile on TopLawFirms.com.
              </p>
              <Link href="/nominate">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
                  CONNECT WITH US TODAY
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose Top Law Firms?
          </h2>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">
              Comprehensive Research and Data Collection
            </h3>

            {/* Icon placeholder */}
            <div className="flex justify-center mb-12">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <div className="text-6xl">🔍⭐</div>
              </div>
            </div>

            {/* Data collection points */}
            <div className="space-y-6 text-xl">
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">-</span>
                <p className="font-semibold">Client and lawyer evaluations</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">-</span>
                <p className="font-semibold">Feedback from managing partners and practice area leaders</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">-</span>
                <p className="font-semibold">In depth data collection through our proprietary law firm survey</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center max-w-4xl mx-auto">
            <p className="text-lg">
              Participating firms can{" "}
              <Link href="/nominate" className="text-amber-600 hover:underline font-semibold">
                request a Client Insights Report
              </Link>{" "}
              to better understand client feedback and opportunities for improvement.
            </p>
          </div>
        </Container>
      </section>

      {/* Enhanced Profile Benefits */}
      <section className="py-20 bg-slate-900 text-white">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            An enhanced profile allows your firm to demonstrate its expertise through:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-4xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Detailed Practice Area Listings
              </h3>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Recognition of Achievements
              </h3>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Client Testimonials
              </h3>
            </div>

            {/* Benefit 4 */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-4xl">📄</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Case Studies
              </h3>
            </div>
          </div>
        </Container>
      </section>

      {/* Profile Tiers Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-xl leading-relaxed mb-8">
                Every recognized law firm receives a complimentary profile on TopLawFirms.com, but not all profiles appear the same in search results.
              </p>
              <p className="text-xl leading-relaxed mb-8">
                To help decision-ready individuals find the right representation, we offer search tiers that highlight more of your strengths directly in search results. Firms in the highest tier receive top placement in search results and display more content directly in the preview, such as:
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 mb-12">
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold text-xl">•</span>
                  <span>Firm name and logo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold text-xl">•</span>
                  <span>Website link and "View Profile" button</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold text-xl">•</span>
                  <span>Firm overview preview</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold text-xl">•</span>
                  <span>Headquarters location</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold text-xl">•</span>
                  <span>Award count</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800 text-white rounded-lg p-8 text-center">
              <p className="text-xl mb-4">
                When your profile presents more detail earlier in the search experience, your firm is more likely to stand out, earn trust and encourage action.
              </p>
              <p className="text-2xl font-bold text-amber-500">
                Position your firm for greater visibility and impact.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Tier Comparison Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Premium Tier */}
            <div className="border-4 border-amber-500 rounded-lg overflow-hidden">
              <div className="bg-amber-500 text-white py-3 px-6">
                <h3 className="text-xl font-bold">PREMIUM</h3>
              </div>
              <div className="p-8 bg-gray-50">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="mb-6">
                      <h4 className="text-2xl font-bold mb-2">Naifeh, Smith & Greer LLP</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          Client Endorsed
                        </span>
                        <span>📍 New York, NY</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-6">
                      <p className="flex items-center gap-2">
                        <span className="font-bold">⭐</span> # Law Firm of the Year Awards
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-bold">🏆</span> # National Awards
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-bold">🏆</span> # Regional Awards
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      The workplace is evolving and so are the challenges that come with it. Traditional, one-size-fits-all approach to workforce management...
                    </p>
                    <Link href="#" className="text-amber-600 hover:underline text-sm font-semibold">
                      Read more about this law firm →
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" className="whitespace-nowrap">
                      VIEW PROFILE
                    </Button>
                    <Button className="bg-slate-800 hover:bg-slate-900 whitespace-nowrap">
                      VISIT WEBSITE ↗
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-white px-8 py-4 text-center border-t">
                <p className="font-semibold text-slate-700">
                  Included in Business Development and Market Leader Tier.
                </p>
              </div>
            </div>

            {/* Standard Tier */}
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <div className="p-6 bg-gray-50">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="mb-4">
                      <h4 className="text-xl font-bold mb-1">Naifeh, Smith & Greer LLP</h4>
                      <p className="text-sm text-gray-600">United States 2025</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="font-bold">⭐</span> # Law Firm of the Year Awards
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-bold">🏆</span> # National Awards
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-bold">🏆</span> # Regional Awards
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
                      VIEW PROFILE
                    </Button>
                    <Button size="sm" className="bg-slate-800 hover:bg-slate-900 whitespace-nowrap text-xs">
                      VISIT WEBSITE ↗
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-white px-6 py-3 text-center border-t">
                <p className="text-sm font-semibold text-slate-600">
                  Included in Legacy Profile Suite and Visibility Tier.
                </p>
              </div>
            </div>

            {/* Basic Tier */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 bg-white">
                <div className="mb-3">
                  <h4 className="text-lg font-bold mb-1">Naifeh, Smith & Greer LLP</h4>
                  <p className="text-xs text-gray-600">United States 2025</p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="font-bold">⭐</span> # Law Firm of the Year Awards
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-bold">🏆</span> # National Awards
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-bold">🏆</span> # Regional Awards
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-2 text-center border-t">
                <p className="text-xs font-semibold text-slate-600">
                  Passive listing. Available to all recognized law firms.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Join Community Section */}
      <section className="py-20 bg-slate-800 text-white relative overflow-hidden">
        {/* Background image overlay - you can add actual image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90"></div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Join Our Community
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed">
              By joining TopLawFirms.com, you become part of a community of the most exceptional law firms. Collaborate, share insights and stay updated with industry trends through our platform.
            </p>
          </div>
        </Container>
      </section>

      {/* Ready to Elevate Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Elevate Your Firm?
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed">
              Start leveraging the benefits of a profile on TopLawFirms.com today. Contact us to learn more about how we can help you expand your firm's reach and attract more clients.
            </p>
            <Link href="/nominate">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-6 text-xl">
                CONNECT WITH US TODAY
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Device mockup */}
              <div className="order-2 lg:order-1">
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg shadow-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">📱 💻</div>
                    <p className="text-sm">Profile Examples</p>
                  </div>
                </div>
              </div>

              {/* Right side - Contact form */}
              <div className="order-1 lg:order-2 bg-slate-900 text-white p-12 rounded-lg">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="firstName" className="block text-lg font-semibold mb-2">
                      First name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 bg-transparent border-b-2 border-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-lg font-semibold mb-2">
                      Last name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 bg-transparent border-b-2 border-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="firmName" className="block text-lg font-semibold mb-2">
                      Firm name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firmName"
                      name="firmName"
                      className="w-full px-4 py-3 bg-transparent border-b-2 border-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-lg font-semibold mb-2">
                      Country/Region<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="w-full px-4 py-3 bg-transparent border-b-2 border-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <p className="text-lg font-semibold mb-4">Please check the box if applicable:</p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasRecognition"
                        className="mt-1 w-5 h-5 rounded border-white"
                      />
                      <span>
                        My firm has a current Best Lawyers or Best Law Firms recognition.
                      </span>
                    </label>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 text-lg font-bold"
                    >
                      SUBMIT
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
