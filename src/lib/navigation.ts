import {
  CalendarCheck,
  CalendarDays,
  ChartColumn,
  CreditCard,
  FileText,
  Handshake,
  LayoutDashboard,
  Luggage,
  MapPin,
  Bell,
  ScrollText,
  Settings,
  ShieldCheck,
  Star,
  Tag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { canAccess } from "@/lib/permissions";
import type { AppModule } from "@/lib/permissions";
import type { Role } from "@/types/auth";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  module: AppModule;
  /** Roadmap phase that builds the real page (used by placeholder pages). */
  phase: number;
  /** Second key of the "G then …" navigation shortcut (wired up in 5B). */
  goKey?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, module: "dashboard", phase: 6, goKey: "d" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Bookings", path: "/admin/bookings", icon: CalendarCheck, module: "bookings", phase: 7, goKey: "b" },
      { label: "Tours", path: "/admin/tours", icon: Luggage, module: "tours", phase: 7, goKey: "t" },
      { label: "Destinations", path: "/admin/destinations", icon: MapPin, module: "destinations", phase: 7 },
      { label: "Availability", path: "/admin/availability", icon: CalendarDays, module: "availability", phase: 8 },
    ],
  },
  {
    label: "Customers & revenue",
    items: [
      { label: "Customers", path: "/admin/customers", icon: Users, module: "customers", phase: 7, goKey: "c" },
      { label: "Payments", path: "/admin/payments", icon: CreditCard, module: "payments", phase: 7, goKey: "p" },
      { label: "Reviews", path: "/admin/reviews", icon: Star, module: "reviews", phase: 8 },
      { label: "Promotions", path: "/admin/promotions", icon: Tag, module: "promotions", phase: 8 },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", path: "/admin/reports", icon: ChartColumn, module: "reports", phase: 8 },
      { label: "Notifications", path: "/admin/notifications", icon: Bell, module: "notifications", phase: 8 },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Staff & roles", path: "/admin/staff", icon: ShieldCheck, module: "staff", phase: 8 },
      { label: "Suppliers", path: "/admin/suppliers", icon: Handshake, module: "suppliers", phase: 8 },
      { label: "Content", path: "/admin/content", icon: FileText, module: "content", phase: 8 },
      { label: "Audit logs", path: "/admin/audit-logs", icon: ScrollText, module: "audit", phase: 8 },
      { label: "Settings", path: "/admin/settings", icon: Settings, module: "settings", phase: 8 },
    ],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);

/** Groups and items the given role may see (empty groups are dropped). */
export function getVisibleNav(role: Role): NavGroup[] {
  return navGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => canAccess(role, i.module)) }))
    .filter((g) => g.items.length > 0);
}