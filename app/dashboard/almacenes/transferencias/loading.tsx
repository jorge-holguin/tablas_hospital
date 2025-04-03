import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <Tabs defaultValue="transferencias" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transferencias">Transferencias</TabsTrigger>
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
        </TabsList>

        <TabsContent value="transferencias">
          <Card>
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
        </TabsContent>

        <TabsContent value="detalles">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border">
                <div className="p-1">
                  <Skeleton className="h-10 w-full mb-2" />
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full mb-2" />
                    ))}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Skeleton className="h-9 w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

