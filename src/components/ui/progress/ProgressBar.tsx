import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const barVariants = cva("h-full transition-[width] duration-300", {
  variants: {
    variant: {
      primary: "bg-primary",
      accent: "bg-accent",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
    },
  },
  defaultVariants: { variant: "accent" },
});

interface ProgressBarProps extends VariantProps<typeof barVariants> {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, variant, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <ProgressPrimitive.Root
      value={clamped}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-muted", className)}
    >
      <ProgressPrimitive.Indicator
        className={barVariants({ variant })}
        style={{ width: `${clamped}%` }}
      />
    </ProgressPrimitive.Root>
  );
}