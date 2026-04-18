"use client";

import { useActionState, useState } from "react";
import { saveSettingsAction } from "@/app/settings/actions";
import { PreferenceHiddenFields } from "@/components/preferences/preference-hidden-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import { usePreferenceDraft } from "@/lib/preferences/use-preferences-draft";
import type { ProfileBundle } from "@/lib/profile/types";

type SettingsFormProps = {
  profileBundle: ProfileBundle;
};

const LOCALE_OPTIONS = [
  {
    value: "nl-NL",
    label: "Nederlands",
  },
] as const;

export function SettingsForm({ profileBundle }: SettingsFormProps) {
  const [, formAction, isPending] = useActionState(saveSettingsAction, null);
  const [locale, setLocale] = useState(profileBundle.profile.locale);
  const { draft, updateDraft } = usePreferenceDraft(profileBundle);

  return (
    <form action={formAction} className="space-y-6" aria-busy={isPending}>
      <input type="hidden" name="locale" value={locale} />
      <PreferenceHiddenFields draft={draft} />

      <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_18px_60px_rgba(71,85,105,0.1)]">
        <CardHeader className="pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Account
          </p>
          <CardTitle className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Basisinstellingen voor jouw account
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Je past hier alleen wellness-first voorkeuren aan. Er zijn in release 1
            geen medische velden, deelinstellingen of zorgverlenerrollen.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1 pb-6">
          <Alert className="rounded-[1.5rem] border-sky-200 bg-sky-50 text-sky-950 [&_svg]:text-sky-700">
            <AlertDescription className="leading-7 text-current">
              Release 1 draait bewust volledig in het <strong>Nederlands</strong>.
              De taalinstelling blijft wel al aanwezig in het accountmodel.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Taal en tijd
            </p>
          </CardHeader>
          <CardContent className="space-y-5 pb-6">
            <div className="space-y-2">
              <Label className="text-slate-800">Taal</Label>
              <Select
                disabled={isPending}
                value={locale}
                onValueChange={(value) => setLocale(value ?? profileBundle.profile.locale)}
              >
                <SelectTrigger className="h-12 w-full rounded-[1.25rem] bg-background/80 px-4 text-base">
                  <SelectValue placeholder="Kies een taal" />
                </SelectTrigger>
                <SelectContent>
                  {LOCALE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-800">Timezone</Label>
              <Select
                disabled={isPending}
                value={draft.timezone}
                onValueChange={(value) =>
                  updateDraft({
                    timezone: value ?? profileBundle.profile.timezone,
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
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Interface
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0 shadow-none">
              <CardContent className="flex items-start justify-between gap-4 py-5">
                <div className="space-y-1">
                  <Label htmlFor="show-energy-points" className="text-sm font-semibold text-slate-900">
                    Toon energiebudgetpunten
                  </Label>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Laat budgetpunten zichtbaar zien in het dashboard en latere dagflows.
                  </p>
                </div>
                <Switch
                  id="show-energy-points"
                  disabled={isPending}
                  checked={draft.showEnergyPoints}
                  onCheckedChange={(showEnergyPoints) =>
                    updateDraft({ showEnergyPoints })
                  }
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Reminders
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0 shadow-none">
              <CardContent className="space-y-4 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="morning-reminder-enabled" className="text-sm font-semibold text-slate-900">
                      Ochtendreminder
                    </Label>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Zet een lichte reminder aan voor een rustige start van je check-in.
                    </p>
                  </div>
                    <Switch
                      id="morning-reminder-enabled"
                      disabled={isPending}
                      checked={draft.morningReminderEnabled}
                      onCheckedChange={(morningReminderEnabled) =>
                        updateDraft({ morningReminderEnabled })
                      }
                    />
                </div>

                {draft.morningReminderEnabled ? (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="morning-reminder-time" className="text-slate-800">
                        Tijdstip voor de ochtendreminder
                      </Label>
                      <Input
                        id="morning-reminder-time"
                        className="h-12 rounded-[1.25rem] bg-white px-4 text-base md:text-base"
                        disabled={isPending}
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

            <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0 shadow-none">
              <CardContent className="flex items-start justify-between gap-4 py-5">
                <div className="space-y-1">
                  <Label htmlFor="reflection-reminder-enabled" className="text-sm font-semibold text-slate-900">
                    Reflectieprompts toestaan
                  </Label>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Maak alvast de opt-in klaar voor lichte terugblikprompts in een latere story.
                  </p>
                </div>
                <Switch
                  id="reflection-reminder-enabled"
                  disabled={isPending}
                  checked={draft.reflectionReminderEnabled}
                  onCheckedChange={(reflectionReminderEnabled) =>
                    updateDraft({ reflectionReminderEnabled })
                  }
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border border-primary/15 bg-primary py-0 text-primary-foreground shadow-[0_12px_40px_rgba(22,58,43,0.18)]">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/75">
              Bewuste grenzen
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pb-6 text-sm leading-7 text-primary-foreground/90">
            <p>Geen medische drempels, diagnoses of behandelinstellingen.</p>
            <p>Geen delen met zorgverleners of naasten in release 1.</p>
            <p>Alle instellingen blijven gekoppeld aan alleen jouw account.</p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-7 text-muted-foreground">
          {isPending
            ? "Instellingen worden opgeslagen..."
            : "Wijzigingen zijn direct van toepassing op jouw account en volgende sessies."}
        </p>

        <Button type="submit" size="lg" disabled={isPending} className="h-11 rounded-full px-5">
          {isPending ? "Instellingen opslaan..." : "Instellingen opslaan"}
        </Button>
      </div>
    </form>
  );
}
