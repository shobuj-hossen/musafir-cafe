import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeaderSkeleton() {
  return (
    <header className="flex h-18 items-center justify-between p-2">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-8" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-9" />
        <div className="hidden space-y-1.5 sm:block">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </header>
  )
}
