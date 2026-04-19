import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { type AuthNotice } from "@/lib/auth/messages";

type AuthNoticeProps = {
  notice: AuthNotice | null;
};

const toneStyles = {
  error: {
    variant: "destructive" as const,
    className: "mb-5",
    icon: AlertCircleIcon,
  },
  success: {
    variant: "success" as const,
    className: "mb-5",
    icon: CheckCircle2Icon,
  },
  info: {
    variant: "info" as const,
    className: "mb-5",
    icon: InfoIcon,
  },
};

export function AuthNotice({ notice }: AuthNoticeProps) {
  if (!notice) {
    return null;
  }

  const tone = toneStyles[notice.tone];
  const Icon = tone.icon;

  return (
    <Alert variant={tone.variant} className={cn("px-4 py-3", tone.className)}>
      <Icon className="size-4" />
      <AlertDescription className="leading-7 text-current">
        {notice.text}
      </AlertDescription>
    </Alert>
  );
}
