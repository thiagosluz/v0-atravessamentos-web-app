import { OverviewSkeleton } from "@/components/admin/shared/overview-skeleton"

export default function AdminLoading() {
  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
        {/* Simula o cabeçalho do admin que já existe no layout */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        
        <OverviewSkeleton />
      </div>
    </div>
  )
}
