import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CircleCheck, FileText, Undo2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { customerId } from "@/features/customers/services/customerService";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { PaymentTimeline } from "@/features/payments/components/PaymentTimeline";
import { RefundPanel } from "@/features/payments/components/RefundPanel";
import { useMarkPaymentPaid, usePayment, useRefundPayment } from "@/features/payments/hooks/usePayments";
import { formatDateTime, formatDay, formatMoney } from "@/features/payments/lib/format";
import { methodLabels } from "@/features/payments/lib/methods";
import { ApiError } from "@/services/api-error";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="text-foreground-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

export function PaymentDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: p, isLoading, error, refetch } = usePayment(id);
  const markPaid = useMarkPaymentPaid();
  const refund = useRefundPayment(id);
  const [refunding, setRefunding] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !p) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-10 text-center">
        <h2 className="text-lg font-semibold">{notFound ? "Payment not found" : "Could not load this payment"}</h2>
        <p className="max-w-md text-sm text-foreground-muted">
          {notFound ? "It may have been removed." : error instanceof Error ? error.message : "Something went wrong."}
        </p>
        <div className="flex gap-2">
          {!notFound && <Button onClick={() => refetch()}>Try again</Button>}
          <Button variant="outline" onClick={() => navigate("/admin/payments")}>
            Back to payments
          </Button>
        </div>
      </div>
    );
  }

  const remaining = Math.round((p.amount - p.refundedAmount) * 100) / 100;
  const canRefund = p.status === "paid" && remaining > 0;
  const canMarkPaid = p.status === "pending" || p.status === "failed";
  const hasInvoice = p.status === "paid" || p.status === "refunded";

  const handleMarkPaid = () => {
    if (!window.confirm(`Mark ${p.id} as paid? This verifies the payment for booking ${p.bookingId}.`)) return;
    markPaid.mutate(p.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={p.id}
        description={p.reference}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PaymentStatusBadge status={p.status} />
            {hasInvoice && (
              <Button variant="outline" asChild>
                <Link to={`/admin/payments/${p.id}/invoice`}>
                  <FileText className="size-4" aria-hidden /> Invoice
                </Link>
              </Button>
            )}
            {canMarkPaid && (
              <Button onClick={handleMarkPaid} loading={markPaid.isPending}>
                <CircleCheck className="size-4" aria-hidden /> Mark as paid
              </Button>
            )}
            {canRefund && !refunding && (
              <Button variant="destructive" onClick={() => setRefunding(true)}>
                <Undo2 className="size-4" aria-hidden /> Refund
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {refunding && canRefund && (
            <RefundPanel
              payment={p}
              submitting={refund.isPending}
              onCancel={() => setRefunding(false)}
              onSubmit={(input) => {
                if (!window.confirm(`Refund ${formatMoney(input.amount)} to ${p.customer}? This can't be undone.`)) return;
                refund.mutate(input, { onSuccess: () => setRefunding(false) });
              }}
            />
          )}

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold">Payment</h2>
            <dl className="mt-2 divide-y divide-border">
              <Row label="Amount">{formatMoney(p.amount)}</Row>
              {p.refundedAmount > 0 && <Row label="Refunded">− {formatMoney(p.refundedAmount)}</Row>}
              <Row label="Net received">{p.status === "paid" || p.status === "refunded" ? formatMoney(p.amount - p.refundedAmount) : "—"}</Row>
              <Row label="Method">{methodLabels[p.method]}</Row>
              <Row label="Reference">{p.reference}</Row>
              <Row label={p.status === "paid" || p.status === "refunded" ? "Paid on" : "Created on"}>{formatDateTime(p.date)}</Row>
            </dl>
          </section>

          {p.refunds.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-semibold">Refunds</h2>
              <ul className="mt-3 divide-y divide-border">
                {p.refunds.map((r) => (
                  <li key={r.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{r.reason}</p>
                      <p className="text-xs text-foreground-muted">
                        {formatDateTime(r.at)} · {r.actor}
                      </p>
                    </div>
                    <p className="font-semibold tabular-nums">− {formatMoney(r.amount)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-base font-semibold">Transaction history</h2>
            <PaymentTimeline events={p.timeline} />
          </section>
        </div>

        <aside className="space-y-6 lg:self-start">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold">Booking</h2>
            <dl className="mt-2 divide-y divide-border">
              <Row label="Booking">
                <Link to={`/admin/bookings/${p.bookingId}`} className="text-primary hover:underline">
                  {p.bookingId}
                </Link>
              </Row>
              <Row label="Status">
                <BookingStatusBadge status={p.bookingStatus} />
              </Row>
              <Row label="Tour">{p.tour}</Row>
              <Row label="Travel date">{formatDay(p.travelDate)}</Row>
              <Row label="Travelers">
                {p.adults} {p.adults === 1 ? "adult" : "adults"}
                {p.children > 0 && `, ${p.children} ${p.children === 1 ? "child" : "children"}`}
              </Row>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold">Customer</h2>
            <dl className="mt-2 divide-y divide-border">
              <Row label="Name">
                <Link to={`/admin/customers/${customerId(p.customerEmail)}`} className="text-primary hover:underline">
                  {p.customer}
                </Link>
              </Row>
              <Row label="Email">
                <a href={`mailto:${p.customerEmail}`} className="break-all text-primary hover:underline">
                  {p.customerEmail}
                </a>
              </Row>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}