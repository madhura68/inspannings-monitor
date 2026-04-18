import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import type { OnboardingDraft } from "@/lib/onboarding/use-onboarding-draft";

type OnboardingStepProfileProps = {
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  disabled?: boolean;
};

export function OnboardingStepProfile({
  draft,
  updateDraft,
  disabled = false,
}: OnboardingStepProfileProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="display-name" className="text-slate-800">
          Schermnaam
        </Label>
        <Input
          id="display-name"
          className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
          disabled={disabled}
          type="text"
          value={draft.displayName}
          onChange={(event) => updateDraft({ displayName: event.target.value })}
          placeholder="Optioneel, bijvoorbeeld Jan"
          maxLength={40}
        />
      </div>

      <Alert className="rounded-[1.5rem] border-sky-200 bg-sky-50 text-sky-950 [&_svg]:text-sky-700">
        <AlertDescription className="leading-7 text-current">
          Voertaal voor release 1 staat vast op <strong>Nederlands</strong>.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label className="text-slate-800">Timezone</Label>
        <Select
          disabled={disabled}
          value={draft.timezone}
          onValueChange={(value) =>
            updateDraft({
              timezone: value ?? draft.timezone,
            })
          }
        >
          <SelectTrigger className="h-12 w-full rounded-[1.25rem] bg-background/80 px-4 text-base">
            <SelectValue placeholder="Kies een timezone" />
          </SelectTrigger>
          <SelectContent>
            {ONBOARDING_TIMEZONE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
