export interface DayOverride {
  blocked: boolean;
  /** Undefined means the tour's default capacity. */
  capacity?: number;
  note: string;
}

// Mock "database". Phase 10 replaces this with API calls.
const overrides = new Map<string, DayOverride>();

const keyOf = (tourId: string, date: string) => `${tourId}|${date}`;

export const getOverride = (tourId: string, date: string): DayOverride | undefined =>
  overrides.get(keyOf(tourId, date));

export const setOverride = (tourId: string, date: string, value: DayOverride) =>
  void overrides.set(keyOf(tourId, date), value);

export const clearOverride = (tourId: string, date: string) => void overrides.delete(keyOf(tourId, date));