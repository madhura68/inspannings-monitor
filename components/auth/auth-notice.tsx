import { type AuthNotice } from "@/lib/auth/messages";

type AuthNoticeProps = {
  notice: AuthNotice | null;
};

const toneStyles = {
  error: "border-rose-200 bg-rose-50 text-rose-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
};

export function AuthNotice({ notice }: AuthNoticeProps) {
  if (!notice) {
    return null;
  }

  return (
    <div
      className={`mb-5 rounded-2xl border px-4 py-3 text-sm leading-7 ${toneStyles[notice.tone]}`}
    >
      {notice.text}
    </div>
  );
}
