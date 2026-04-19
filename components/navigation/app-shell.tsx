import type { ReactNode } from "react";
import { getAuthState } from "@/lib/auth/session";
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

  return (
    <main className="app-page">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8">
        <TopNav authState={authState} />
        <div className={cn("flex-1", contentClassName)}>{children}</div>
      </div>
    </main>
  );
}
