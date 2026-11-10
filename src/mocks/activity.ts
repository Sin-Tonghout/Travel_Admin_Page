import type { ActivityEntry } from "@/types/dashboard";

export const recentActivity: ActivityEntry[] = [
  { id: "a1", actor: "Jordan Lee", action: "confirmed booking", target: "BK-1003", time: "8 min ago" },
  { id: "a2", actor: "Sam Rivera", action: "updated pricing for", target: "Kulen Mountain", time: "25 min ago" },
  { id: "a3", actor: "Casey Park", action: "cancelled booking", target: "BK-1004", time: "1 h ago" },
  { id: "a4", actor: "Alex Morgan", action: "published tour", target: "Beng Mealea Explorer", time: "3 h ago" },
  { id: "a5", actor: "Jordan Lee", action: "issued a refund for", target: "BK-1004", time: "3 h ago" },
  { id: "a6", actor: "Sam Rivera", action: "added destination", target: "Kep", time: "Yesterday" },
];