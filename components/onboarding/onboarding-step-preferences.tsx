import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { OnboardingDraft } from "@/lib/onboarding/use-onboarding-draft";

type OnboardingStepPreferencesProps = {
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  disabled?: boolean;
};

export function OnboardingStepPreferences({
  draft,
  updateDraft,
  disabled = false,
}: OnboardingStepPreferencesProps) {
  return (
    <div className="space-y-4">
      <Card tone="subtle" className="py-0 shadow-none">
        <CardContent className="flex items-start justify-between gap-4 py-5">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">
              Toon energiebudgetpunten
            </Label>
            <p className="text-sm leading-7 text-muted-foreground">
              Laat geplande en resterende punten zichtbaar zien in de interface.
            </p>
          </div>
          <Switch
            disabled={disabled}
            checked={draft.showEnergyPoints}
            onCheckedChange={(checked) => updateDraft({ showEnergyPoints: checked })}
          />
        </CardContent>
      </Card>

      <Card tone="subtle" className="py-0 shadow-none">
        <CardContent className="space-y-4 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-foreground">
                Zet een lichte ochtendreminder aan
              </Label>
              <p className="text-sm leading-7 text-muted-foreground">
                Handig als je later een korte check-in wilt doen zonder extra druk.
              </p>
            </div>
            <Switch
              disabled={disabled}
              checked={draft.morningReminderEnabled}
              onCheckedChange={(checked) =>
                updateDraft({ morningReminderEnabled: checked })
              }
            />
          </div>

          {draft.morningReminderEnabled ? (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="morning-reminder-time" className="text-foreground">
                  Tijdstip voor de ochtendreminder
                </Label>
                <Input
                  id="morning-reminder-time"
                  className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
                  disabled={disabled}
                  type="time"
                  value={draft.morningReminderTime}
                  onChange={(event) =>
                    updateDraft({ morningReminderTime: event.target.value })
                  }
                />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card tone="subtle" className="py-0 shadow-none">
        <CardContent className="flex items-start justify-between gap-4 py-5">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">
              Sta lichte reflectieprompts toe
            </Label>
            <p className="text-sm leading-7 text-muted-foreground">
              Optionele terugblikprompts kunnen later helpen om rustiger patronen te zien.
            </p>
          </div>
          <Switch
            disabled={disabled}
            checked={draft.reflectionReminderEnabled}
            onCheckedChange={(checked) =>
              updateDraft({ reflectionReminderEnabled: checked })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
