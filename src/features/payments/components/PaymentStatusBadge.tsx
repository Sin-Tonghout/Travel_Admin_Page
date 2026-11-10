import { CircleCheck, Clock, TriangleAlert, Undo2 } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge/Badge";
import type { PaymentStatus } from "@/types/payment";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";

const config: Record<PaymentStatus, { label: string; variant: Variant; icon: ReactNode }> = {
  paid: { label: "Paid", variant: "success", icon: <CircleCheck className="size-3" /> },
  pending: { label: "Payment pending", variant: "warning", icon: <Clock className="size-3" /> },
  failed: { label: "Failed", variant: "danger", icon: <TriangleAlert className="size-3" /> },
  refunded: { label: "Refunded", variant: "neutral", icon: <Undo2 className="size-3" /> },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, variant, icon } = config[status];
  return (
    <Badge variant={variant} icon={icon}>
      {label}
    </Badge>
  );
}