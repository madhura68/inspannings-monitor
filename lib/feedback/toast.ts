"use client";

import { toast } from "sonner";
import type { StatusToast } from "@/lib/feedback/status-messages";

export function showStatusToast(statusToast: StatusToast) {
  const description = statusToast.title ? statusToast.message : undefined;
  const message = statusToast.title ?? statusToast.message;

  if (statusToast.variant === "success") {
    toast.success(message, { description });
    return;
  }

  if (statusToast.variant === "info") {
    toast.info(message, { description });
    return;
  }

  if (statusToast.variant === "warning") {
    toast.warning(message, { description });
    return;
  }

  toast.error(message, { description });
}
