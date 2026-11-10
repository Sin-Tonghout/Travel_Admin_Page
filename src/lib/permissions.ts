import type { Role } from "@/types/auth";

export type AppModule =
  | "dashboard"
  | "bookings"
  | "tours"
  | "destinations"
  | "availability"
  | "customers"
  | "payments"
  | "reviews"
  | "promotions"
  | "reports"
  | "notifications"
  | "staff"
  | "suppliers"
  | "content"
  | "audit"
  | "settings";

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
};

export const roles: Role[] = ["super_admin", "admin", "manager", "staff"];

/**
 * STARTING MATRIX, adjust to your business rules.
 * This only controls what the UI shows. The server must enforce
 * permissions on every protected operation.
 */
const access: Record<AppModule, Role[]> = {
  dashboard: ["super_admin", "admin", "manager", "staff"],
  bookings: ["super_admin", "admin", "manager", "staff"],
  tours: ["super_admin", "admin", "manager"],
  destinations: ["super_admin", "admin", "manager"],
  availability: ["super_admin", "admin", "manager", "staff"],
  customers: ["super_admin", "admin", "manager", "staff"],
  payments: ["super_admin", "admin", "manager"],
  reviews: ["super_admin", "admin", "manager", "staff"],
  promotions: ["super_admin", "admin", "manager"],
  reports: ["super_admin", "admin", "manager"],
  notifications: ["super_admin", "admin", "manager", "staff"],
  staff: ["super_admin", "admin"],
  suppliers: ["super_admin", "admin", "manager"],
  content: ["super_admin", "admin"],
  audit: ["super_admin"],
  settings: ["super_admin", "admin"],
};

export const canAccess = (role: Role, module: AppModule) => access[module].includes(role);