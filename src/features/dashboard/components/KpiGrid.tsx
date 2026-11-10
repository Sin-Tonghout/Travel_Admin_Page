import { CalendarCheck, CalendarDays, CircleCheck, CircleX, Clock, DollarSign } from "lucide-react";
import type { ReactNode } from "react";
import { StatCard } from "@/components/shared/StatCard";
import type { StatDelta } from "@/components/shared/StatCard";
import { comparisonLabel } from "@/features/dashboard/lib/date-range";
import type { ResolvedRange } from "@/features/dashboard/lib/date-range";
import { useCurrentUser } from "@/hooks/useAuth";
import { formatCurrency, formatPercentDelta } from "@/lib/formatters";
import { canAccess } from "@/lib/permissions";
import type { DashboardData, Kpi } from "@/types/dashboard";

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

function makeDelta(kpi: Kpi, higherIsBetter = true): StatDelta | undefined {
  const value = formatPercentDelta(kpi.value, kpi.previous);
  if (!value) return undefined;
  const trend = kpi.value >= kpi.previous ? "up" : "down";
  return { value, trend, good: higherIsBetter ? trend === "up" : trend === "down" };
}

interface Card {
  key: string;
  label: string;
  value: string;
  icon: ReactNode;
  delta?: StatDelta;
  period: string;
}

export function KpiGrid({ kpis, range }: { kpis: DashboardData["kpis"]; range: ResolvedRange }) {
  const user = useCurrentUser();
  const showMoney = canAccess(user.role, "payments");
  const vs = comparisonLabel(range);

  const cards: Card[] = [
    { key: "total", label: "Total bookings", value: formatNumber(kpis.totalBookings.value), icon: <CalendarCheck />, delta: makeDelta(kpis.totalBookings), period: vs },
    { key: "today", label: "Today's bookings", value: formatNumber(kpis.todayBookings.value), icon: <CalendarDays />, delta: makeDelta(kpis.todayBookings), period: "vs yesterday" },
    ...(showMoney
      ? [
          { key: "revenue", label: "Total revenue", value: formatCurrency(kpis.revenue.value), icon: <DollarSign />, delta: makeDelta(kpis.revenue), period: vs },
          { key: "pending", label: "Pending payments", value: formatCurrency(kpis.pendingPayments.value), icon: <Clock />, delta: makeDelta(kpis.pendingPayments, false), period: vs },
        ]
      : []),
    { key: "confirmed", label: "Confirmed bookings", value: formatNumber(kpis.confirmedBookings.value), icon: <CircleCheck />, delta: makeDelta(kpis.confirmedBookings), period: vs },
    { key: "cancelled", label: "Cancelled bookings", value: formatNumber(kpis.cancelledBookings.value), icon: <CircleX />, delta: makeDelta(kpis.cancelledBookings, false), period: vs },
  ];

  return (
    <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => (
        <StatCard key={c.key} label={c.label} value={c.value} icon={c.icon} delta={c.delta} period={c.period} />
      ))}
    </section>
  );
}