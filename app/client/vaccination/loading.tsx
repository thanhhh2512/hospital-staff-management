import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phiếu tiêm chủng</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin tiêm chủng của bạn
          </p>
        </div>
        <div>
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
                <Skeleton className="h-4 w-[70%]" />
                <div className="pt-1">
                  <Skeleton className="h-5 w-[150px]" />
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 