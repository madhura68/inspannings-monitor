import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AuthPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthPanel({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthPanelProps) {
  return (
    <main className="app-page">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="app-panel-primary flex flex-col justify-between rounded-[var(--radius-4xl)] p-7 sm:p-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/72">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-primary-foreground/85">
              {description}
            </p>
          </div>

          <div className="mt-10 rounded-[var(--radius-2xl)] border border-white/10 bg-white/8 p-5 text-sm leading-7 text-primary-foreground/90">
            <p className="font-semibold">Release 1 blijft bewust licht.</p>
            <ul className="mt-3 space-y-2">
              <li>Wellness-first en alleen voor individuele gebruikers</li>
              <li>Geen zorgverlenerstoegang, sharing of AI in deze fase</li>
              <li>Authenticatie via Supabase met cookie-based sessies</li>
            </ul>
          </div>
        </section>

        <section className="flex items-center">
          <Card elevation="raised" className="w-full rounded-[var(--radius-4xl)] py-0 backdrop-blur">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-auto p-0 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:bg-transparent hover:text-foreground",
                )}
              >
                Terug naar landing
              </Link>
              </div>
              {children}
              <Separator className="mt-6" />
              <div className="pt-5 text-sm text-muted-foreground">{footer}</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
