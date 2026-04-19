"use client";

import Link from "next/link";
import { CircleUserRoundIcon, LayoutDashboardIcon, LogInIcon, LogOutIcon, UserPlusIcon } from "lucide-react";
import { signOutAction } from "@/app/auth-actions";
import type { AuthState } from "@/lib/auth/session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AccountMenuProps = {
  authState: AuthState;
};

export function AccountMenu({ authState }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account menu">
        <CircleUserRoundIcon className="size-4" />
        Account
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {authState.isConfigured ? (
          authState.isAuthenticated ? (
            <>
              <DropdownMenuLabel className="normal-case tracking-normal text-foreground">
                {authState.email ?? "Ingelogde gebruiker"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/dashboard" />}
              >
                <LayoutDashboardIcon className="size-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/check-in" />}
              >
                <LogInIcon className="size-4" />
                Check-in
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={signOutAction}>
                <DropdownMenuItem
                  nativeButton
                  render={<button type="submit" />}
                >
                  <LogOutIcon className="size-4" />
                  Uitloggen
                </DropdownMenuItem>
              </form>
            </>
          ) : (
            <>
              <DropdownMenuLabel>Niet ingelogd</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/login" />}
              >
                <LogInIcon className="size-4" />
                Inloggen
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/sign-up" />}
              >
                <UserPlusIcon className="size-4" />
                Account aanmaken
              </DropdownMenuItem>
            </>
          )
        ) : (
          <>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <LogInIcon className="size-4" />
              Auth nog niet geconfigureerd
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
