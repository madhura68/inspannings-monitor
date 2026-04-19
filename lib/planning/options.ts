export const ACTIVITY_SOURCE_VALUES = ["planned", "ad_hoc"] as const;
export const ACTIVITY_STATUS_VALUES = [
  "planned",
  "completed",
  "skipped",
  "adjusted",
] as const;
export const ACTIVITY_IMPACT_LEVEL_VALUES = ["laag", "midden", "hoog"] as const;
export const ACTIVITY_PRIORITY_LEVEL_VALUES = ["laag", "normaal", "hoog"] as const;

export const SEEDED_ACTIVITY_CATEGORY_KEYS = [
  "huishouden",
  "werk_studie",
  "administratie",
  "sociaal",
  "beweging",
  "rust_herstel",
  "reizen",
  "vrije_tijd",
] as const;

export const SEEDED_SKIP_REASON_KEYS = [
  "energie_te_laag",
  "prioriteit_veranderd",
  "praktische_belemmering",
  "duurde_langer_dan_verwacht",
  "te_belastend",
  "vergeten",
] as const;
