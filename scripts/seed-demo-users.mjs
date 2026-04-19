import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { demoPersonas } from "./seed/demo-personas.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function loadEnvFile(filePath) {
  try {
    const rawContents = await fs.readFile(filePath, "utf8");

    for (const line of rawContents.split(/\r?\n/)) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex < 0) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const rawValue = trimmedLine.slice(separatorIndex + 1).trim();

      if (!key || process.env[key] !== undefined) {
        continue;
      }

      const normalizedValue = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = normalizedValue;
    }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}

await loadEnvFile(path.join(rootDir, ".env.local"));
await loadEnvFile(path.join(rootDir, ".env"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const demoUserPassword = process.env.DEMO_USER_PASSWORD;
const isDryRun = process.argv.includes("--dry-run");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Zet NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in je omgeving voordat je demo-users seedt.",
  );
}

if (!demoUserPassword && !isDryRun) {
  throw new Error(
    "Zet DEMO_USER_PASSWORD in je omgeving of gebruik --dry-run om alleen te controleren wat er zou gebeuren.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function getAvatarPath(userId) {
  return `${userId}/avatar`;
}

async function loadExistingUsersByEmail() {
  const byEmail = new Map();
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(`Kon bestaande auth-users niet laden: ${error.message}`);
    }

    for (const user of data.users) {
      if (user.email) {
        byEmail.set(user.email.toLowerCase(), user);
      }
    }

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  return byEmail;
}

async function ensureAuthUser(persona, existingUsersByEmail) {
  const existingUser = existingUsersByEmail.get(persona.email.toLowerCase());

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email_confirm: true,
      user_metadata: {
        display_name: persona.displayName,
        demo_user: true,
      },
    });

    if (error) {
      throw new Error(`Kon auth-user ${persona.email} niet bijwerken: ${error.message}`);
    }

    return existingUser.id;
  }

  if (isDryRun) {
    return `dry-run-${persona.slug}`;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: persona.email,
    password: demoUserPassword,
    email_confirm: true,
    user_metadata: {
      display_name: persona.displayName,
      demo_user: true,
    },
    app_metadata: {
      demo_user: true,
    },
  });

  if (error || !data.user) {
    throw new Error(`Kon auth-user ${persona.email} niet aanmaken: ${error?.message ?? "onbekend"}`);
  }

  existingUsersByEmail.set(persona.email.toLowerCase(), data.user);
  return data.user.id;
}

async function uploadAvatarIfPresent(userId, persona) {
  if (!persona.avatarFile || isDryRun) {
    return null;
  }

  const avatarFilePath = path.join(rootDir, persona.avatarFile);
  const avatarBytes = await fs.readFile(avatarFilePath);
  const avatarPath = getAvatarPath(userId);

  const { error } = await supabase.storage
    .from("profile-avatars")
    .upload(avatarPath, avatarBytes, {
      upsert: true,
      contentType: "image/jpeg",
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Kon avatar voor ${persona.email} niet uploaden: ${error.message}`);
  }

  return avatarPath;
}

async function upsertProfile(userId, persona, avatarPath) {
  if (isDryRun) {
    return;
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: persona.email,
      display_name: persona.displayName,
      tagline: persona.tagline,
      bio: persona.bio,
      avatar_path: avatarPath,
      locale: persona.locale,
      timezone: persona.timezone,
      onboarding_seen: true,
      onboarding_completed: true,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Kon profiel ${persona.email} niet opslaan: ${error.message}`);
  }
}

async function upsertSettings(userId, persona) {
  if (isDryRun) {
    return;
  }

  const { error } = await supabase.from("user_settings").upsert(
    {
      profile_id: userId,
      morning_reminder_enabled: persona.settings.morningReminderEnabled,
      morning_reminder_time: persona.settings.morningReminderTime,
      reflection_reminder_enabled: persona.settings.reflectionReminderEnabled,
      show_energy_points: persona.settings.showEnergyPoints,
    },
    { onConflict: "profile_id" },
  );

  if (error) {
    throw new Error(`Kon settings voor ${persona.email} niet opslaan: ${error.message}`);
  }
}

async function main() {
  const existingUsersByEmail = await loadExistingUsersByEmail();
  const results = [];

  for (const persona of demoPersonas) {
    const userId = await ensureAuthUser(persona, existingUsersByEmail);
    const avatarPath = await uploadAvatarIfPresent(userId, persona);

    await upsertProfile(userId, persona, avatarPath);
    await upsertSettings(userId, persona);

    results.push({
      email: persona.email,
      userId,
      avatar: avatarPath ? "ja" : "nee",
      dryRun: isDryRun ? "ja" : "nee",
    });
  }

  console.table(results);
  console.log(
    isDryRun
      ? "Dry run klaar. Er zijn geen wijzigingen weggeschreven."
      : "Demo-gebruikers, profielen, settings en avatars zijn gesynchroniseerd.",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
