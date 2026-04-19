import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PlanningLoading() {
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
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="pb-0">
              <CardContent className="space-y-4 pb-6 pt-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card className="pb-0">
                <CardHeader className="pb-0">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-1 h-5 w-48" />
                </CardHeader>
                <CardContent className="pb-6">
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-1.5 h-4 w-3/4" />
                </CardContent>
              </Card>
              <Card className="pb-0">
                <CardContent className="space-y-3 pb-6 pt-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
              <Card className="pb-0">
                <CardHeader className="pb-0">
                  <Skeleton className="h-3 w-24" />
                </CardHeader>
                <CardContent className="space-y-2 pb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            {[0, 1, 2].map((i) => (
              <Card key={i} className="pb-0">
                <CardContent className="flex items-center justify-between px-4 py-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-7 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
