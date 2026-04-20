import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  avatarUrl: string | null;
  displayName: string | null;
  email?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const avatarSizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-12 text-sm",
  md: "size-16 text-base",
  lg: "size-20 text-xl",
} as const;

function getProfileInitials(displayName: string | null, email?: string | null) {
  const source = displayName?.trim() || email?.trim() || "";

  if (!source) {
    return "IM";
  }

  const parts = source
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "IM";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function ProfileAvatar({
  avatarUrl,
  displayName,
  email = null,
  size = "md",
  className,
}: ProfileAvatarProps) {
  const initials = getProfileInitials(displayName, email);
  const label = displayName || email || "Profielavatar";

  return (
    <div
      aria-label={label}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/50 bg-muted/70 font-semibold tracking-[0.08em] text-foreground shadow-[var(--shadow-1)]",
        avatarSizeClasses[size],
        className,
      )}
      role="img"
    >
      {avatarUrl ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
      ) : null}
      <span className={cn("relative z-10", avatarUrl ? "sr-only" : null)}>{initials}</span>
    </div>
  );
}
