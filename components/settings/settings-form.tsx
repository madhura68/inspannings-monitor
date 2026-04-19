"use client";

import { useActionState, useState } from "react";
import { saveSettingsAction } from "@/app/settings/actions";
import { PreferenceHiddenFields } from "@/components/preferences/preference-hidden-fields";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import { PROFILE_AVATAR_MAX_BYTES } from "@/lib/profile/avatar";
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
  const avatarLimitInMb = PROFILE_AVATAR_MAX_BYTES / (1024 * 1024);
  const profileTitle =
    profileBundle.profile.displayName ??
    profileBundle.profile.email ??
    "Ingelogde gebruiker";

  return (
    <form
      action={formAction}
      className="space-y-6"
      aria-busy={isPending}
    >
      <input type="hidden" name="locale" value={locale} />
      <PreferenceHiddenFields draft={draft} />

      <Card elevation="raised" className="py-0">
        <CardHeader className="pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Account
          </p>
          <CardTitle className="font-[family-name:var(--font-display)] text-3xl text-foreground">
            Basisinstellingen voor jouw account
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Je past hier alleen wellness-first voorkeuren aan. Er zijn in release 1
            geen medische velden, deelinstellingen of zorgverlenerrollen.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1 pb-6">
          <Alert variant="info">
            <AlertDescription className="leading-7 text-current">
              Release 1 draait bewust volledig in het <strong>Nederlands</strong>.
              De taalinstelling blijft wel al aanwezig in het accountmodel.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardHeader className="pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Profiel
          </p>
          <CardTitle className="text-2xl text-foreground">
            Laat in een paar regels zien wie je bent
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Voeg een naam, korte profielregel, langere beschrijving en een profielfoto toe.
            Dit helpt straks ook bij demo-accounts en voorbeeldgebruik.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pb-6 lg:grid-cols-[16rem_1fr]">
          <Card tone="subtle" className="py-0 shadow-none">
            <CardContent className="flex h-full flex-col items-center gap-4 px-5 py-5 text-center">
              <ProfileAvatar
                avatarUrl={profileBundle.profile.avatarUrl}
                displayName={profileBundle.profile.displayName}
                email={profileBundle.profile.email}
                size="lg"
              />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{profileTitle}</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {profileBundle.profile.tagline ?? "Nog geen 1-regelige introductie toegevoegd."}
                </p>
              </div>

              <div className="w-full space-y-2 text-left">
                <Label htmlFor="avatar" className="text-foreground">
                  Profielfoto
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isPending}
                  className="h-auto rounded-[1.25rem] bg-background/80 px-4 py-3 file:mr-3 file:rounded-full file:bg-secondary file:px-3 file:py-1.5 file:text-secondary-foreground"
                />
                <p className="text-xs leading-6 text-muted-foreground">
                  JPG, PNG of WebP tot {avatarLimitInMb} MB. Een nieuw bestand vervangt je
                  huidige foto.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="display-name" className="text-foreground">
                Weergavenaam
              </Label>
              <Input
                id="display-name"
                name="displayName"
                defaultValue={profileBundle.profile.displayName ?? ""}
                disabled={isPending}
                maxLength={80}
                className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
                placeholder="Bijvoorbeeld Jan Peter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-foreground">
                Wie ben je in 1 regel?
              </Label>
              <Input
                id="tagline"
                name="tagline"
                defaultValue={profileBundle.profile.tagline ?? ""}
                disabled={isPending}
                maxLength={160}
                className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
                placeholder="Bijvoorbeeld: rustige planner die energie slim wil verdelen"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground">
                Korte omschrijving
              </Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profileBundle.profile.bio ?? ""}
                disabled={isPending}
                maxLength={2000}
                className="min-h-36 rounded-[1.5rem] bg-background/80 px-4 py-3 text-base md:text-base"
                placeholder="Vertel in een paar zinnen wat belangrijk is in je dagstructuur, energie of ritme."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="py-0">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Taal en tijd
            </p>
          </CardHeader>
          <CardContent className="space-y-5 pb-6">
            <div className="space-y-2">
              <Label className="text-foreground">Taal</Label>
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
              <Label className="text-foreground">Timezone</Label>
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

        <Card className="py-0">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Interface
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <Card tone="subtle" className="py-0 shadow-none">
              <CardContent className="flex items-start justify-between gap-4 py-5">
                <div className="space-y-1">
                  <Label htmlFor="show-energy-points" className="text-sm font-semibold text-foreground">
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
        <Card className="py-0">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Reminders
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <Card tone="subtle" className="py-0 shadow-none">
              <CardContent className="space-y-4 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="morning-reminder-enabled" className="text-sm font-semibold text-foreground">
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
                      <Label htmlFor="morning-reminder-time" className="text-foreground">
                        Tijdstip voor de ochtendreminder
                      </Label>
                      <Input
                        id="morning-reminder-time"
                        className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
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

            <Card tone="subtle" className="py-0 shadow-none">
              <CardContent className="flex items-start justify-between gap-4 py-5">
                <div className="space-y-1">
                  <Label htmlFor="reflection-reminder-enabled" className="text-sm font-semibold text-foreground">
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

        <Card tone="primary" elevation="raised" className="py-0">
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
