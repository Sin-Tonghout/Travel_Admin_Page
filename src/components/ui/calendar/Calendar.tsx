import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar(props: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      classNames={{
        root: "text-sm",
        months: "relative flex flex-col gap-6 sm:flex-row",
        month: "space-y-3",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "text-sm font-semibold",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous:
          "inline-flex size-8 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
        button_next:
          "inline-flex size-8 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-medium text-foreground-muted",
        week: "mt-1 flex",
        day: "size-9 p-0 text-center",
        day_button:
          "size-9 rounded-md transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-ring",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary-hover",
        range_middle:
          "bg-secondary [&>button]:!bg-transparent [&>button]:!text-secondary-foreground",
        today: "font-bold text-accent",
        outside: "text-foreground-muted opacity-50",
        disabled: "opacity-40",
        hidden: "invisible",
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}