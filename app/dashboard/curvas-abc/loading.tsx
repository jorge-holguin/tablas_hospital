export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-72 bg-muted animate-pulse rounded mt-2"></div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-3">
            <div className="h-6 w-36 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
        <div className="h-10 w-48 bg-muted animate-pulse rounded"></div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-72 bg-muted animate-pulse rounded"></div>

        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-6 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="h-6 w-36 bg-muted animate-pulse rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-5 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-5/6 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

