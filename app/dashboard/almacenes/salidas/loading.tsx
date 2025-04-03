import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {Array(7)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-9 w-32" />
                ))}
            </div>
            <Skeleton className="h-9 w-64" />
          </div>

          <div className="rounded-md border">
            <div className="p-1">
              <Skeleton className="h-10 w-full mb-2" />
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full mb-2" />
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

