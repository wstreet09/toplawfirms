import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Blog | Top Law Firms",
  description: "Insights, news, and analysis from Top Law Firms",
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  })

  // Get the featured post (most recent)
  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Insights & News
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Stay informed with the latest news, analysis, and insights from the legal industry.
          </p>
        </Container>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-gray-50">
          <Container>
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 lg:h-auto bg-slate-200 overflow-hidden">
                  {featuredPost.coverImage ? (
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold px-8 text-center">
                        {featuredPost.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="text-sm text-gray-500 mb-3">
                    {featuredPost.publishedAt && (
                      <span>{new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}</span>
                    )}
                    {featuredPost.author && (
                      <span> • by {featuredPost.author}</span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-rose-500 transition-colors">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="text-gray-600 text-lg line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  <div className="mt-6">
                    <span className="text-rose-500 font-semibold group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12">
        <Container>
          {remainingPosts.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                      <div className="h-48 bg-slate-200 overflow-hidden">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                            <span className="text-white font-bold px-4 text-center">
                              {post.title}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="text-sm text-gray-500 mb-2">
                          {post.publishedAt && (
                            <span>{new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-rose-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="text-rose-500 text-sm font-semibold">
                          Read more →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : !featuredPost ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">No Posts Yet</h2>
              <p className="text-gray-500">
                Check back soon for the latest insights and news.
              </p>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  )
}
