import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/Popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
}: DateRangePickerProps) {
  const label = value?.from
    ? value.to
      ? `${format(value.from, "LLL d, y")} – ${format(value.to, "LLL d, y")}`
      : format(value.from, "LLL d, y")
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-md border bg-surface px-3 text-sm",
            "hover:border-foreground-muted/50 focus-visible:outline-2 focus-visible:outline-ring",
            !value?.from && "text-foreground-muted",
            className,
          )}
        >
          <CalendarRange className="size-4 text-foreground-muted" />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <Calendar mode="range" numberOfMonths={2} selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}