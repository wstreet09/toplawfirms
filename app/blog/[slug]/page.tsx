import { notFound } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { prisma } from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.metaTitle || `${post.title} | Top Law Firms`,
    description: post.metaDesc || post.excerpt || undefined,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })

  if (!post) {
    notFound()
  }

  // Get related posts (other recent posts)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <div className="max-w-4xl">
            <div className="text-gray-400 mb-4">
              {post.publishedAt && (
                <span>{new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              )}
              {post.author && (
                <span> • by {post.author}</span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-gray-300 mt-6">
                {post.excerpt}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="bg-gray-100">
          <Container>
            <div className="relative -mt-8 mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </Container>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-6
                prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline
                prose-ul:my-4 prose-ol:my-4
                prose-li:text-gray-700
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                prose-img:rounded-lg prose-img:shadow-md
                prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Container>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <Container>
            <h2 className="text-2xl font-bold mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow h-full">
                    <div className="h-40 bg-slate-200 overflow-hidden">
                      {relatedPost.coverImage ? (
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                          <span className="text-white font-bold px-4 text-center text-sm">
                            {relatedPost.title}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-sm text-gray-500 mb-2">
                        {relatedPost.publishedAt && (
                          <span>{new Date(relatedPost.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}</span>
                        )}
                      </div>
                      <h3 className="font-bold group-hover:text-rose-500 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  )
}
