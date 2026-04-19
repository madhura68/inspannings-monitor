"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivityIcon, InfoIcon, Settings2Icon } from "lucide-react";
import type { AuthState } from "@/lib/auth/session";
import { AccountMenu } from "@/components/navigation/account-menu";
import { ThemeMenu } from "@/components/navigation/theme-menu";
import { cn } from "@/lib/utils";

const primaryNavItems = [
  {
    href: "/",
    label: "About",
    icon: InfoIcon,
  },
  {
    href: "/planning",
    label: "Planning",
    icon: ActivityIcon,
  },
  {
    href: "/settings",
    label: "Instellingen",
    icon: Settings2Icon,
  },
] as const;

type TopNavProps = {
  authState: AuthState;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopNav({ authState }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-40">
      <div className="flex flex-wrap items-center gap-4 rounded-[var(--radius-4xl)] border border-border/70 bg-card/86 px-5 py-4 shadow-[var(--shadow-2)] backdrop-blur">
        <Link href="/" className="shrink-0">
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Inspannings Monitor
          </span>
          <span className="mt-1 block text-base font-semibold tracking-[-0.02em] text-foreground">
            Wellness-first dagflow
          </span>
        </Link>

        <nav
          aria-label="Hoofdnavigatie"
          className="flex flex-1 flex-wrap items-center gap-2 md:ml-6"
        >
          {primaryNavItems.map((item) => {
            const isActive = pathname ? isActivePath(pathname, item.href) : false;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-1)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <ThemeMenu />
          <AccountMenu authState={authState} />
        </div>
      </div>
    </header>
  );
}
