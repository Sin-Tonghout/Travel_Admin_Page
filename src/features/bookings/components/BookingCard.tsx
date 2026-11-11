import { format, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card/Card";
import { BookingRowActions } from "@/features/bookings/components/BookingRowActions";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { formatTravelers } from "@/features/bookings/lib/format";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { formatCurrency } from "@/lib/formatters";
import type { BookingRecord } from "@/types/booking";

interface BookingCardProps {
  booking: BookingRecord;
  onCancel: (booking: BookingRecord) => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer p-4 transition-colors hover:bg-surface-muted/50"
      onClick={() => navigate(`/admin/bookings/${booking.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/admin/bookings/${booking.id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {booking.id}
          </Link>
          <p className="truncate text-sm font-medium">{booking.customer}</p>
          <p className="truncate text-xs text-foreground-muted">{booking.customerEmail}</p>
        </div>
        <BookingRowActions record={booking} onCancel={onCancel} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <BookingStatusBadge status={booking.status} />
        <PaymentStatusBadge status={booking.payment} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="col-span-2">
          <dt className="text-xs text-foreground-muted">Tour</dt>
          <dd className="font-medium">
            {booking.tour} <span className="font-normal text-foreground-muted">· {booking.destination}</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-muted">Travel date</dt>
          <dd className="font-medium">{format(parseISO(booking.date), "MMM d, yyyy")}</dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-muted">Travelers</dt>
          <dd className="font-medium">{formatTravelers(booking.adults, booking.children)}</dd>
        </div>
        <div className="col-span-2 flex items-center justify-between border-t pt-2">
          <dt className="text-xs text-foreground-muted">Total</dt>
          <dd className="font-semibold tabular-nums">{formatCurrency(booking.total)}</dd>
        </div>
      </dl>
    </Card>
  );
}