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
          aria-current={index + 1 === current ? "step" : undefined}
          aria-label={`Stap ${index + 1} van ${total}`}
          className={cn(
            "h-2 flex-1 rounded-full transition-colors",
            index < current ? "bg-primary-foreground/85" : "bg-white/15",
          )}
        >
          <span className="sr-only">Stap {index + 1} van {total}</span>
        </li>
      ))}
    </ol>
  );
}
