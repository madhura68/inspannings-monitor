"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavItems, isActivePath, shouldUseBottomNav } from "@/components/navigation/navigation-config";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  if (!shouldUseBottomNav(pathname)) {
    return null;
  }

  return (
    <>
      <div className="h-24 sm:hidden" aria-hidden="true" />
      <nav
        aria-label="Mobiele navigatie"
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden"
      >
        <div className="mx-auto flex max-w-md items-end gap-2 rounded-[var(--radius-3xl)] border border-border/75 bg-card/94 px-3 py-2 shadow-[var(--shadow-3)] backdrop-blur">
          {bottomNavItems.map((item) => {
            const isActive = pathname ? isActivePath(pathname, item.href) : false;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "state-layer flex min-h-14 flex-1 flex-col items-center justify-center gap-1.5 rounded-[var(--radius-2xl)] px-2 py-2 text-center transition-colors",
                  isActive
                    ? "bg-primary-container text-primary-container-foreground shadow-[var(--shadow-1)]"
                    : "text-muted-foreground hover:bg-surface-container-high hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "bg-transparent",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span
                  className={cn(
                    "type-label-medium leading-none",
                    isActive && "font-semibold text-foreground",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
