import { BookingsChart } from "@/components/ui/charts/BookingsChart";
import { ChartCard } from "@/components/ui/charts/ChartCard";
import { RevenueChart } from "@/components/ui/charts/RevenueChart";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import type { ResolvedRange } from "@/features/dashboard/lib/date-range";
import { formatCurrency } from "@/lib/formatters";
import type { SeriesPoint } from "@/types/dashboard";

interface TrendProps {
  series: SeriesPoint[];
  range: ResolvedRange;
}

export function RevenueTrendCard({ series, range }: TrendProps) {
  const total = series.reduce((sum, p) => sum + p.revenue, 0);
  return (
    <ChartCard title="Revenue" description={`${range.label} · ${range.text}`}>
      {series.length === 0 ? (
        <EmptyState title="No revenue in this period" description="Try a different date range." />
      ) : (
        <>
          <p className="sr-only">
            Revenue chart for {range.text}. Total: {formatCurrency(total)}.
          </p>
          <RevenueChart data={series} />
        </>
      )}
    </ChartCard>
  );
}

export function BookingsTrendCard({ series, range }: TrendProps) {
  const total = series.reduce((sum, p) => sum + p.bookings, 0);
  return (
    <ChartCard title="Booking trends" description={`${range.label} · ${range.text}`}>
      {series.length === 0 ? (
        <EmptyState title="No bookings in this period" description="Try a different date range." />
      ) : (
        <>
          <p className="sr-only">
            Bookings chart for {range.text}. Total: {new Intl.NumberFormat().format(total)} bookings.
          </p>
          <BookingsChart data={series} />
        </>
      )}
    </ChartCard>
  );
}