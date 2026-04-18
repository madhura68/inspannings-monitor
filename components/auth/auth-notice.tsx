import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { type AuthNotice } from "@/lib/auth/messages";

type AuthNoticeProps = {
  notice: AuthNotice | null;
};

const toneStyles = {
  error: {
    className: "mb-5 border-rose-200 bg-rose-50 text-rose-950 [&_svg]:text-rose-700",
    icon: AlertCircleIcon,
  },
  success: {
    className:
      "mb-5 border-emerald-200 bg-emerald-50 text-emerald-950 [&_svg]:text-emerald-700",
    icon: CheckCircle2Icon,
  },
  info: {
    className: "mb-5 border-sky-200 bg-sky-50 text-sky-950 [&_svg]:text-sky-700",
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
    <Alert className={cn("rounded-[1.5rem] px-4 py-3", tone.className)}>
      <Icon className="size-4" />
      <AlertDescription className="leading-7 text-current">
        {notice.text}
      </AlertDescription>
    </Alert>
  );
}
