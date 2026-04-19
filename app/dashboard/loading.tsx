import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <main className="app-page">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/50">
          <Skeleton className="h-5 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="pb-0">
                <CardHeader className="pb-0">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="mt-1 h-5 w-40" />
                </CardHeader>
                <CardContent className="pb-6">
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-1.5 h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
