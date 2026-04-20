import type { ReactNode } from "react";
import { getAuthState } from "@/lib/auth/session";
import { getNavAvatarUrlForCurrentUser } from "@/lib/profile/service";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { TopNav } from "@/components/navigation/top-nav";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  contentClassName?: string;
};

export async function AppShell({
  children,
  contentClassName,
}: AppShellProps) {
  const authState = await getAuthState();
  const navAvatarUrl = authState.userId
    ? await getNavAvatarUrlForCurrentUser(authState.userId)
    : null;

  return (
    <main className="app-page">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8">
        <TopNav authState={authState} navAvatarUrl={navAvatarUrl} />
        <div className={cn("flex-1", contentClassName)}>{children}</div>
        <BottomNav />
      </div>
    </main>
  );
}
