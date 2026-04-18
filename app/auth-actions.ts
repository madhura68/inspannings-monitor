"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildPathWithQuery,
  getRequestOrigin,
  sanitizeNextPath,
} from "@/lib/auth/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signInAction(formData: FormData) {
  const next = sanitizeNextPath(getString(formData, "next"));

  if (!hasSupabaseEnv()) {
    redirect(buildPathWithQuery("/login", { error: "auth-not-configured", next }));
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    redirect(buildPathWithQuery("/login", { error: "missing-fields", next }));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const normalizedMessage = error.message.toLowerCase();
    const errorParam =
      error.code === "email_not_confirmed" ||
      normalizedMessage.includes("email not confirmed")
        ? "email-not-confirmed"
        : "invalid-credentials";

    redirect(buildPathWithQuery("/login", { error: errorParam, next }));
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const next = sanitizeNextPath(getString(formData, "next"));

  if (!hasSupabaseEnv()) {
    redirect(
      buildPathWithQuery("/sign-up", { error: "auth-not-configured", next }),
    );
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    redirect(buildPathWithQuery("/sign-up", { error: "missing-fields", next }));
  }

  const supabase = await createClient();
  const headerStore = await headers();
  const origin = getRequestOrigin(headerStore);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const normalizedMessage = error.message.toLowerCase();
    const errorParam =
      error.code === "over_email_send_rate_limit" ||
      normalizedMessage.includes("rate limit")
        ? "signup-rate-limited"
        : "signup-failed";

    redirect(buildPathWithQuery("/sign-up", { error: errorParam, next }));
  }

  redirect(buildPathWithQuery("/sign-up", { status: "check-email", next }));
}

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect(buildPathWithQuery("/", { status: "signed-out" }));
}
