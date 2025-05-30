import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  columns: number
  rows: number
  hasActions?: boolean
}

export function TableSkeleton({ columns, rows, hasActions = true }: TableSkeletonProps) {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
      </div>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="h-12 px-4 text-left align-middle font-medium">
                  <Skeleton className="h-4 w-full max-w-[100px]" />
                </th>
              ))}
              {hasActions && (
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <Skeleton className="h-4 w-full max-w-[80px]" />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="p-4 align-middle">
                    <Skeleton className="h-5 w-full max-w-[120px]" />
                  </td>
                ))}
                {hasActions && (
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-8 w-[150px]" />
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
} 