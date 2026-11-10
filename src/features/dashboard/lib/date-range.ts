import {
  differenceInCalendarDays,
  endOfDay,
  format,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns";

export type RangePreset = "today" | "7d" | "30d" | "month" | "year" | "custom";

export const presets: { id: RangePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
  { id: "custom", label: "Custom" },
];

export interface DateWindow {
  from: Date;
  to: Date;
}

export interface ResolvedRange extends DateWindow {
  preset: RangePreset;
  days: number;
  label: string;
  text: string;
}

const PARAM_FORMAT = "yyyy-MM-dd";

export const toParam = (d: Date) => format(d, PARAM_FORMAT);

export function fromParam(value: string | null): Date | null {
  if (!value) return null;
  const d = parse(value, PARAM_FORMAT, new Date());
  return isValid(d) ? d : null;
}

export function formatRangeText(from: Date, to: Date): string {
  if (differenceInCalendarDays(to, from) === 0) return format(from, "MMM d, yyyy");
  if (from.getFullYear() === to.getFullYear()) return `${format(from, "MMM d")} – ${format(to, "MMM d, yyyy")}`;
  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
}

export function resolveRange(
  preset: RangePreset,
  customFrom: Date | null,
  customTo: Date | null,
  now: Date = new Date(),
): ResolvedRange {
  let from = startOfDay(now);
  let to = endOfDay(now);

  switch (preset) {
    case "7d":
      from = startOfDay(subDays(now, 6));
      break;
    case "30d":
      from = startOfDay(subDays(now, 29));
      break;
    case "month":
      from = startOfMonth(now);
      break;
    case "year":
      from = startOfYear(now);
      break;
    case "custom":
      if (customFrom && customTo) {
        const [a, b] = customFrom <= customTo ? [customFrom, customTo] : [customTo, customFrom];
        from = startOfDay(a);
        to = endOfDay(b);
      } else {
        from = startOfDay(subDays(now, 13));
      }
      break;
    default:
      break; // "today"
  }

  const label = preset === "custom" ? "Custom range" : (presets.find((p) => p.id === preset)?.label ?? "");
  return {
    preset,
    from,
    to,
    days: differenceInCalendarDays(to, from) + 1,
    label,
    text: formatRangeText(from, to),
  };
}

/** The period of equal length immediately before the selected one. */
export function previousWindow(range: ResolvedRange): DateWindow {
  return {
    from: startOfDay(subDays(range.from, range.days)),
    to: endOfDay(subDays(range.from, 1)),
  };
}

export function comparisonLabel(range: ResolvedRange): string {
  if (range.preset === "today") return "vs yesterday";
  if (range.preset === "7d") return "vs previous 7 days";
  if (range.preset === "30d") return "vs previous 30 days";
  return "vs previous period";
}