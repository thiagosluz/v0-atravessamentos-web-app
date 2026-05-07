import { BlogSkeleton } from "@/components/blog/blog-skeleton"

export default function BlogLoading() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <header className="mb-16 md:mb-24 text-center">
          <div className="mx-auto h-12 w-48 animate-pulse rounded-md bg-muted mb-4" />
          <div className="mx-auto h-6 w-72 animate-pulse rounded-md bg-muted" />
        </header>
        
        <BlogSkeleton />
      </div>
    </main>
  )
}
