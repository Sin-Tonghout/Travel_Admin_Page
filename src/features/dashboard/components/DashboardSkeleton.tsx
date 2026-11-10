import { Skeleton } from "@/components/ui/skeleton/Skeleton";

function CardSkeleton({ rows, className }: { rows: number; className?: string }) {
  return (
    <div className={`space-y-4 rounded-xl border bg-surface p-5 ${className ?? ""}`}>
      <Skeleton className="h-5 w-36" />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading dashboard…</span>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-3 rounded-xl border bg-surface p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-9" />
            </div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="space-y-4 rounded-xl border bg-surface p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <CardSkeleton rows={5} />
        <CardSkeleton rows={5} />
        <CardSkeleton rows={4} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <CardSkeleton rows={5} className="xl:col-span-2" />
        <CardSkeleton rows={5} />
      </div>
    </div>
  );
}