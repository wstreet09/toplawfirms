import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EditBlogPostForm from "./edit-blog-post-form"

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await prisma.blogPost.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  return <EditBlogPostForm post={post} />
}
