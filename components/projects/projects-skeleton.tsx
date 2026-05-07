import { Skeleton } from "@/components/ui/skeleton"

export function ProjectsSkeleton() {
  return (
    <div className="relative">
      {/* Linha vertical simulada */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/40 md:-translate-x-1/2" />

      <div className="space-y-32 relative">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="relative">
            {/* Ano Skeleton */}
            <div className="mb-12 flex justify-start md:justify-center">
              <Skeleton className="h-10 w-24 rounded-full bg-primary/10" />
            </div>

            {/* Project Card Skeleton */}
            <div className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="w-full md:w-1/2">
                <Skeleton className="aspect-video w-full rounded-2xl" />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
