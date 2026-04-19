"use client";

import { useActionState, useState } from "react";
import { saveActivityEvaluationAction } from "@/app/planning/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActivityStatus, SkipReason } from "@/lib/planning/types";

type ActivityEvaluationFieldsProps = {
  activityId: string;
  status: ActivityStatus;
  skipReasons: SkipReason[];
  initialSkipReasonId: string | null;
  initialNotes: string | null;
};

export function ActivityEvaluationFields({
  activityId,
  status,
  skipReasons,
  initialSkipReasonId,
  initialNotes,
}: ActivityEvaluationFieldsProps) {
  const [, formAction, isPending] = useActionState(saveActivityEvaluationAction, null);
  const [skipReasonId, setSkipReasonId] = useState(
    initialSkipReasonId ?? skipReasons[0]?.id ?? "",
  );
  const [notes, setNotes] = useState(initialNotes ?? "");

  if (status !== "skipped" && status !== "adjusted") {
    return null;
  }

  return (
    <form action={formAction} className="space-y-4" aria-busy={isPending}>
      <input type="hidden" name="activityId" value={activityId} />
      {status === "skipped" ? (
        <>
          <input type="hidden" name="skipReasonId" value={skipReasonId} />
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Waarom is deze activiteit overgeslagen?
            </Label>
            <Select
              disabled={isPending}
              value={skipReasonId}
              onValueChange={(value) => setSkipReasonId(value ?? skipReasons[0]?.id ?? "")}
            >
              <SelectTrigger className="h-11 w-full rounded-[1.15rem] bg-background/80 px-4 text-sm">
                <SelectValue placeholder="Kies een skip-reden" />
              </SelectTrigger>
              <SelectContent>
                {skipReasons.map((skipReason) => (
                  <SelectItem key={skipReason.id} value={skipReason.id}>
                    {skipReason.labelNl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activity-notes-${activityId}`} className="text-sm font-semibold text-foreground">
              Extra toelichting
            </Label>
            <textarea
              id={`activity-notes-${activityId}`}
              name="notes"
              className="min-h-24 w-full rounded-[1.15rem] border border-input bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              disabled={isPending}
              maxLength={500}
              placeholder="Optioneel: wat speelde mee?"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor={`activity-notes-${activityId}`} className="text-sm font-semibold text-foreground">
            Wat heb je aangepast?
          </Label>
          <textarea
            id={`activity-notes-${activityId}`}
            name="notes"
            className="min-h-28 w-full rounded-[1.15rem] border border-input bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            disabled={isPending}
            maxLength={500}
            placeholder="Beschrijf kort wat je hebt aangepast aan duur, vorm of intensiteit."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs leading-6 text-muted-foreground" aria-live="polite">
          {isPending
            ? "Evaluatie wordt opgeslagen..."
            : status === "skipped"
              ? "Voeg optioneel context toe, zodat later duidelijker is waarom deze activiteit niet doorging."
              : "Beschrijf kort wat je hebt aangepast, zodat dagreflectie later betekenisvoller wordt."}
        </p>

        <Button
          type="submit"
          size="sm"
          disabled={
            isPending ||
            (status === "skipped" && !skipReasonId) ||
            (status === "adjusted" && !notes.trim())
          }
          className="rounded-full px-4"
        >
          {isPending ? "Evaluatie opslaan..." : "Evaluatie opslaan"}
        </Button>
      </div>
    </form>
  );
}
