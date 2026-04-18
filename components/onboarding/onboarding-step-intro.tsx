import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OnboardingStepIntro() {
  return (
    <div className="space-y-4">
      <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0">
        <CardHeader className="pb-0">
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
            Wat je hier wél krijgt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            Een rustige plan-doe-evalueer flow met energiebudgetten, zonder druk,
            score-oordeel of medische terminologie.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0">
        <CardHeader className="pb-0">
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
            Wat deze app niet doet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            Geen diagnose, geen behandeling, geen medische triage en geen automatisch
            delen met derden.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
