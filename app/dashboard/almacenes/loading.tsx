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
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="h-6 w-36 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

