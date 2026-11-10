import { CalendarRange, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/empty-state/EmptyState";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { DateRangeFilter } from "@/features/dashboard/components/DateRangeFilter";
import { KpiGrid } from "@/features/dashboard/components/KpiGrid";
import { QuickActionsCard } from "@/features/dashboard/components/QuickActionsCard";
import { PopularToursCard, TopDestinationsCard } from "@/features/dashboard/components/RankingCards";
import {
  RecentActivityCard,
  RecentBookingsCard,
  RecentCustomersCard,
} from "@/features/dashboard/components/RecentCards";
import { BookingsTrendCard, RevenueTrendCard } from "@/features/dashboard/components/TrendCharts";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { useDashboardRange } from "@/features/dashboard/hooks/useDashboardRange";
import { useCurrentUser } from "@/hooks/useAuth";
import { canAccess } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function DashboardPage() {
  const user = useCurrentUser();
  const showMoney = canAccess(user.role, "payments");
  // Recent admin activity is limited to the roles that manage staff.
  const showActivity = canAccess(user.role, "staff");

  const { range, flags, setPreset, setCustom } = useDashboardRange();
  const { data, isLoading, isError, isFetching, refetch } = useDashboard(range, flags);

  let content;
  if (isLoading) {
    content = <DashboardSkeleton />;
  } else if (isError) {
    content = (
      <ErrorState
        title="We couldn't load the dashboard"
        description="Check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  } else if (!data) {
    content = <DashboardSkeleton />;
  } else {
    content = (
      <div aria-busy={isFetching} className={cn("space-y-6 transition-opacity duration-150", isFetching && "opacity-60")}>
        <KpiGrid kpis={data.kpis} range={range} />

        <div className={cn("grid gap-4", showMoney && "xl:grid-cols-2")}>
          {showMoney && <RevenueTrendCard series={data.series} range={range} />}
          <BookingsTrendCard series={data.series} range={range} />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <TopDestinationsCard items={data.topDestinations} range={range} />
          <PopularToursCard items={data.popularTours} range={range} />
          <QuickActionsCard />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <RecentBookingsCard bookings={data.recentBookings} className="xl:col-span-2" />
          <RecentCustomersCard customers={data.recentCustomers} />
        </div>

        {showActivity && <RecentActivityCard entries={data.recentActivity} />}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of bookings, revenue and activity."
        actions={
          <Button
            variant="outline"
            size="sm"
            loading={isFetching}
            leadingIcon={<RefreshCw className="size-4" />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        }
      />

      <div className="mb-6 space-y-3">
        <DateRangeFilter range={range} onPreset={setPreset} onCustom={setCustom} />
        <p aria-live="polite" className="flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
          <CalendarRange className="size-4" />
          <span>
            Showing <strong className="text-foreground">{range.label}</strong>
          </span>
          <span aria-hidden>·</span>
          <span>{range.text}</span>
        </p>
      </div>

      {content}
    </>
  );
}