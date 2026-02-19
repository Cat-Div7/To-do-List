export const FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  UNCOMPLETED: "uncompleted",
} as const;

export type FilterType = typeof FILTERS[keyof typeof FILTERS];
