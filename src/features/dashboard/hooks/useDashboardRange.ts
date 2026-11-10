import { subDays } from "date-fns";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fromParam, presets, resolveRange, toParam } from "@/features/dashboard/lib/date-range";
import type { RangePreset } from "@/features/dashboard/lib/date-range";
import type { DashboardOptions } from "@/features/dashboard/services/dashboardService";

/** The selected range lives in the URL, so reloads and shared links keep the same view. */
export function useDashboardRange() {
  const [params, setParams] = useSearchParams();

  const presetParam = params.get("range");
  const preset: RangePreset = presets.some((p) => p.id === presetParam) ? (presetParam as RangePreset) : "30d";
  const fromValue = params.get("from");
  const toValue = params.get("to");

  const range = useMemo(
    () => resolveRange(preset, fromParam(fromValue), fromParam(toValue)),
    [preset, fromValue, toValue],
  );

  const flags = useMemo<DashboardOptions>(
    () => (import.meta.env.DEV ? { fail: params.get("fail") === "1", empty: params.get("empty") === "1" } : {}),
    [params],
  );

  const setPreset = (next: RangePreset) => {
    const p = new URLSearchParams(params);
    p.set("range", next);
    if (next === "custom") {
      if (!p.get("from") || !p.get("to")) {
        p.set("from", toParam(subDays(new Date(), 13)));
        p.set("to", toParam(new Date()));
      }
    } else {
      p.delete("from");
      p.delete("to");
    }
    setParams(p, { replace: true });
  };

  const setCustom = (from: Date, to: Date) => {
    const p = new URLSearchParams(params);
    p.set("range", "custom");
    p.set("from", toParam(from));
    p.set("to", toParam(to));
    setParams(p, { replace: true });
  };

  return { range, flags, setPreset, setCustom };
}