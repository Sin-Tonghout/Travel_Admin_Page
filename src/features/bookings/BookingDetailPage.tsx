import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CopyButton } from "@/components/shared/CopyButton";
import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/Tabs";
import { BookingLoadError } from "@/features/bookings/components/BookingLoadError";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { BookingContactCard, BookingSummaryCard } from "@/features/bookings/components/BookingSummaryCard";
import { BookingTimeline } from "@/features/bookings/components/BookingTimeline";
import { CancelBookingDialog } from "@/features/bookings/components/CancelBookingDialog";
import { CollapsibleSection, HeaderPill } from "@/components/shared/CollapsibleSection";
import { PriceBreakdown } from "@/features/bookings/components/PriceBreakdown";
import { FieldGrid, ReadOnlyField, SubHeading } from "@/components/shared/ReadOnlyField";
import { useBooking, useMarkBookingPaid } from "@/features/bookings/hooks/useBookings";
import { priceForBooking } from "@/features/bookings/lib/pricing";
import { isEditable } from "@/features/bookings/lib/workflow";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { formatCurrency } from "@/lib/formatters";
import { tours } from "@/mocks/tours";
import type { BookingRecord } from "@/types/booking";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const link = "text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring";

function DetailSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading booking…</span>
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[34rem] w-full" />
          <Skeleton className="h-20 w-full" />
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

  const tour = tours.find((t) => t.id === booking.tourId);
  const travel = parseISO(booking.date);
  const days = differenceInCalendarDays(travel, new Date());
  const when =
    days === 0 ? "Today" : days > 0 ? `In ${plural(days, "day", "days")}` : `${plural(Math.abs(days), "day", "days")} ago`;
  const lastUpdate = [...booking.history].sort((a, b) => b.at.localeCompare(a.at))[0];
  const cancelEvent = [...booking.history].reverse().find((e) => e.title === "Booking cancelled");
  const canMarkPaid = booking.status !== "cancelled" && (booking.payment === "pending" || booking.payment === "failed");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Booking {booking.id}</h1>
          <CopyButton text={booking.id} label="Copy booking ID" />
        </div>
        <BookingStatusBadge status={booking.status} />
        <PaymentStatusBadge status={booking.payment} />
      </header>

      {booking.status === "cancelled" && (
        <Alert variant="danger" title="This booking was cancelled">
          {cancelEvent?.detail ?? "No reason was recorded."}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* On phones the summary and its actions come first. */}
        <aside className="order-1 space-y-4 lg:sticky lg:top-24 lg:order-2">
          <BookingSummaryCard booking={booking} onCancel={() => setCancelTarget(booking)} />
          <BookingContactCard booking={booking} />
        </aside>

        <div className="order-2 space-y-4 lg:order-1">
          <CollapsibleSection index={1} title="Customer details">
            <SubHeading>Lead traveler</SubHeading>
            <FieldGrid>
              <ReadOnlyField label="Full name">{booking.customer}</ReadOnlyField>
              <ReadOnlyField label="Adults">{booking.adults}</ReadOnlyField>
              <ReadOnlyField label="Children">{booking.children}</ReadOnlyField>
            </FieldGrid>

            <SubHeading className="mt-8">Contact information</SubHeading>
            <FieldGrid cols={2}>
              <ReadOnlyField label="Email address">
                <a href={`mailto:${booking.customerEmail}`} className={link}>
                  {booking.customerEmail}
                </a>
              </ReadOnlyField>
              <ReadOnlyField label="Mobile no">
                <a href={`tel:${booking.customerPhone.replace(/\s/g, "")}`} className={link}>
                  {booking.customerPhone}
                </a>
              </ReadOnlyField>
            </FieldGrid>
          </CollapsibleSection>

          <CollapsibleSection
            index={2}
            title="Trip details"
            headerExtra={
              isEditable(booking) ? (
                <HeaderPill>
                  <Link to={`/admin/bookings/${booking.id}/edit`} className={`inline-flex items-center gap-1.5 font-semibold ${link}`}>
                    <Pencil aria-hidden className="size-3.5" />
                    Edit
                  </Link>
                </HeaderPill>
              ) : undefined
            }
          >
            <SubHeading>Tour</SubHeading>
            <FieldGrid>
              <ReadOnlyField label="Tour">{booking.tour}</ReadOnlyField>
              <ReadOnlyField label="Destination">{booking.destination}</ReadOnlyField>
              <ReadOnlyField label="Duration">{tour ? plural(tour.durationDays, "day", "days") : undefined}</ReadOnlyField>
            </FieldGrid>

            <SubHeading className="mt-8">Schedule</SubHeading>
            <FieldGrid>
              <ReadOnlyField label="Travel date">{format(travel, "EEE, MMM d, yyyy")}</ReadOnlyField>
              <ReadOnlyField label="Countdown">{when}</ReadOnlyField>
              <ReadOnlyField label="Booked on">{format(parseISO(booking.createdAt), "MMM d, yyyy")}</ReadOnlyField>
              {lastUpdate && (
                <ReadOnlyField label="Last updated" className="sm:col-span-3">
                  {format(parseISO(lastUpdate.at), "MMM d, yyyy · h:mm a")}
                </ReadOnlyField>
              )}
            </FieldGrid>

            <SubHeading className="mt-8">Special requests</SubHeading>
            <FieldGrid cols={2}>
              <ReadOnlyField label="Notes" multiline className="sm:col-span-2">
                {booking.notes}
              </ReadOnlyField>
            </FieldGrid>
          </CollapsibleSection>

          <CollapsibleSection
            index={3}
            title="Payment details"
            headerExtra={
              <HeaderPill>
                <PaymentStatusBadge status={booking.payment} />
              </HeaderPill>
            }
          >
            <Tabs defaultValue="payment">
              <TabsList className="mb-6">
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="breakdown">Price breakdown</TabsTrigger>
              </TabsList>

              <TabsContent value="payment" className="space-y-5 pt-0">
                <SubHeading>Payment status</SubHeading>
                <FieldGrid>
                  <ReadOnlyField label="Status">
                    <PaymentStatusBadge status={booking.payment} />
                  </ReadOnlyField>
                  <ReadOnlyField label="Total amount">{formatCurrency(booking.total)}</ReadOnlyField>
                  <ReadOnlyField label="Travelers">
                    {plural(booking.adults + booking.children, "traveler", "travelers")}
                  </ReadOnlyField>
                </FieldGrid>

                {canMarkPaid && (
                  <Button variant="outline" loading={markPaid.isPending} onClick={() => markPaid.mutate(booking.id)}>
                    Mark as paid
                  </Button>
                )}
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
              </TabsContent>

              <TabsContent value="breakdown" className="max-w-md pt-0">
                <PriceBreakdown summary={priceForBooking(booking)} />
              </TabsContent>
            </Tabs>
          </CollapsibleSection>

          <CollapsibleSection index={4} title="Activity" defaultOpen={false}>
            <BookingTimeline events={booking.history} />
          </CollapsibleSection>
        </div>
      </div>

      <CancelBookingDialog booking={cancelTarget} onClose={() => setCancelTarget(null)} />
    </div>
  );
}