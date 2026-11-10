import type { ColumnDef } from "@tanstack/react-table";
import { CalendarCheck, CreditCard, DollarSign, Users } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { Alert } from "@/components/ui/alert/Alert";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card/Card";
import { BookingsChart } from "@/components/ui/charts/BookingsChart";
import { ChartCard } from "@/components/ui/charts/ChartCard";
import { RevenueChart } from "@/components/ui/charts/RevenueChart";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState, ErrorState, NoResults } from "@/components/ui/empty-state/EmptyState";
import { ProgressBar } from "@/components/ui/progress/ProgressBar";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast/Toaster";
import { Panel, Section } from "@/features/design-system/components/Section";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { formatCurrency } from "@/lib/formatters";
import { bookings, bookingsSeries, revenueSeries } from "@/mocks/bookings";
import type { Booking, BookingStatus } from "@/types/booking";
import type { PaymentStatus } from "@/types/payment";

const columns: ColumnDef<Booking>[] = [
  { accessorKey: "id", header: "Booking" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "tour", header: "Tour" },
  { accessorKey: "date", header: "Travel date" },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span className="font-semibold tabular-nums">{formatCurrency(row.original.total)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => <PaymentStatusBadge status={row.original.payment} />,
  },
];

const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
const paymentStatuses: PaymentStatus[] = ["paid", "pending", "failed", "refunded"];
const badgeVariants = ["neutral", "primary", "accent", "success", "warning", "danger", "info", "outline"] as const;

export function DataDisplaySection() {
  const [loading, setLoading] = useState(false);

  return (
    <Section
      id="data"
      title="Data display"
      description="Cards, stat cards, badges, tables, charts, alerts, and the loading, empty and error states."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value="$128,450" icon={<DollarSign />} delta={{ value: "+12.4%", trend: "up" }} period="vs last 30 days" />
        <StatCard label="Bookings" value="1,284" icon={<CalendarCheck />} delta={{ value: "+8.1%", trend: "up" }} period="vs last 30 days" />
        <StatCard label="Pending payments" value="$6,240" icon={<CreditCard />} delta={{ value: "-3.2%", trend: "down" }} period="vs last 30 days" />
        <StatCard label="New customers" value="214" icon={<Users />} delta={{ value: "+5.6%", trend: "up" }} period="vs last 30 days" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Angkor Sunrise Tour</CardTitle>
            <CardDescription>3 days · Siem Reap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-muted">Capacity</span>
              <span className="font-semibold tabular-nums">18 / 24</span>
            </div>
            <ProgressBar value={75} label="Capacity used" />
          </CardContent>
          <CardFooter>
            <Button size="sm">Edit</Button>
            <Button size="sm" variant="ghost">
              Details
            </Button>
          </CardFooter>
        </Card>

        <Card interactive onClick={() => toast("Card clicked")} className="p-5">
          <CardTitle>Interactive card</CardTitle>
          <CardDescription className="mt-1">Lifts slightly on hover. Click it to test.</CardDescription>
        </Card>

        <Card className="space-y-3 p-5">
          <CardTitle>Loading card</CardTitle>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-9 w-full" />
        </Card>
      </div>

      <Panel title="Badges">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {badgeVariants.map((v) => (
              <Badge key={v} variant={v}>
                {v}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {bookingStatuses.map((s) => (
              <BookingStatusBadge key={s} status={s} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {paymentStatuses.map((s) => (
              <PaymentStatusBadge key={s} status={s} />
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Table">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          >
            Simulate loading
          </Button>
        </div>
        <DataTable<Booking>
          columns={columns}
          data={bookings}
          loading={loading}
          pageSize={5}
          searchPlaceholder="Search bookings"
          onRowClick={(row) => toast(`Open ${row.id}`)}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue" description="Last 6 months">
          <RevenueChart data={revenueSeries} />
        </ChartCard>
        <ChartCard title="Bookings" description="Last 6 months">
          <BookingsChart data={bookingsSeries} />
        </ChartCard>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Alert variant="info" title="Information">
          New bookings are reviewed daily.
        </Alert>
        <Alert variant="success" title="Payment verified">
          Transaction matched.
        </Alert>
        <Alert variant="warning" title="Payment pending">
          Awaiting bank transfer.
        </Alert>
        <Alert variant="danger" title="Payment failed">
          Card was declined.
        </Alert>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <EmptyState title="No bookings yet" description="New reservations will appear here." />
        <NoResults onClear={() => toast("Filters cleared")} />
        <ErrorState onRetry={() => toast.info("Retrying…")} />
      </div>
    </Section>
  );
}