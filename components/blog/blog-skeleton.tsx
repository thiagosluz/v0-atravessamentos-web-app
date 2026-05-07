import { Skeleton } from "@/components/ui/skeleton"

export function BlogSkeleton() {
  return (
    <div className="relative">
      {/* Linha do tempo vertical simulada */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40" />

      <div className="space-y-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="group relative pl-8 py-10 border-b border-border/50 last:border-0">
            {/* Ponto na linha */}
            <div className="absolute left-0 top-[2.6rem] h-2.5 w-2.5 rounded-full border-2 border-muted bg-background -translate-x-[4.5px]" />
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="hidden md:block h-48 w-48 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
