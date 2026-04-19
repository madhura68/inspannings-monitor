"use client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function CheckInError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Er is iets misgegaan</AlertTitle>
          <AlertDescription>
            De check-in pagina kon niet worden geladen. Probeer het opnieuw of
            kom later terug.
          </AlertDescription>
        </Alert>
        <Button onClick={reset} variant="outline" className="w-full">
          Opnieuw proberen
        </Button>
      </div>
    </main>
  );
}
