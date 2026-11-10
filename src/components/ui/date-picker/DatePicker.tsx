import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/Popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  /** Days before this date can't be selected. */
  minDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  invalid,
  id,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "inline-flex h-10 w-full items-center gap-2 rounded-md border bg-surface px-3 text-left text-sm",
            "hover:border-foreground-muted/50 focus-visible:outline-2 focus-visible:outline-ring",
            "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
            !value && "text-foreground-muted",
            invalid && "border-danger",
          )}
        >
          <CalendarIcon className="size-4 text-foreground-muted" />
          {value ? format(value, "PPP") : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <Calendar
          mode="single"
          selected={value}
          disabled={minDate ? { before: minDate } : undefined}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}