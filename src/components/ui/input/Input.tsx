import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leadingIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, leadingIcon, ...props }, ref) => (
    <div className="relative">
      {leadingIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted [&_svg]:size-4">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-md border bg-surface px-3 text-sm text-foreground placeholder:text-foreground-muted",
          "transition-colors duration-150 hover:border-foreground-muted/50",
          "focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
          invalid && "border-danger focus-visible:outline-danger",
          leadingIcon && "pl-9",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";