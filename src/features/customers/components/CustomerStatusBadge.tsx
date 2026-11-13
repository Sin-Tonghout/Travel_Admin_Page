import { Badge } from "@/components/ui/badge/Badge";
import type { CustomerStatus } from "@/types/customer";

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant={status === "active" ? "success" : "danger"}>{status === "active" ? "Active" : "Blocked"}</Badge>;
}