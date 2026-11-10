import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-picker/DateRangePicker";
import { presets } from "@/features/dashboard/lib/date-range";
import type { RangePreset, ResolvedRange } from "@/features/dashboard/lib/date-range";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  range: ResolvedRange;
  onPreset: (preset: RangePreset) => void;
  onCustom: (from: Date, to: Date) => void;
}

export function DateRangeFilter({ range, onPreset, onCustom }: DateRangeFilterProps) {
  // While the user is mid-selection, the picker shows the draft instead of the committed range.
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="group" aria-label="Date range" className="inline-flex flex-wrap gap-1 rounded-lg border bg-surface p-1">
        {presets.map((p) => {
          const active = range.preset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setDraft(undefined);
                onPreset(p.id);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-ring",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {range.preset === "custom" && (
        <DateRangePicker
          value={draft ?? { from: range.from, to: range.to }}
          onChange={(r) => {
            if (r?.from && r?.to) {
              setDraft(undefined);
              onCustom(r.from, r.to);
            } else {
              setDraft(r);
            }
          }}
        />
      )}
    </div>
  );
}