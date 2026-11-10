import { forwardRef } from "react";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./Button";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";

interface IconButtonProps extends Omit<ButtonProps, "children" | "size" | "leadingIcon" | "trailingIcon"> {
  /** Required: icon-only buttons need an accessible name. */
  label: string;
  icon: ReactNode;
  size?: "icon-sm" | "icon-md" | "icon-lg";
  tooltip?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, size = "icon-md", variant = "ghost", tooltip = true, ...props }, ref) => {
    const button = (
      <Button ref={ref} variant={variant} size={size} aria-label={label} {...props}>
        {icon}
      </Button>
    );
    return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
  },
);
IconButton.displayName = "IconButton";