"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildPathWithQuery,
  getRequestOrigin,
  sanitizeNextPath,
} from "@/lib/auth/navigation";
import {
  assertEmail,
  assertMinLength,
  FormDataValidationError,
  getOptionalString,
  getRequiredString,
} from "@/lib/forms/parse";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

function parseSignInFormData(formData: FormData) {
  const next = sanitizeNextPath(getOptionalString(formData, "next"));
  const email = assertEmail(
    getRequiredString(formData, "email", "missing-fields"),
    "invalid-email",
  );
  const password = assertMinLength(
    getRequiredString(formData, "password", "missing-fields"),
    8,
    "password-too-short",
  );

  return {
    next,
    email,
    password,
  };
}

function parseSignUpFormData(formData: FormData) {
  const next = sanitizeNextPath(getOptionalString(formData, "next"));
  const email = assertEmail(
    getRequiredString(formData, "email", "missing-fields"),
    "invalid-email",
  );
  const password = assertMinLength(
    getRequiredString(formData, "password", "missing-fields"),
    8,
    "password-too-short",
  );

  return {
    next,
    email,
    password,
  };
}

export async function signInAction(formData: FormData) {
  let next = sanitizeNextPath(getOptionalString(formData, "next"));
  let email = "";
  let password = "";

  try {
    const parsedFormData = parseSignInFormData(formData);
    next = parsedFormData.next;
    email = parsedFormData.email;
    password = parsedFormData.password;
  } catch (error) {
    if (error instanceof FormDataValidationError) {
      redirect(buildPathWithQuery("/login", { error: error.code, next }));
    }

    throw error;
  }

  if (!hasSupabaseEnv()) {
    redirect(buildPathWithQuery("/login", { error: "auth-not-configured", next }));
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
  let next = sanitizeNextPath(getOptionalString(formData, "next"));
  let email = "";
  let password = "";

  try {
    const parsedFormData = parseSignUpFormData(formData);
    next = parsedFormData.next;
    email = parsedFormData.email;
    password = parsedFormData.password;
  } catch (error) {
    if (error instanceof FormDataValidationError) {
      redirect(buildPathWithQuery("/sign-up", { error: error.code, next }));
    }

    throw error;
  }

  if (!hasSupabaseEnv()) {
    redirect(
      buildPathWithQuery("/sign-up", { error: "auth-not-configured", next }),
    );
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
