import { getAuthenticatedUser } from "@/lib/auth/session";
import { getLocalDateForTimezone } from "@/lib/dates";
import { calculateDayOverviewSnapshot } from "@/lib/planning/day-overview";
import type {
  ActivityCategory,
  CreateAdHocActivitySubmission,
  CreateActivitySubmission,
  ActivityImpactLevel,
  ActivityPriorityLevel,
  PlanningPageData,
  ActivityRecord,
  ActivitySource,
  ActivitiesForDateStatus,
  ActivityStatus,
  SkipReason,
  UpdateActivityEvaluationSubmission,
  UpdateActivityStatusSubmission,
} from "@/lib/planning/types";
import { ensureProfileBundleForCurrentUser } from "@/lib/profile/service";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type ActivityCategoryRow = {
  id: string;
  key: string;
  label_nl: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

type SkipReasonRow = {
  id: string;
  key: string;
  label_nl: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

type ActivityRow = {
  id: string;
  user_id: string;
  activity_date: string;
  source: ActivitySource;
  status: ActivityStatus;
  name: string;
  category_id: string;
  duration_minutes: number;
  impact_level: ActivityImpactLevel;
  priority_level: ActivityPriorityLevel;
  skip_reason_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ACTIVITY_CATEGORY_COLUMNS =
  "id, key, label_nl, sort_order, is_active, created_at";
const SKIP_REASON_COLUMNS =
  "id, key, label_nl, sort_order, is_active, created_at";
const ACTIVITY_COLUMNS =
  "id, user_id, activity_date, source, status, name, category_id, duration_minutes, impact_level, priority_level, skip_reason_id, notes, created_at, updated_at";

function mapActivityCategoryRow(row: ActivityCategoryRow): ActivityCategory {
  return {
    id: row.id,
    key: row.key,
    labelNl: row.label_nl,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function mapSkipReasonRow(row: SkipReasonRow): SkipReason {
  return {
    id: row.id,
    key: row.key,
    labelNl: row.label_nl,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function mapActivityRow(row: ActivityRow): ActivityRecord {
  return {
    id: row.id,
    userId: row.user_id,
    activityDate: row.activity_date,
    source: row.source,
    status: row.status,
    name: row.name,
    categoryId: row.category_id,
    durationMinutes: row.duration_minutes,
    impactLevel: row.impact_level,
    priorityLevel: row.priority_level,
    skipReasonId: row.skip_reason_id,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function assertIsoDate(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new Error("Ongeldige plandatum. Gebruik het formaat YYYY-MM-DD.");
  }
}

async function readActivitiesByDate(
  supabase: SupabaseServerClient,
  userId: string,
  activityDate: string,
): Promise<ActivityRecord[]> {
  const { data, error } = await supabase
    .from("activities")
    .select(ACTIVITY_COLUMNS)
    .eq("user_id", userId)
    .eq("activity_date", activityDate)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Activiteiten konden niet worden geladen: ${error.message}`);
  }

  return (data ?? []).map(mapActivityRow);
}

async function assertCategoryExists(
  supabase: SupabaseServerClient,
  categoryId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("activity_categories")
    .select("id")
    .eq("id", categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Activiteitcategorie kon niet worden gevalideerd: ${error.message}`);
  }

  if (!data) {
    throw new Error("Ongeldige activiteitcategorie.");
  }
}

async function assertSkipReasonExists(
  supabase: SupabaseServerClient,
  skipReasonId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("skip_reasons")
    .select("id")
    .eq("id", skipReasonId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Skip-reden kon niet worden gevalideerd: ${error.message}`);
  }

  if (!data) {
    throw new Error("Ongeldige skip-reden.");
  }
}

export async function listActivityCategories(): Promise<ActivityCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_categories")
    .select(ACTIVITY_CATEGORY_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Activiteitcategorieën konden niet worden geladen: ${error.message}`);
  }

  return (data ?? []).map(mapActivityCategoryRow);
}

export async function listSkipReasons(): Promise<SkipReason[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skip_reasons")
    .select(SKIP_REASON_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Skip-redenen konden niet worden geladen: ${error.message}`);
  }

  return (data ?? []).map(mapSkipReasonRow);
}

export async function getActivitiesForDateForCurrentUser(
  activityDate: string,
): Promise<ActivityRecord[] | null> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  assertIsoDate(activityDate);

  const supabase = await createClient();
  return readActivitiesByDate(supabase, user.id, activityDate);
}

export async function getTodayActivitiesForCurrentUser(): Promise<ActivitiesForDateStatus | null> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    return null;
  }

  const activityDate = getLocalDateForTimezone(profileBundle.profile.timezone);
  const supabase = await createClient();
  const activities = await readActivitiesByDate(supabase, user.id, activityDate);

  return {
    timezone: profileBundle.profile.timezone,
    activityDate,
    activities,
  };
}

export async function getPlanningPageDataForCurrentUser(): Promise<PlanningPageData | null> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    return null;
  }

  const [categories, skipReasons, activitiesStatus] = await Promise.all([
    listActivityCategories(),
    listSkipReasons(),
    getTodayActivitiesForCurrentUser(),
  ]);

  return {
    timezone: profileBundle.profile.timezone,
    activityDate:
      activitiesStatus?.activityDate ?? getLocalDateForTimezone(profileBundle.profile.timezone),
    categories,
    skipReasons,
    activities: activitiesStatus?.activities ?? [],
    dayOverview: calculateDayOverviewSnapshot(activitiesStatus?.activities ?? []),
  };
}

export async function createActivityForTodayForCurrentUser(
  submission: CreateActivitySubmission,
): Promise<ActivityRecord> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    throw new Error("Profielbundle ontbreekt voor de huidige gebruiker.");
  }

  const activityDate = getLocalDateForTimezone(profileBundle.profile.timezone);
  const supabase = await createClient();

  await assertCategoryExists(supabase, submission.categoryId);

  const { data, error } = await supabase
    .from("activities")
    .insert({
      user_id: user.id,
      activity_date: activityDate,
      source: "planned",
      status: "planned",
      name: submission.name,
      category_id: submission.categoryId,
      duration_minutes: submission.durationMinutes,
      impact_level: submission.impactLevel,
      priority_level: submission.priorityLevel,
      skip_reason_id: null,
      notes: null,
    })
    .select(ACTIVITY_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Activiteit kon niet worden opgeslagen: ${error.message}`);
  }

  return mapActivityRow(data);
}

export async function createAdHocActivityForTodayForCurrentUser(
  submission: CreateAdHocActivitySubmission,
): Promise<ActivityRecord> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    throw new Error("Profielbundle ontbreekt voor de huidige gebruiker.");
  }

  const activityDate = getLocalDateForTimezone(profileBundle.profile.timezone);
  const supabase = await createClient();

  await assertCategoryExists(supabase, submission.categoryId);

  const { data, error } = await supabase
    .from("activities")
    .insert({
      user_id: user.id,
      activity_date: activityDate,
      source: "ad_hoc",
      status: "completed",
      name: submission.name,
      category_id: submission.categoryId,
      duration_minutes: submission.durationMinutes,
      impact_level: submission.impactLevel,
      priority_level: "normaal",
      skip_reason_id: null,
      notes: null,
    })
    .select(ACTIVITY_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Ongeplande activiteit kon niet worden opgeslagen: ${error.message}`);
  }

  return mapActivityRow(data);
}

export async function updateActivityStatusForTodayForCurrentUser(
  submission: UpdateActivityStatusSubmission,
): Promise<ActivityRecord> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    throw new Error("Profielbundle ontbreekt voor de huidige gebruiker.");
  }

  const activityDate = getLocalDateForTimezone(profileBundle.profile.timezone);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activities")
    .update({
      status: submission.status,
    })
    .eq("id", submission.activityId)
    .eq("user_id", user.id)
    .eq("activity_date", activityDate)
    .select(ACTIVITY_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error(`Activiteitstatus kon niet worden opgeslagen: ${error.message}`);
  }

  if (!data) {
    throw new Error("Ongeldige of niet-beschikbare activiteit.");
  }

  return mapActivityRow(data);
}

export async function updateActivityEvaluationForTodayForCurrentUser(
  submission: UpdateActivityEvaluationSubmission,
): Promise<ActivityRecord> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  const profileBundle = await ensureProfileBundleForCurrentUser();

  if (!profileBundle) {
    throw new Error("Profielbundle ontbreekt voor de huidige gebruiker.");
  }

  const activityDate = getLocalDateForTimezone(profileBundle.profile.timezone);
  const supabase = await createClient();

  const { data: existingActivity, error: existingActivityError } = await supabase
    .from("activities")
    .select(ACTIVITY_COLUMNS)
    .eq("id", submission.activityId)
    .eq("user_id", user.id)
    .eq("activity_date", activityDate)
    .maybeSingle();

  if (existingActivityError) {
    throw new Error(
      `Activiteit voor evaluatie kon niet worden geladen: ${existingActivityError.message}`,
    );
  }

  if (!existingActivity) {
    throw new Error("Ongeldige of niet-beschikbare activiteit.");
  }

  let nextSkipReasonId: string | null = null;
  let nextNotes: string | null = null;

  if (existingActivity.status === "skipped") {
    if (!submission.skipReasonId) {
      throw new Error("Skip-reden is verplicht voor een overgeslagen activiteit.");
    }

    await assertSkipReasonExists(supabase, submission.skipReasonId);
    nextSkipReasonId = submission.skipReasonId;
    nextNotes = submission.notes;
  } else if (existingActivity.status === "adjusted") {
    if (!submission.notes) {
      throw new Error("Toelichting is verplicht voor een aangepaste activiteit.");
    }

    nextNotes = submission.notes;
  }

  const { data, error } = await supabase
    .from("activities")
    .update({
      skip_reason_id: nextSkipReasonId,
      notes: nextNotes,
    })
    .eq("id", existingActivity.id)
    .eq("user_id", user.id)
    .eq("activity_date", activityDate)
    .select(ACTIVITY_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Evaluatiecontext kon niet worden opgeslagen: ${error.message}`);
  }

  return mapActivityRow(data);
}
