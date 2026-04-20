"use client";

import Link from "next/link";
import {
  CircleUserRoundIcon,
  LogInIcon,
  LogOutIcon,
  Settings2Icon,
  UserPlusIcon,
} from "lucide-react";
import { signOutAction } from "@/app/auth-actions";
import type { AuthState } from "@/lib/auth/session";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import type { NavProfile } from "@/lib/profile/service";

function formatNavDisplayName(displayName: string | null): string | null {
  if (!displayName) return null;
  const parts = displayName.trim().split(/\s+/);
  if (parts.length < 2) return displayName;
  return `${parts[0][0]}. ${parts[parts.length - 1]}`;
}
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
  navProfile: NavProfile | null;
};

export function AccountMenu({ authState, navProfile }: AccountMenuProps) {
  const showAvatar = authState.isAuthenticated && navProfile?.avatarUrl;
  const navLabel = formatNavDisplayName(navProfile?.displayName ?? null) ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account menu">
        {showAvatar ? (
          <ProfileAvatar
            avatarUrl={navProfile!.avatarUrl}
            displayName={navProfile!.displayName}
            email={authState.email}
            size="xs"
          />
        ) : (
          <CircleUserRoundIcon className="size-4" />
        )}
        <span className="hidden sm:inline">{navLabel}</span>
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
                render={<Link href="/settings" />}
              >
                <Settings2Icon className="size-4" />
                Instellingen
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
