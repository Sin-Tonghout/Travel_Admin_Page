import { CheckCheck, CircleCheck, CircleX, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChangeBookingStatus } from "@/features/bookings/hooks/useBookings";
import { isEditable, transitionBlocker } from "@/features/bookings/lib/workflow";
import type { BookingRecord } from "@/types/booking";

export function BookingStatusActions({ booking, onCancel }: { booking: BookingRecord; onCancel: () => void }) {
  const change = useChangeBookingStatus();

  if (!isEditable(booking)) {
    return (
      <p className="text-sm text-foreground-muted">
        This booking is {booking.status}, so no further actions are available.
      </p>
    );
  }

  const blocker =
    booking.status === "pending" ? transitionBlocker(booking, "confirmed") : transitionBlocker(booking, "completed");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {booking.status === "pending" ? (
          <Button
            leadingIcon={<CircleCheck className="size-4" />}
            disabled={blocker !== null}
            loading={change.isPending}
            onClick={() => change.mutate({ id: booking.id, next: "confirmed" })}
          >
            Confirm booking
          </Button>
        ) : (
          <Button
            leadingIcon={<CheckCheck className="size-4" />}
            disabled={blocker !== null}
            loading={change.isPending}
            onClick={() => change.mutate({ id: booking.id, next: "completed" })}
          >
            Mark as completed
          </Button>
        )}
        <Button
          variant="outline"
          leadingIcon={<CircleX className="size-4" />}
          className="border-danger/40 text-danger hover:bg-danger-subtle"
          onClick={onCancel}
        >
          Cancel booking
        </Button>
      </div>
      {blocker && (
        <p className="flex items-start gap-1.5 text-xs text-foreground-muted">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {blocker}
        </p>
      )}
    </div>
  );
}