import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  children: ReactNode;
  activeCount?: number;
  onClear?: () => void;
}

export function FilterBar({ children, activeCount = 0, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-surface p-3">
      {children}
      {activeCount > 0 && onClear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          leadingIcon={<X className="size-4" />}
          className="ml-auto"
        >
          Clear filters ({activeCount})
        </Button>
      )}
    </div>
  );
}