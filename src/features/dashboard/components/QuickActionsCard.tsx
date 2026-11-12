import { ChartColumn, Luggage, MapPin, Plus, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashCard } from "@/features/dashboard/components/DashCard";
import { useCurrentUser } from "@/hooks/useAuth";
import { canAccess } from "@/lib/permissions";
import type { AppModule } from "@/lib/permissions";

interface QuickAction {
  label: string;
  to: string;
  icon: LucideIcon;
  module: AppModule;
}

const actions: QuickAction[] = [
  { label: "New booking", to: "/admin/bookings/new", icon: Plus, module: "bookings" },
  { label: "Add tour", to: "/admin/tours/new", icon: Luggage, module: "tours" },
  { label: "Add destination", to: "/admin/destinations", icon: MapPin, module: "destinations" },
  { label: "Create promotion", to: "/admin/promotions", icon: Tag, module: "promotions" },
  { label: "Open reports", to: "/admin/reports", icon: ChartColumn, module: "reports" },
];

export function QuickActionsCard() {
  const user = useCurrentUser();
  const visible = actions.filter((a) => canAccess(user.role, a.module));
  if (visible.length === 0) return null;

  return (
    <DashCard title="Quick actions" description="Shortcuts to common tasks">
      <ul className="space-y-2">
        {visible.map(({ label, to, icon: Icon }) => (
          <li key={label}>
            <Button asChild variant="outline" fullWidth className="justify-start">
              <Link to={to}>
                <Icon className="size-4" />
                {label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </DashCard>
  );
}