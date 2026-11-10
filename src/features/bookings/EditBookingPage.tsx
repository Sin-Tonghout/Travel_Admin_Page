import { Lock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { BookingForm } from "@/features/bookings/components/BookingForm";
import { BookingLoadError } from "@/features/bookings/components/BookingLoadError";
import { useBooking, useUpdateBooking } from "@/features/bookings/hooks/useBookings";
import { isEditable } from "@/features/bookings/lib/workflow";

export function EditBookingPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError, error, refetch } = useBooking(id);
  const update = useUpdateBooking(id);

  if (isLoading) {
    return (
      <div role="status" className="space-y-4">
        <span className="sr-only">Loading booking…</span>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (isError || !booking) return <BookingLoadError error={error} onRetry={() => refetch()} />;

  if (!isEditable(booking)) {
    return (
      <EmptyState
        icon={<Lock />}
        title="This booking can't be edited"
        description={`Bookings that are ${booking.status} are read-only.`}
        action={
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/bookings/${booking.id}`}>Back to booking</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader title={`Edit booking ${booking.id}`} description={`${booking.customer} · ${booking.tour}`} />
      <BookingForm
        mode="edit"
        initial={booking}
        cancelTo={`/admin/bookings/${booking.id}`}
        isSubmitting={update.isPending}
        onSubmit={(input) => update.mutate(input, { onSuccess: () => navigate(`/admin/bookings/${booking.id}`) })}
      />
    </>
  );
}