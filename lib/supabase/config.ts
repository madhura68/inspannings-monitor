export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase configuratie ontbreekt. Voeg NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY toe.",
    );
  }

  return {
    url,
    publishableKey,
  };
}

export function getSupabaseAdminEnv() {
  const { url } = getSupabaseEnv();
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

  if (!secretKey) {
    throw new Error(
      "Supabase admin-configuratie ontbreekt. Voeg SUPABASE_SECRET_KEY toe voor server-only taken zoals avatar-uploads.",
    );
  }

  return {
    url,
    secretKey,
  };
}
