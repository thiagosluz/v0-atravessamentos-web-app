import { ProjectsSkeleton } from "@/components/projects/projects-skeleton"

export default function ProjectsLoading() {
  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <header className="max-w-3xl mb-16 space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-16 w-3/4 animate-pulse rounded-md bg-muted" />
          <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
        </header>

        <div className="mb-16 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
        
        <ProjectsSkeleton />
      </div>
    </main>
  )
}
