import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-[var(--radius)] border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground hover:border-border/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/16 md:text-sm dark:bg-input/30 dark:hover:bg-input/45 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/24",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
