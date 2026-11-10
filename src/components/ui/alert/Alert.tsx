import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "danger";

const styles: Record<AlertVariant, string> = {
  info: "border-info/30 bg-info-subtle",
  success: "border-success/30 bg-success-subtle",
  warning: "border-warning/30 bg-warning-subtle",
  danger: "border-danger/30 bg-danger-subtle",
};

const iconStyles: Record<AlertVariant, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const icons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
} as const;

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title: string;
  action?: ReactNode;
}

export function Alert({
  variant = "info",
  title,
  action,
  children,
  className,
  ...props
}: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg border p-4 text-foreground", styles[variant], className)}
      {...props}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconStyles[variant])} />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        {children && <div className="text-sm text-foreground-muted">{children}</div>}
      </div>
      {action}
    </div>
  );
}