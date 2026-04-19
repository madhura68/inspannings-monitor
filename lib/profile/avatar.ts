const PROFILE_AVATAR_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PROFILE_AVATAR_BUCKET = "profile-avatars";
export const PROFILE_AVATAR_UPLOAD_MAX_BYTES = 12 * 1024 * 1024;
export const PROFILE_AVATAR_STORED_MAX_BYTES = 2 * 1024 * 1024;
export const PROFILE_AVATAR_MAX_DIMENSION = 700;

export function getProfileAvatarPath(userId: string) {
  return `${userId}/avatar`;
}

export function isAllowedProfileAvatarMimeType(value: string) {
  return PROFILE_AVATAR_ALLOWED_MIME_TYPES.includes(
    value as (typeof PROFILE_AVATAR_ALLOWED_MIME_TYPES)[number],
  );
}
