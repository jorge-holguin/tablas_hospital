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

      <div className="h-10 w-full bg-muted animate-pulse rounded mb-4"></div>

      <div className="h-10 w-64 bg-muted animate-pulse rounded mb-4"></div>

      <div className="flex items-center py-4 justify-between">
        <div className="h-10 w-64 bg-muted animate-pulse rounded"></div>
        <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="border rounded-md p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-17 gap-4">
            {[...Array(17)].map((_, i) => (
              <div key={i} className="h-6 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-17 gap-4">
              {[...Array(17)].map((_, j) => (
                <div key={j} className="h-6 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

