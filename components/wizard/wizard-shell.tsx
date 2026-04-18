import type { ReactNode } from "react";
import { WizardProgress } from "@/components/wizard/wizard-progress";

type WizardShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  progressCurrent: number;
  progressTotal: number;
  topAction?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  backAction?: ReactNode;
  nextAction?: ReactNode;
};

export function WizardShell({
  eyebrow,
  title,
  description,
  progressCurrent,
  progressTotal,
  topAction,
  aside,
  children,
  backAction,
  nextAction,
}: WizardShellProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-primary/15 bg-primary p-7 text-primary-foreground shadow-[0_18px_60px_rgba(22,58,43,0.18)] sm:p-9">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl text-base leading-8 text-primary-foreground/85">
            {description}
          </p>
        ) : null}
        {aside ? <div className="mt-10">{aside}</div> : null}
        <WizardProgress current={progressCurrent} total={progressTotal} />
      </section>

      <section className="rounded-[2rem] border border-border/60 bg-card/90 p-6 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur sm:p-8">
        {topAction ? (
          <div className="mb-6 flex items-center justify-between gap-3">{topAction}</div>
        ) : null}
        <div className="space-y-6">{children}</div>
        {backAction || nextAction ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div>{backAction}</div>
            <div>{nextAction}</div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
