export type PageSearchParams = Record<string, string | string[] | undefined>;

export function getParamValue(params: PageSearchParams, key: string): string | null {
  const value = params[key];
  return typeof value === "string" ? value : null;
}
