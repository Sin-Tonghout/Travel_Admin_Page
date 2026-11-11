import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SubHeading({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("mb-4 text-base font-bold", className)}>{children}</h3>;
}

export function FieldGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <dl className={cn("grid gap-x-4 gap-y-5", cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>{children}</dl>
  );
}

interface ReadOnlyFieldProps {
  label: string;
  children?: ReactNode;
  multiline?: boolean;
  className?: string;
}

/** A label over a filled box, like a form field that can't be edited. */
export function ReadOnlyField({ label, children, multiline, className }: ReadOnlyFieldProps) {
  const empty = children === undefined || children === null || children === "";

  return (
    <div className={className}>
      <dt className="mb-1.5 text-xs font-medium text-foreground-muted">{label}</dt>
      <dd
        className={cn(
          "rounded-md bg-surface-muted px-3 py-2.5 text-sm font-medium",
          multiline && "min-h-24 whitespace-pre-wrap font-normal leading-relaxed",
        )}
      >
        {empty ? <span className="font-normal text-foreground-muted">—</span> : children}
      </dd>
    </div>
  );
}