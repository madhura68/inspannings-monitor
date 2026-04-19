"use client";

import { useActionState } from "react";
import { updateActivityStatusAction } from "@/app/planning/actions";
import { Button } from "@/components/ui/button";
import type { ActivityStatus } from "@/lib/planning/types";
import { cn } from "@/lib/utils";

type ActivityStatusActionsProps = {
  activityId: string;
  status: ActivityStatus;
};

const statusOptions: Array<{
  value: ActivityStatus;
  label: string;
}> = [
  { value: "planned", label: "Gepland" },
  { value: "completed", label: "Uitgevoerd" },
  { value: "skipped", label: "Geschipt" },
  { value: "adjusted", label: "Aangepast" },
];

export function ActivityStatusActions({
  activityId,
  status,
}: ActivityStatusActionsProps) {
  const [, formAction, isPending] = useActionState(updateActivityStatusAction, null);

  return (
    <form action={formAction} className="space-y-3" aria-busy={isPending}>
      <input type="hidden" name="activityId" value={activityId} />
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Status van deze activiteit wijzigen"
      >
        {statusOptions.map((option) => {
          const isCurrent = option.value === status;

          return (
            <Button
              key={option.value}
              type="submit"
              name="status"
              value={option.value}
              size="sm"
              variant={isCurrent ? "default" : "outline"}
              disabled={isPending}
              aria-pressed={isCurrent}
              className={cn(
                "rounded-full px-3",
                isPending && "pointer-events-none opacity-70",
              )}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
      <p className="text-xs leading-6 text-muted-foreground" aria-live="polite">
        {isPending
          ? "Status wordt opgeslagen..."
          : "Je kunt de status vandaag direct aanpassen zonder de activiteit te verwijderen."}
      </p>
    </form>
  );
}
