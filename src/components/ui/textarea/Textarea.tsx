import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-24 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted",
        "transition-colors duration-150 hover:border-foreground-muted/50",
        "focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
        invalid && "border-danger focus-visible:outline-danger",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";