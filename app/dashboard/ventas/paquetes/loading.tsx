export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-72 bg-muted animate-pulse rounded mt-2"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
          <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
          <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-10 w-64 bg-muted animate-pulse rounded"></div>
        <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md">
          <div className="h-10 bg-muted animate-pulse rounded-t-md"></div>
          <div className="p-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </div>

        <div className="border rounded-md">
          <div className="h-10 bg-muted animate-pulse rounded-t-md"></div>
          <div className="p-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

