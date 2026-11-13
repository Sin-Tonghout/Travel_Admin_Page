import { addMonths, format, getDay, parseISO, subMonths } from "date-fns";
import { Ban, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DayAvailability } from "@/types/availability";

interface Props {
  month: string;
  days?: DayAvailability[];
  loading: boolean;
  selected?: string;
  onSelect: (date: string) => void;
  onMonthChange: (month: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayKey = () => format(new Date(), "yyyy-MM-dd");

function describe(day: DayAvailability): { text: string; dot: string } {
  if (day.blocked) return { text: "Blocked", dot: "bg-danger" };
  if (day.booked >= day.capacity) return { text: "Full", dot: "bg-warning" };
  if (day.booked === 0) return { text: "Open", dot: "bg-success" };
  return { text: `${day.capacity - day.booked} left`, dot: "bg-success" };
}

export function AvailabilityCalendar({ month, days, loading, selected, onSelect, onMonthChange }: Props) {
  const first = parseISO(`${month}-01`);
  const leading = (getDay(first) + 6) % 7; // Monday first
  const today = todayKey();
  const dayCount = days?.length ?? new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();

  return (
    <section aria-label="Availability calendar" className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{format(first, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => onMonthChange(format(new Date(), "yyyy-MM"))}>
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous month"
            onClick={() => onMonthChange(format(subMonths(first, 1), "yyyy-MM"))}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next month"
            onClick={() => onMonthChange(format(addMonths(first, 1), "yyyy-MM"))}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-foreground-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className={cn("mt-1 grid grid-cols-7 gap-1 transition-opacity", loading && "opacity-60")} aria-busy={loading}>
        {Array.from({ length: leading }, (_, i) => (
          <div key={`blank-${i}`} aria-hidden />
        ))}
        {Array.from({ length: dayCount }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, "0")}`;
          const day = days?.[i];
          const info = day ? describe(day) : null;
          const isSelected = selected === date;
          const pct = day ? Math.min(100, Math.round((day.booked / day.capacity) * 100)) : 0;

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelect(date)}
              aria-pressed={isSelected}
              aria-label={`${format(parseISO(date), "EEEE, MMMM d")}${info ? `: ${info.text}` : ""}`}
              className={cn(
                "flex min-h-16 flex-col justify-between rounded-lg border p-1.5 text-left transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-ring sm:min-h-20 sm:p-2",
                isSelected ? "border-primary ring-2 ring-primary" : "border-border",
                day?.blocked && "bg-surface-muted",
                date < today && "opacity-60",
              )}
            >
              <span className={cn("text-sm font-semibold", date === today && "text-accent")}>{i + 1}</span>
              {info && day && (
                <span className="space-y-1">
                  <span className="flex items-center gap-1 text-[11px] leading-none text-foreground-muted">
                    {day.blocked ? (
                      <Ban className="size-3 text-danger" aria-hidden />
                    ) : (
                      <span className={cn("size-2 shrink-0 rounded-full", info.dot)} aria-hidden />
                    )}
                    <span className="truncate">{info.text}</span>
                  </span>
                  {!day.blocked && (
                    <span className="block h-1 overflow-hidden rounded-full bg-border" aria-hidden>
                      <span className="block h-full bg-primary" style={{ width: `${pct}%` }} />
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-foreground-muted">
        Each date shows seats left. A bar shows how full it is. Select a date to see its bookings or change it.
      </p>
    </section>
  );
}