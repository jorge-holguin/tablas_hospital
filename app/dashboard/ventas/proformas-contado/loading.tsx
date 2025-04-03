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

      <div className="h-10 w-64 bg-muted animate-pulse rounded mb-4"></div>

      <div className="border rounded-md p-6 space-y-4">
        <div className="h-6 w-48 bg-muted animate-pulse rounded mx-auto"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
          ))}
        </div>

        <div className="h-64 bg-muted animate-pulse rounded"></div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  )
}

