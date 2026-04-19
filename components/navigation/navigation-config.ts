"use client";

import {
  ActivityIcon,
  ClipboardCheckIcon,
  InfoIcon,
  LayoutDashboardIcon,
  Settings2Icon,
} from "lucide-react";

export const primaryNavItems = [
  {
    href: "/",
    label: "About",
    icon: InfoIcon,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/planning",
    label: "Planning",
    icon: ActivityIcon,
  },
  {
    href: "/check-in",
    label: "Check-in",
    icon: ClipboardCheckIcon,
  },
] as const;

export const bottomNavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/check-in",
    label: "Check-in",
    icon: ClipboardCheckIcon,
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

const bottomNavRoutePrefixes = ["/dashboard", "/check-in", "/planning", "/settings"];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function shouldUseBottomNav(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return bottomNavRoutePrefixes.some((href) => isActivePath(pathname, href));
}
