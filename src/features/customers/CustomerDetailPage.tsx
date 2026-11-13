import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Ban, Mail, Pencil, Phone, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { CustomerContactForm } from "@/features/customers/components/CustomerContactForm";
import { CustomerStatusBadge } from "@/features/customers/components/CustomerStatusBadge";
import {
  useCustomer,
  useCustomerBookings,
  useSetCustomerStatus,
  useUpdateCustomer,
} from "@/features/customers/hooks/useCustomers";
import { formatDay, formatMoney } from "@/features/customers/lib/format";
import { bookingStatusLabels, paymentOptions } from "@/features/bookings/lib/workflow";
import { ApiError } from "@/services/api-error";
import type { BookingStatus } from "@/types/booking";
import type { PaymentStatus } from "@/types/payment";

const bookingVariant: Record<BookingStatus, "success" | "warning" | "info" | "danger"> = {
  confirmed: "success",
  pending: "warning",
  completed: "info",
  cancelled: "danger",
};
const paymentVariant: Record<PaymentStatus, "success" | "warning" | "info" | "danger"> = {
  paid: "success",
  pending: "warning",
  refunded: "info",
  failed: "danger",
};
const paymentLabel = (p: PaymentStatus) => paymentOptions.find((o) => o.value === p)?.label ?? p;

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-text-primary">{value}</p>
    </div>
  );
}

export function CustomerDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: c, isLoading, error, refetch } = useCustomer(id);
  const history = useCustomerBookings(id);
  const setStatus = useSetCustomerStatus();
  const update = useUpdateCustomer(id);
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !c) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-10 text-center">
        <h2 className="text-lg font-semibold text-text-primary">
          {notFound ? "Customer not found" : "Could not load this customer"}
        </h2>
        <p className="max-w-md text-sm text-text-secondary">
          {notFound ? "They may no longer have any bookings." : error instanceof Error ? error.message : "Something went wrong."}
        </p>
        <div className="flex gap-2">
          {!notFound && <Button onClick={() => refetch()}>Try again</Button>}
          <Button variant="outline" onClick={() => navigate("/admin/customers")}>
            Back to customers
          </Button>
        </div>
      </div>
    );
  }

  const blocked = c.status === "blocked";

  const toggleBlocked = () => {
    if (!blocked && !window.confirm(`Block ${c.name}? You can unblock them at any time.`)) return;
    setStatus.mutate({ id: c.id, status: blocked ? "active" : "blocked" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={c.name}
        description={c.email}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <CustomerStatusBadge status={c.status} />
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="size-4" aria-hidden /> Edit
              </Button>
            )}
            <Button variant={blocked ? "outline" : "destructive"} onClick={toggleBlocked} loading={setStatus.isPending}>
              {blocked ? <UserCheck className="size-4" aria-hidden /> : <Ban className="size-4" aria-hidden />}
              {blocked ? "Unblock" : "Block"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Bookings" value={c.bookingCount} />
        <Stat label="Total spent (paid)" value={formatMoney(c.totalSpent)} />
        <Stat label="First booking" value={formatDay(c.firstBookingAt)} />
        <Stat label="Last booking" value={formatDay(c.lastBookingAt)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-xl border border-border bg-surface">
          <h2 className="border-b border-border px-5 py-4 text-base font-semibold text-text-primary">Booking history</h2>

          {history.isLoading ? (
            <div className="space-y-2 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : history.isError ? (
            <div className="flex items-center justify-between gap-3 p-5 text-sm">
              <span className="text-text-secondary">We couldn't load the booking history.</span>
              <Button size="sm" variant="outline" onClick={() => history.refetch()}>
                Try again
              </Button>
            </div>
          ) : (history.data ?? []).length === 0 ? (
            <p className="p-5 text-sm text-text-secondary">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-text-secondary">
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 font-medium">Booking</th>
                    <th className="px-3 py-2.5 font-medium">Tour</th>
                    <th className="px-3 py-2.5 font-medium">Travel date</th>
                    <th className="px-3 py-2.5 font-medium">Total</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.data!.map((b) => (
                    <tr key={b.id} className="hover:bg-background">
                      <td className="px-5 py-3">
                        <Link to={`/admin/bookings/${b.id}`} className="font-medium text-text-primary underline underline-offset-2">
                          {b.id}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-text-primary">{b.tour}</td>
                      <td className="px-3 py-3 text-text-primary">{formatDay(b.date)}</td>
                      <td className="px-3 py-3 tabular-nums text-text-primary">{formatMoney(b.total)}</td>
                      <td className="px-3 py-3">
                        <Badge variant={bookingVariant[b.status]}>{bookingStatusLabels[b.status]}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={paymentVariant[b.payment]}>{paymentLabel(b.payment)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="space-y-6 lg:self-start">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-base font-semibold text-text-primary">{editing ? "Edit contact" : "Contact"}</h2>
            {editing ? (
              <CustomerContactForm
                customer={c}
                submitting={update.isPending}
                onCancel={() => setEditing(false)}
                onSubmit={(input) => update.mutate(input, { onSuccess: () => setEditing(false) })}
              />
            ) : (
              <>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <Mail className="mt-0.5 size-4 shrink-0 text-text-secondary" aria-hidden />
                    <div>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <a href={`mailto:${c.email}`} className="break-all text-text-primary underline underline-offset-2">
                          {c.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 size-4 shrink-0 text-text-secondary" aria-hidden />
                    <div>
                      <dt className="sr-only">Phone</dt>
                      <dd className="text-text-primary">{c.phone || "No phone number"}</dd>
                    </div>
                  </div>
                </dl>
                <h3 className="mb-1 mt-5 text-sm font-semibold text-text-primary">Internal notes</h3>
                <p className="whitespace-pre-line text-sm text-text-secondary">{c.notes || "No notes yet."}</p>
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}