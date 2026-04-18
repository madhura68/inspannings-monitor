import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

type ClaimsShape = {
  sub?: string;
  email?: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

export type AuthState = {
  isConfigured: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return null;
  }

  const claims = data.claims as ClaimsShape;
  const userId = typeof claims.sub === "string" ? claims.sub : null;

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    email: typeof claims.email === "string" ? claims.email : null,
  };
}

export async function getAuthState(): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return {
      isConfigured: false,
      isAuthenticated: false,
      userId: null,
      email: null,
    };
  }

  const authenticatedUser = await getAuthenticatedUser();

  return {
    isConfigured: true,
    isAuthenticated: Boolean(authenticatedUser),
    userId: authenticatedUser?.id ?? null,
    email: authenticatedUser?.email ?? null,
  };
}
