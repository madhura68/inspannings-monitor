import { getAuthenticatedUser } from "@/lib/auth/session";
import { deriveBudgetSnapshot } from "@/lib/check-in/budget";
import { getLocalDateForTimezone } from "@/lib/dates";
import { ensureProfileBundleForCurrentUser } from "@/lib/profile/service";
import { createClient } from "@/lib/supabase/server";
import type {
  EnergyLevel,
  MorningCheckInRecord,
  MorningCheckInStatus,
  MorningCheckInSubmission,
  SleepQuality,
} from "@/lib/check-in/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type MorningCheckInRow = {
  id: string;
  user_id: string;
  check_in_date: string;
  energy_score: number;
  sleep_quality: SleepQuality;
  energy_level: EnergyLevel;
  daily_budget: number;
  budget_formula_version: number;
  created_at: string;
  updated_at: string;
};

type MorningCheckInInsert = {
  user_id: string;
  check_in_date: string;
  energy_score: number;
  sleep_quality: SleepQuality;
  energy_level: EnergyLevel;
  daily_budget: number;
  budget_formula_version: number;
};

const MORNING_CHECK_IN_COLUMNS =
  "id, user_id, check_in_date, energy_score, sleep_quality, energy_level, daily_budget, budget_formula_version, created_at, updated_at";

function mapMorningCheckInRow(row: MorningCheckInRow): MorningCheckInRecord {
  return {
    id: row.id,
    userId: row.user_id,
    checkInDate: row.check_in_date,
    energyScore: row.energy_score,
    sleepQuality: row.sleep_quality,
    energyLevel: row.energy_level,
    dailyBudget: row.daily_budget,
    budgetFormulaVersion: row.budget_formula_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function readMorningCheckInByDate(
  supabase: SupabaseServerClient,
  userId: string,
  checkInDate: string,
): Promise<MorningCheckInRow | null> {
  const { data, error } = await supabase
    .from("morning_check_ins")
    .select(MORNING_CHECK_IN_COLUMNS)
    .eq("user_id", userId)
    .eq("check_in_date", checkInDate)
    .maybeSingle();

  if (error) {
    throw new Error(`Ochtendcheck-in kon niet worden geladen: ${error.message}`);
  }

  return data;
}

export async function getTodayCheckInForCurrentUser(): Promise<MorningCheckInStatus | null> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    return null;
  }

  const timezone = profileBundle.profile.timezone;
  const todayDate = getLocalDateForTimezone(timezone);
  const supabase = await createClient();
  const morningCheckInRow = await readMorningCheckInByDate(supabase, user.id, todayDate);

  return {
    timezone,
    todayDate,
    todayCheckIn: morningCheckInRow ? mapMorningCheckInRow(morningCheckInRow) : null,
  };
}

export async function upsertTodayCheckInForCurrentUser(
  submission: MorningCheckInSubmission,
): Promise<MorningCheckInRecord> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    throw new Error("Profielbundle ontbreekt voor de huidige gebruiker.");
  }

  const checkInDate = getLocalDateForTimezone(profileBundle.profile.timezone);
  const budgetSnapshot = deriveBudgetSnapshot(submission.energyScore);
  const payload: MorningCheckInInsert = {
    user_id: user.id,
    check_in_date: checkInDate,
    energy_score: submission.energyScore,
    sleep_quality: submission.sleepQuality,
    energy_level: budgetSnapshot.energyLevel,
    daily_budget: budgetSnapshot.dailyBudget,
    budget_formula_version: budgetSnapshot.budgetFormulaVersion,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("morning_check_ins")
    .upsert(payload, {
      onConflict: "user_id,check_in_date",
    })
    .select(MORNING_CHECK_IN_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Ochtendcheck-in kon niet worden opgeslagen: ${error.message}`);
  }

  return mapMorningCheckInRow(data);
}
