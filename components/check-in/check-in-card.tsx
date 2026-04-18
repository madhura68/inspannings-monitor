import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MorningCheckInRecord } from "@/lib/check-in/types";
import { cn } from "@/lib/utils";

type CheckInCardProps = {
  todayCheckIn: MorningCheckInRecord | null;
};

function formatSleepQualityLabel(value: MorningCheckInRecord["sleepQuality"]) {
  if (value === "goed") {
    return "Goed";
  }

  if (value === "matig") {
    return "Matig";
  }

  return "Slecht";
}

export function CheckInCard({ todayCheckIn }: CheckInCardProps) {
  const title = todayCheckIn ? "Vandaag ingevuld" : "Nog niet ingevuld";
  const description = todayCheckIn
    ? `Energie ${todayCheckIn.energyScore}/10, slaap ${formatSleepQualityLabel(todayCheckIn.sleepQuality).toLowerCase()}.`
    : "Leg je energiestart en slaapkwaliteit van vandaag vast.";

  return (
    <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Ochtendcheck-in
        </p>
        <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        <CardDescription className="text-sm leading-7 text-muted-foreground">
          {description}
        </CardDescription>
        <Link
          href="/check-in"
          className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-5")}
        >
          {todayCheckIn ? "Werk check-in bij" : "Start check-in"}
        </Link>
      </CardContent>
    </Card>
  );
}
