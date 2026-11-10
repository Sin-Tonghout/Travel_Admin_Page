import { CheckCheck, CircleCheck, CircleX, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge/Badge";
import type { BookingStatus } from "@/types/booking";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";

const config: Record<BookingStatus, { label: string; variant: Variant; icon: ReactNode }> = {
  pending: { label: "Pending", variant: "warning", icon: <Clock className="size-3" /> },
  confirmed: { label: "Confirmed", variant: "info", icon: <CircleCheck className="size-3" /> },
  completed: { label: "Completed", variant: "success", icon: <CheckCheck className="size-3" /> },
  cancelled: { label: "Cancelled", variant: "danger", icon: <CircleX className="size-3" /> },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, variant, icon } = config[status];
  return (
    <Badge variant={variant} icon={icon}>
      {label}
    </Badge>
  );
}