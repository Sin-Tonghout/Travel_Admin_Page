import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-danger">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
}