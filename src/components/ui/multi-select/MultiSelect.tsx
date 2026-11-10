import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge/Badge";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/Popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
}: MultiSelectProps) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  const selected = options.filter((o) => value.includes(o.value));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-h-10 w-full items-center justify-between gap-2 rounded-md border bg-surface px-3 py-1.5 text-sm",
            "hover:border-foreground-muted/50 focus-visible:outline-2 focus-visible:outline-ring",
            className,
          )}
        >
          <span className="flex flex-wrap gap-1">
            {selected.length === 0 ? (
              <span className="text-foreground-muted">{placeholder}</span>
            ) : (
              selected.map((o) => (
                <Badge key={o.value} variant="primary">
                  {o.label}
                </Badge>
              ))
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 text-foreground-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1">
        <ul role="listbox" aria-multiselectable className="max-h-64 overflow-y-auto">
          {options.map((o) => {
            const checked = value.includes(o.value);
            return (
              <li key={o.value} role="option" aria-selected={checked}>
                <button
                  type="button"
                  onClick={() => toggle(o.value)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Checkbox checked={checked} tabIndex={-1} aria-hidden className="pointer-events-none" />
                  {o.label}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}