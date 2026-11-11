import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { ErrorState } from "@/components/ui/empty-state/EmptyState";
import { BookingFiltersBar } from "@/features/bookings/components/BookingFiltersBar";
import { buildBookingColumns } from "@/features/bookings/components/bookingColumns";
import { CancelBookingDialog } from "@/features/bookings/components/CancelBookingDialog";
import { useBookingFilters } from "@/features/bookings/hooks/useBookingFilters";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { cn } from "@/lib/utils";
import type { BookingRecord } from "@/types/booking";
import { BookingCard } from "@/features/bookings/components/BookingCard";

const NO_BOOKINGS: BookingRecord[] = [];

export function BookingsPage() {
  const navigate = useNavigate();
  const filterState = useBookingFilters();
  const { data, isLoading, isError, isFetching, refetch } = useBookings(
    filterState.filters,
  );
  const [cancelTarget, setCancelTarget] = useState<BookingRecord | null>(null);
  const columns = useMemo(() => buildBookingColumns(setCancelTarget), []);

  const filtered = filterState.activeCount > 0;

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Review, confirm and manage reservations."
        actions={
          <Button asChild>
            <Link to="/admin/bookings/new">
              <Plus className="size-4" />
              New booking
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <BookingFiltersBar state={filterState} />

        {isError ? (
          <ErrorState
            title="We couldn't load the bookings"
            description="Check your connection and try again."
            onRetry={() => refetch()}
          />
        ) : (
          <div
            aria-busy={isFetching}
            className={cn(
              "transition-opacity duration-150",
              isFetching && !isLoading && "opacity-60",
            )}
          >
            <DataTable<BookingRecord>
              columns={columns}
              data={data ?? NO_BOOKINGS}
              loading={isLoading}
              pageSize={10}
              searchPlaceholder="Search by booking, customer or tour"
              emptyTitle={
                filtered ? "No bookings match these filters" : "No bookings yet"
              }
              emptyDescription={
                filtered
                  ? "Try clearing some filters."
                  : "New reservations will appear here."
              }
              onRowClick={(row: BookingRecord) => navigate(`/admin/bookings/${row.id}`)}
              renderCard={(booking: BookingRecord) => (
                <BookingCard booking={booking} onCancel={setCancelTarget} />
              )}
            />
          </div>
        )}
      </div>

      <CancelBookingDialog booking={cancelTarget} onClose={() => setCancelTarget(null)} />
    </>
  );
}
