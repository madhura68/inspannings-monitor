const DEFAULT_NEXT_PATH = "/dashboard";

export function sanitizeNextPath(candidate?: string | null): string {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return DEFAULT_NEXT_PATH;
  }

  return candidate;
}

export function buildPathWithQuery(
  pathname: string,
  params: Record<string, string | null | undefined>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getRequestOrigin(headers: Pick<Headers, "get">): string {
  const origin = headers.get("origin");
  if (origin) {
    return origin;
  }

  const protocol = headers.get("x-forwarded-proto") ?? "http";
  const host = headers.get("x-forwarded-host") ?? headers.get("host");

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}
