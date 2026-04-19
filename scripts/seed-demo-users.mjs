import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { demoPersonas } from "./seed/demo-personas.mjs";
import { demoUsageSeeds } from "./seed/demo-usage-seeds.mjs";

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
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
const demoUserPassword = process.env.DEMO_USER_PASSWORD;
const isDryRun = process.argv.includes("--dry-run");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Zet NEXT_PUBLIC_SUPABASE_URL en een admin key (liefst SUPABASE_SECRET_KEY, anders SUPABASE_SERVICE_ROLE_KEY) in je omgeving voordat je demo-users seedt.",
  );
}

if (!process.env.SUPABASE_SECRET_KEY && process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY) {
  console.warn(
    "Let op: het seedscript gebruikt nu NEXT_PUBLIC_SUPABASE_SERVICE_KEY als fallback. Gebruik liever SUPABASE_SECRET_KEY in .env.local voor lokale admin-taken.",
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

const BUDGET_FORMULA_VERSION = 1;

function deriveEnergyLevel(energyScore) {
  if (energyScore <= 2) {
    return "zeer_laag";
  }

  if (energyScore <= 4) {
    return "laag";
  }

  if (energyScore <= 6) {
    return "midden";
  }

  if (energyScore <= 8) {
    return "redelijk";
  }

  return "hoog";
}

function deriveBudgetSnapshot(energyScore) {
  return {
    energy_level: deriveEnergyLevel(energyScore),
    daily_budget: energyScore,
    budget_formula_version: BUDGET_FORMULA_VERSION,
  };
}

function formatDatePart(value) {
  return String(value).padStart(2, "0");
}

function getDatePartsInTimezone(date, timezone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error(`Kon lokale datum niet bepalen voor timezone ${timezone}.`);
  }

  return { year, month, day };
}

function getDateStringWithOffset(timezone, dayOffset) {
  const now = new Date();
  const { year, month, day } = getDatePartsInTimezone(now, timezone);
  const baseDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  baseDate.setUTCDate(baseDate.getUTCDate() + dayOffset);

  return [
    baseDate.getUTCFullYear(),
    formatDatePart(baseDate.getUTCMonth() + 1),
    formatDatePart(baseDate.getUTCDate()),
  ].join("-");
}

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

async function loadReferenceMap(tableName) {
  const { data, error } = await supabase.from(tableName).select("id, key");

  if (error) {
    throw new Error(`Kon referentiedata uit ${tableName} niet laden: ${error.message}`);
  }

  return new Map(data.map((row) => [row.key, row.id]));
}

async function seedUsageData(userId, persona) {
  const usageSeed = demoUsageSeeds[persona.email];

  if (!usageSeed) {
    return {
      checkIns: 0,
      activities: 0,
    };
  }

  const categoryIdsByKey = await loadReferenceMap("activity_categories");
  const skipReasonIdsByKey = await loadReferenceMap("skip_reasons");

  const checkIns = usageSeed.checkIns.map((entry) => {
    const checkInDate = getDateStringWithOffset(persona.timezone, entry.dayOffset);

    return {
      user_id: userId,
      check_in_date: checkInDate,
      energy_score: entry.energyScore,
      sleep_quality: entry.sleepQuality,
      ...deriveBudgetSnapshot(entry.energyScore),
    };
  });

  const activityDateMap = new Map();

  for (const dayGroup of usageSeed.activities) {
    activityDateMap.set(
      dayGroup.dayOffset,
      getDateStringWithOffset(persona.timezone, dayGroup.dayOffset),
    );
  }

  if (isDryRun) {
    return {
      checkIns: checkIns.length,
      activities: usageSeed.activities.reduce(
        (count, dayGroup) => count + dayGroup.items.length,
        0,
      ),
    };
  }

  if (checkIns.length > 0) {
    const { error } = await supabase.from("morning_check_ins").upsert(checkIns, {
      onConflict: "user_id,check_in_date",
    });

    if (error) {
      throw new Error(`Kon check-ins voor ${persona.email} niet seeden: ${error.message}`);
    }
  }

  const seededDates = [...new Set([...activityDateMap.values()])];

  if (seededDates.length > 0) {
    const { error: deleteError } = await supabase
      .from("activities")
      .delete()
      .eq("user_id", userId)
      .in("activity_date", seededDates);

    if (deleteError) {
      throw new Error(`Kon bestaande activiteiten voor ${persona.email} niet vervangen: ${deleteError.message}`);
    }
  }

  const activityRows = usageSeed.activities.flatMap((dayGroup) => {
    const activityDate = activityDateMap.get(dayGroup.dayOffset);

    return dayGroup.items.map((item) => {
      const categoryId = categoryIdsByKey.get(item.categoryKey);

      if (!categoryId) {
        throw new Error(
          `Onbekende activity category key '${item.categoryKey}' voor ${persona.email}.`,
        );
      }

      const skipReasonId = item.skipReasonKey
        ? skipReasonIdsByKey.get(item.skipReasonKey)
        : null;

      if (item.skipReasonKey && !skipReasonId) {
        throw new Error(
          `Onbekende skip reason key '${item.skipReasonKey}' voor ${persona.email}.`,
        );
      }

      return {
        user_id: userId,
        activity_date: activityDate,
        source: item.source,
        status: item.status,
        name: item.name,
        category_id: categoryId,
        duration_minutes: item.durationMinutes,
        impact_level: item.impactLevel,
        priority_level: item.priorityLevel,
        skip_reason_id: skipReasonId,
        notes: item.notes ?? null,
      };
    });
  });

  if (activityRows.length > 0) {
    const { error } = await supabase.from("activities").insert(activityRows);

    if (error) {
      throw new Error(`Kon activiteiten voor ${persona.email} niet seeden: ${error.message}`);
    }
  }

  return {
    checkIns: checkIns.length,
    activities: activityRows.length,
  };
}

async function main() {
  const existingUsersByEmail = await loadExistingUsersByEmail();
  const results = [];

  for (const persona of demoPersonas) {
    const userId = await ensureAuthUser(persona, existingUsersByEmail);
    const avatarPath = await uploadAvatarIfPresent(userId, persona);

    await upsertProfile(userId, persona, avatarPath);
    await upsertSettings(userId, persona);
    const usageResult = await seedUsageData(userId, persona);

    results.push({
      email: persona.email,
      userId,
      avatar: avatarPath ? "ja" : "nee",
      checkIns: usageResult.checkIns,
      activities: usageResult.activities,
      dryRun: isDryRun ? "ja" : "nee",
    });
  }

  console.table(results);
  console.log(
    isDryRun
      ? "Dry run klaar. Er zijn geen wijzigingen weggeschreven."
      : "Demo-gebruikers, profielen, settings, avatars en usage-seeds zijn gesynchroniseerd.",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
