"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { StatusToast } from "@/lib/feedback/status-messages";
import { showStatusToast } from "@/lib/feedback/toast";

type StatusToastBridgeProps = {
  toast: StatusToast | null;
  paramKeys?: string[];
};

export function StatusToastBridge({
  toast,
  paramKeys = ["status"],
}: StatusToastBridgeProps) {
  const hasShownRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!toast || hasShownRef.current) {
      return;
    }

    hasShownRef.current = true;
    showStatusToast(toast);

    if (!pathname) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    let changed = false;

    for (const key of paramKeys) {
      if (nextParams.has(key)) {
        nextParams.delete(key);
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [paramKeys, pathname, router, searchParams, toast]);

  return null;
}
