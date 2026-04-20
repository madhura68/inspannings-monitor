"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AuthState } from "@/lib/auth/session";
import type { NavProfile } from "@/lib/profile/service";
import { AccountMenu } from "@/components/navigation/account-menu";
import {
  isActivePath,
  primaryNavItems,
  shouldUseBottomNav,
} from "@/components/navigation/navigation-config";
import { ThemeMenu } from "@/components/navigation/theme-menu";
import { cn } from "@/lib/utils";

type TopNavProps = {
  authState: AuthState;
  navProfile: NavProfile | null;
};

export function TopNav({ authState, navProfile }: TopNavProps) {
  const pathname = usePathname();
  const useCompactBottomNav = shouldUseBottomNav(pathname);

  return (
    <header className="sticky top-4 z-40">
      <div className="flex flex-wrap items-center gap-4 rounded-[var(--radius-4xl)] border border-border/70 bg-card/86 px-5 py-4 shadow-[var(--shadow-2)] backdrop-blur">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/icon.svg"
            alt="Inspannings Monitor icoon"
            width={36}
            height={36}
            className="shrink-0 rounded-xl"
          />
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Inspannings Monitor
            </span>
            <span className="mt-1 block text-base font-semibold tracking-[-0.02em] text-foreground">
              Wellness-first dagflow
            </span>
          </div>
        </Link>

        <nav
          aria-label="Hoofdnavigatie"
          className={cn(
            "flex flex-1 flex-wrap items-center gap-2 md:ml-6",
            useCompactBottomNav ? "hidden sm:flex" : "flex",
          )}
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
                    ? "bg-primary !text-white shadow-[var(--shadow-1)] [&_svg]:!text-white"
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
          <AccountMenu authState={authState} navProfile={navProfile} />
        </div>
      </div>
    </header>
  );
}
