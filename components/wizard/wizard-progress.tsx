import { cn } from "@/lib/utils";

type WizardProgressProps = {
  current: number;
  total: number;
};

export function WizardProgress({ current, total }: WizardProgressProps) {
  return (
    <ol className="mt-8 flex gap-3" aria-label="Voortgang">
      {Array.from({ length: total }, (_, index) => (
        <li
          key={index}
          className={cn(
            "h-2 flex-1 rounded-full transition-colors",
            index < current ? "bg-primary-foreground/85" : "bg-white/15",
          )}
        />
      ))}
    </ol>
  );
}
