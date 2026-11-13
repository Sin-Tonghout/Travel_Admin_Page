import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/ui/empty-state/EmptyState";
import { Select } from "@/components/ui/select/Select";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { AvailabilityCalendar } from "@/features/availability/components/AvailabilityCalendar";
import { DayPanel } from "@/features/availability/components/DayPanel";
import { useAvailabilityParams } from "@/features/availability/hooks/useAvailabilityParams";
import {
  useAvailabilityTours,
  useClearDayAvailability,
  useMonthAvailability,
  useSetDayAvailability,
} from "@/features/availability/hooks/useAvailability";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-medium text-foreground-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function AvailabilityPage() {
  const params = useAvailabilityParams();
  const toursQuery = useAvailabilityTours();
  const tours = toursQuery.data ?? [];
  const tour = tours.find((t) => t.id === params.tour) ?? tours[0];

  const month = useMonthAvailability(tour?.id, params.month);
  const save = useSetDayAvailability(tour?.id ?? "");
  const reset = useClearDayAvailability(tour?.id ?? "");

  const days = month.data;
  const selectedDay = days?.find((d) => d.date === params.date);

  const seats = days?.reduce((sum, d) => sum + (d.blocked ? 0 : d.capacity), 0) ?? 0;
  const booked = days?.reduce((sum, d) => sum + d.booked, 0) ?? 0;
  const blockedCount = days?.filter((d) => d.blocked).length ?? 0;
  const occupancy = seats > 0 ? Math.round((booked / seats) * 100) : 0;

  if (toursQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-520px w-full" />
      </div>
    );
  }

  if (toursQuery.isError) {
    return (
      <ErrorState
        title="We couldn't load the tours"
        description="Check your connection and try again."
        onRetry={() => toursQuery.refetch()}
      />
    );
  }

  if (!tour) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-10 text-center">
        <h2 className="text-lg font-semibold">No published tours</h2>
        <p className="text-sm text-foreground-muted">Publish a tour to manage its availability.</p>
        <Link to="/admin/tours" className="text-sm font-medium text-primary hover:underline">
          Go to tours
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Availability" description="See how full each departure is, and block or resize dates." />

      <div className="space-y-4">
        <div className="w-full max-w-sm">
          <Select
            value={tour.id}
            onValueChange={params.setTour}
            options={tours.map((t) => ({ value: t.id, label: t.name }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Seats booked" value={booked} />
          <Stat label="Seats available" value={seats} />
          <Stat label="Occupancy" value={`${occupancy}%`} />
          <Stat label="Blocked dates" value={blockedCount} />
        </div>

        {month.isError ? (
          <ErrorState
            title="We couldn't load this month"
            description="Check your connection and try again."
            onRetry={() => month.refetch()}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <AvailabilityCalendar
              month={params.month}
              days={days}
              loading={month.isLoading || month.isFetching}
              selected={params.date}
              onSelect={params.setDate}
              onMonthChange={params.setMonth}
            />

            <div className="lg:sticky lg:top-24 lg:self-start">
              {selectedDay ? (
                <DayPanel
                  key={selectedDay.date}
                  day={selectedDay}
                  saving={save.isPending}
                  resetting={reset.isPending}
                  onSave={(input) => save.mutate({ date: selectedDay.date, input })}
                  onReset={() => reset.mutate(selectedDay.date)}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-foreground-muted">
                  Select a date to see its bookings and change its availability.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}