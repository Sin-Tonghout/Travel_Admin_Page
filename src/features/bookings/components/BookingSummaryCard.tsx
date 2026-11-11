import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { Check, ChevronDown, ChevronRight, ImageOff, Info, Mail } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card/Card";
import { useChangeBookingStatus, useMarkBookingPaid } from "@/features/bookings/hooks/useBookings";
import { priceForBooking } from "@/features/bookings/lib/pricing";
import { isEditable, transitionBlocker } from "@/features/bookings/lib/workflow";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { tours } from "@/mocks/tours";
import type { BookingRecord } from "@/types/booking";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function TourImage({ tourId, className }: { tourId: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative shrink-0 overflow-hidden bg-surface-muted", className)}>
      {failed ? (
        <div className="flex size-full items-center justify-center text-foreground-muted">
          <ImageOff aria-hidden className="size-5" />
        </div>
      ) : (
        <img
          src={`https://picsum.photos/seed/travel-${tourId}/640/360`}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}

function ExpandRow({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="rounded-lg border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span className="min-w-0">
          <span className="block text-sm font-bold">{title}</span>
          <span className="block truncate text-xs text-foreground-muted">{sub}</span>
        </span>
        <ChevronDown className={cn("size-5 shrink-0 text-foreground-muted transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div id={id} className="space-y-3 border-t px-4 py-3 text-sm">
          {children}
        </div>
      )}
    </div>
  );
}

interface BookingSummaryCardProps {
  booking: BookingRecord;
  onCancel: () => void;
}

export function BookingSummaryCard({ booking, onCancel }: BookingSummaryCardProps) {
  const change = useChangeBookingStatus();
  const markPaid = useMarkBookingPaid();
  const tour = tours.find((t) => t.id === booking.tourId);
  const summary = priceForBooking(booking);

  const editable = isEditable(booking);
  const next = booking.status === "pending" ? "confirmed" : "completed";
  const blocker = editable ? transitionBlocker(booking, next) : null;
  const canMarkPaid = booking.status !== "cancelled" && (booking.payment === "pending" || booking.payment === "failed");
  const travelers = booking.adults + booking.children;
  const days = tour?.durationDays;

  return (
    <Card className="overflow-hidden">
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-bold leading-snug">{booking.tour}</h2>
        <p className="mt-0.5 text-sm text-foreground-muted">
          {booking.destination}
          {days ? ` · ${plural(days, "day", "days")}` : ""} · {plural(travelers, "traveler", "travelers")}
        </p>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <TourImage tourId={booking.tourId} className="size-11 rounded-md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Booking {booking.id}</p>
            <p className="truncate text-xs text-foreground-muted">
              Travel date {format(parseISO(booking.date), "EEE, MMM d, yyyy")}
            </p>
          </div>
        </div>

        <ExpandRow title="Tour overview" sub={tour?.name ?? booking.tour}>
          <TourImage tourId={booking.tourId} className="aspect-video w-full rounded-md" />
          <p className="leading-relaxed">{tour?.description ?? "No description available for this tour."}</p>
        </ExpandRow>

        <ExpandRow title="What's included" sub={tour ? plural(tour.highlights.length, "highlight", "highlights") : "Not available"}>
          {tour && tour.highlights.length > 0 ? (
            <ul className="space-y-1.5">
              {tour.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                  {h}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-foreground-muted">No highlights listed.</p>
          )}
        </ExpandRow>

        <dl className="space-y-1.5 pt-2 text-sm">
          {summary.lines.map((line) => (
            <div key={line.label} className="flex items-center justify-between gap-3">
              <dt className="text-foreground-muted">
                {line.quantity} × {line.label}
              </dt>
              <dd className="tabular-nums">{formatCurrency(line.amount)}</dd>
            </div>
          ))}
        </dl>

        <div className="flex items-baseline justify-between border-t pt-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold tabular-nums">{formatCurrency(summary.total)}</span>
        </div>

        {editable ? (
          <div className="space-y-3">
            {canMarkPaid && (
              <Button
                variant="outline"
                fullWidth
                loading={markPaid.isPending}
                onClick={() => markPaid.mutate(booking.id)}
              >
                Mark payment as paid
              </Button>
            )}

            {/* Swap the two highlight classes for "bg-primary text-primary-foreground hover:bg-primary-hover" to use navy. */}
            <Button
              size="lg"
              fullWidth
              className="bg-highlight text-highlight-foreground hover:bg-highlight/90"
              disabled={blocker !== null}
              loading={change.isPending}
              onClick={() => change.mutate({ id: booking.id, next })}
            >
              {booking.status === "pending" ? "Confirm booking" : "Mark as completed"}
            </Button>

            {blocker && (
              <p className="flex items-start gap-1.5 text-xs text-foreground-muted">
                <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                {blocker}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <Link to={`/admin/bookings/${booking.id}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="outline"
                className="border-danger/40 text-danger hover:bg-danger-subtle"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-surface-muted px-4 py-3 text-sm text-foreground-muted">
            This booking is {booking.status}, so no further actions are available.
          </p>
        )}
      </div>
    </Card>
  );
}

export function BookingContactCard({ booking }: { booking: BookingRecord }) {
  const firstName = booking.customer.split(" ")[0];
  const days = differenceInCalendarDays(parseISO(booking.date), new Date());

  return (
    <Card>
      <a
        href={`mailto:${booking.customerEmail}?subject=${encodeURIComponent(`Your booking ${booking.id}`)}`}
        className="flex items-center gap-3 rounded-xl p-4 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Mail aria-hidden className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Contact {firstName} about this trip</span>
          <span className="block truncate text-xs text-foreground-muted">
            {booking.customerEmail}
            {days >= 0 && days <= 7 ? ` · travels ${days === 0 ? "today" : `in ${plural(days, "day", "days")}`}` : ""}
          </span>
        </span>
        <ChevronRight aria-hidden className="size-5 shrink-0 text-foreground-muted" />
      </a>
    </Card>
  );
}