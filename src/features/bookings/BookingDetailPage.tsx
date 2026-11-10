import { format, parseISO } from "date-fns";
import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/Card";
import { Divider } from "@/components/ui/divider/Divider";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { BookingLoadError } from "@/features/bookings/components/BookingLoadError";
import { BookingStatusActions } from "@/features/bookings/components/BookingStatusActions";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { BookingTimeline } from "@/features/bookings/components/BookingTimeline";
import { CancelBookingDialog } from "@/features/bookings/components/CancelBookingDialog";
import { PriceBreakdown } from "@/features/bookings/components/PriceBreakdown";
import { TravelerInfo } from "@/features/bookings/components/TravelerInfo";
import { useBooking, useMarkBookingPaid } from "@/features/bookings/hooks/useBookings";
import { priceForBooking } from "@/features/bookings/lib/pricing";
import { isEditable } from "@/features/bookings/lib/workflow";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import type { BookingRecord } from "@/types/booking";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading booking…</span>
      <Skeleton className="h-10 w-72" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    </div>
  );
}

export function BookingDetailPage() {
  const { id = "" } = useParams();
  const { data: booking, isLoading, isError, error, refetch } = useBooking(id);
  const markPaid = useMarkBookingPaid();
  const [cancelTarget, setCancelTarget] = useState<BookingRecord | null>(null);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !booking) return <BookingLoadError error={error} onRetry={() => refetch()} />;

  const cancelEvent = [...booking.history].reverse().find((e) => e.title === "Booking cancelled");
  const lastUpdate = [...booking.history].sort((a, b) => b.at.localeCompare(a.at))[0];
  const canMarkPaid = booking.status !== "cancelled" && (booking.payment === "pending" || booking.payment === "failed");

  return (
    <>
      <PageHeader
        title={`Booking ${booking.id}`}
        description={`${booking.customer} · ${booking.tour}`}
        actions={
          isEditable(booking) ? (
            <Button asChild variant="outline">
              <Link to={`/admin/bookings/${booking.id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
          ) : undefined
        }
      />

      {booking.status === "cancelled" && (
        <Alert variant="danger" title="This booking was cancelled" className="mb-6">
          {cancelEvent?.detail ?? "No reason was recorded."}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Trip details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <Detail label="Tour">{booking.tour}</Detail>
                <Detail label="Destination">{booking.destination}</Detail>
                <Detail label="Travel date">{format(parseISO(booking.date), "EEEE, MMM d, yyyy")}</Detail>
                <Detail label="Booked on">{format(parseISO(booking.createdAt), "MMM d, yyyy · h:mm a")}</Detail>
                <div className="sm:col-span-2">
                  <Detail label="Notes">{booking.notes || <span className="font-normal text-foreground-muted">No notes</span>}</Detail>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <TravelerInfo
                name={booking.customer}
                email={booking.customerEmail}
                phone={booking.customerPhone}
                adults={booking.adults}
                children={booking.children}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <BookingStatusBadge status={booking.status} />
                <PaymentStatusBadge status={booking.payment} />
              </div>
              {lastUpdate && (
                <p className="text-xs text-foreground-muted">
                  Last updated <time dateTime={lastUpdate.at}>{format(parseISO(lastUpdate.at), "MMM d, yyyy · h:mm a")}</time>
                </p>
              )}
              <Divider />
              <BookingStatusActions booking={booking} onCancel={() => setCancelTarget(booking)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price & payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PriceBreakdown summary={priceForBooking(booking)} />
              <Divider />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PaymentStatusBadge status={booking.payment} />
                {canMarkPaid && (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={markPaid.isPending}
                    onClick={() => markPaid.mutate(booking.id)}
                  >
                    Mark as paid
                  </Button>
                )}
              </div>
              {booking.payment === "failed" && booking.status !== "cancelled" && (
                <Alert variant="danger" title="Payment failed">
                  Contact the customer, then mark it as paid once the money arrives.
                </Alert>
              )}
              {booking.status === "cancelled" && booking.payment === "paid" && (
                <Alert variant="warning" title="Refund needed">
                  This cancelled booking was paid. Issue a refund from Payments.
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTimeline events={booking.history} />
            </CardContent>
          </Card>
        </div>
      </div>

      <CancelBookingDialog booking={cancelTarget} onClose={() => setCancelTarget(null)} />
    </>
  );
}