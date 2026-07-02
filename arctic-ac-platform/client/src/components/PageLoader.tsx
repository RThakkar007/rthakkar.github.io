import { Skeleton } from "@/components/ui/skeleton";

/** Generic page-level skeleton used as Suspense fallback */
export function PageLoader() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-border bg-card/50 flex items-center px-6 gap-4">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-4 ml-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-16" />)}
        </div>
      </div>
      <div className="container py-10 space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-5 space-y-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-28 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Card-level skeleton for data lists */
export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-4 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}

