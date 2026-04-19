import "server-only";

import sharp from "sharp";
import {
  PROFILE_AVATAR_MAX_DIMENSION,
  PROFILE_AVATAR_STORED_MAX_BYTES,
} from "@/lib/profile/avatar";

const OUTPUT_QUALITY_STEPS = [82, 72, 64] as const;
const OUTPUT_CONTENT_TYPE = "image/webp";

export type ProcessedProfileAvatar = {
  buffer: Buffer;
  contentType: string;
};

export class ProfileAvatarProcessingError extends Error {}

export async function processProfileAvatar(
  file: File,
): Promise<ProcessedProfileAvatar> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  for (const quality of OUTPUT_QUALITY_STEPS) {
    const outputBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: PROFILE_AVATAR_MAX_DIMENSION,
        height: PROFILE_AVATAR_MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    if (outputBuffer.byteLength <= PROFILE_AVATAR_STORED_MAX_BYTES) {
      return {
        buffer: outputBuffer,
        contentType: OUTPUT_CONTENT_TYPE,
      };
    }
  }

  throw new ProfileAvatarProcessingError(
    "De profielfoto blijft te groot na verkleinen.",
  );
}
