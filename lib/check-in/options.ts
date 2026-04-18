export const SLEEP_QUALITY_OPTIONS = [
  {
    value: "goed",
    label: "Goed",
    description: "Je bent redelijk uitgerust wakker geworden.",
  },
  {
    value: "matig",
    label: "Matig",
    description: "Je slaap was onrustig of niet helemaal herstellend.",
  },
  {
    value: "slecht",
    label: "Slecht",
    description: "Je voelt dat je slaap duidelijk onvoldoende hielp.",
  },
] as const;

export const SLEEP_QUALITY_VALUES = SLEEP_QUALITY_OPTIONS.map((option) => option.value);

export const ENERGY_SCORE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
