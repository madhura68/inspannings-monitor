import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
  className,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-4xl)] border border-border/70 bg-card/72 p-6 shadow-[var(--shadow-1)] backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-8",
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
      {aside ? <div className="sm:pl-6">{aside}</div> : null}
    </section>
  );
}
