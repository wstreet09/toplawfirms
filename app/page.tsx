import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function Home() {
  // Fetch featured firms (top tier 1 firms)
  const featuredFirms = await prisma.firm.findMany({
    where: { tierLevel: 1 },
    take: 4,
    orderBy: { name: 'asc' },
    include: {
      offices: {
        include: { state: true },
        take: 1,
        where: { isPrimary: true },
      },
    },
  })

  // Fetch all states
  const states = await prisma.state.findMany({
    orderBy: { name: 'asc' },
  })

  // Fetch all practice areas
  const practiceAreas = await prisma.practiceArea.findMany({
    orderBy: { name: 'asc' },
  })

  // Get total stats
  const totalFirms = await prisma.firm.count()
  const totalLawyers = await prisma.lawyer.count()

  // Fetch featured blog posts (latest 3 published posts)
  const featuredArticles = await prisma.blogPost.findMany({
    where: { published: true },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  // Fetch the latest news post (most recent published post)
  const latestNewsPost = await prisma.blogPost.findFirst({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gray-100 py-16 md:py-24 relative overflow-hidden">
        <Container>
          <div className="flex items-center justify-center gap-16 md:gap-24 lg:gap-32 px-8 md:px-16 lg:px-24">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Recognizing <span className="text-rose-500">Legal Excellence</span>.
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-lg">
                Top Law Firms honors exceptional lawyers and firms who demonstrate superior skill, integrity, and measurable impact in the legal profession.
              </p>
            </div>
            <div className="hidden lg:flex items-center">
              <img
                src="/images/TFL-Winner-Badge.png"
                alt="Top Law Firms Rankings Badge"
                className="w-52 h-auto"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Explore Rankings Section */}
      <section className="bg-slate-800 text-white py-20">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Top Law Firms
              </h2>
              <div className="h-1 w-32 bg-white"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Search Form */}
              <div className="bg-white text-gray-900 p-8 rounded-lg">
                <p className="text-xl italic mb-8">
                  Find the top law firm for your matter by searching location and practice area.
                </p>

                <form action="/search" method="get" className="space-y-6">
                  <div>
                    <Select name="country">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="United States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="united-states">United States</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select name="state">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="State / Province" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.slug}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select name="practiceArea">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Practice Area" />
                      </SelectTrigger>
                      <SelectContent>
                        {practiceAreas.slice(0, 20).map((pa) => (
                          <SelectItem key={pa.id} value={pa.slug}>
                            {pa.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <p className="text-center text-gray-600 italic mb-4">OR</p>
                    <input
                      type="text"
                      name="q"
                      placeholder="Search by Firm Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
                    >
                      SEARCH
                    </Button>
                    <Link
                      href="/united-states"
                      className="text-amber-700 hover:underline flex items-center gap-2"
                    >
                      Browse all law firms <span>→</span>
                    </Link>
                  </div>
                </form>
              </div>

              {/* 2026 Legal Market Analysis */}
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold mb-6">2026 Legal Market Analysis</h3>
                <p className="text-xl mb-8 text-gray-300">
                  Review the data, trends and insights collected in our annual global research.
                </p>
                <div className="flex-1 flex items-end">
                  <Link href="/legal-market-analysis" className="group block max-w-xs">
                    <div className="bg-slate-700 rounded-lg overflow-hidden relative">
                      <img
                        src="/images/2026-legal-market-analysis.png"
                        alt="2026 Legal Market Analysis"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest News Section */}
      <section className="bg-slate-900 text-white py-20">
        <Container>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Latest News</h2>
            <Link href="/blog" className="text-amber-600 hover:underline flex items-center gap-2">
              Read more insights <span>→</span>
            </Link>
          </div>

          {latestNewsPost ? (
            <Link href={`/blog/${latestNewsPost.slug}`} className="block group">
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="h-80 bg-slate-700 overflow-hidden">
                  {latestNewsPost.coverImage ? (
                    <img
                      src={latestNewsPost.coverImage}
                      alt={latestNewsPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
                      <p className="text-white text-4xl font-bold px-8 text-center">{latestNewsPost.title}</p>
                    </div>
                  )}
                </div>
                <div className="p-12 text-center">
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 group-hover:text-amber-500 transition-colors">
                    {latestNewsPost.title}
                  </h3>
                  <p className="text-lg text-gray-400 mb-4">
                    by {latestNewsPost.author}
                    {latestNewsPost.publishedAt && (
                      <span> • {new Date(latestNewsPost.publishedAt).toLocaleDateString()}</span>
                    )}
                  </p>
                  {latestNewsPost.excerpt && (
                    <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                      {latestNewsPost.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="h-80 bg-slate-700 flex items-center justify-center">
                <p className="text-gray-500">Featured Image</p>
              </div>
              <div className="p-12 text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Excellence in Practice: The 2026 edition of Top Law Firms®
                </h3>
                <p className="text-lg text-gray-400 mb-4">by Editorial Team</p>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Reflecting the firms that set the standard in legal skill and service in the United States.
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* About Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                About Top Law Firms
              </h2>
              <div className="h-1 w-32 bg-gray-300 mb-8"></div>
              <div className="prose prose-lg">
                <p className="text-xl text-gray-700 mb-6">
                  Since 2010, Top Law Firms® has served as a definitive law firm guide and trusted resource for those seeking authoritative legal insight. Through a rigorous, data-driven approach, Top Law Firms identifies firms known for quality, specialized knowledge and commitment to excellence.
                </p>
                <p className="text-xl text-gray-700">
                  Our tiered ranking system—national and regional—highlights distinguished practices across diverse legal fields, helping businesses and individuals alike make informed decisions with confidence.
                </p>
              </div>
            </div>

            {/* Featured Firms */}
            <div>
              <h3 className="text-3xl font-bold mb-8">Featured Firms</h3>
              <div className="space-y-6">
                {featuredFirms.map((firm) => (
                  <Link
                    key={firm.id}
                    href={`/firms/${firm.slug}/overview`}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          {firm.logoUrl ? (
                            <img
                              src={firm.logoUrl}
                              alt={firm.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground font-semibold">
                              LOGO
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl text-rose-500">
                          {firm.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/united-states"
                  className="text-amber-700 hover:underline flex items-center gap-2 text-lg"
                >
                  Search all law firms <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Featured Articles</h2>
            <Link href="/insights" className="text-amber-700 hover:underline flex items-center gap-2">
              Read more insights <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.length > 0 ? (
              featuredArticles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    {article.coverImage ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
                        <p className="text-white text-2xl font-bold px-6 text-center">
                          {article.title}
                        </p>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="text-sm text-gray-500">
                        {article.publishedAt && (
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        )}
                        {article.author && (
                          <span> • by {article.author}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No featured articles available yet.</p>
                <p className="text-gray-400 mt-2">Check back soon for the latest insights.</p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  )
}
