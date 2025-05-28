import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="h-10 w-[250px] mb-6" />
      
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
      
      <div className="border rounded-md">
        <div className="p-4">
          <div className="grid grid-cols-7 gap-4 mb-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          
          {Array(5).fill(null).map((_, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 mb-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </div>
  )
}
