import { format, parseISO } from "date-fns";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { DashCard, ViewAllLink } from "@/features/dashboard/components/DashCard";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { useCurrentUser } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/formatters";
import { canAccess } from "@/lib/permissions";
import type { Booking } from "@/types/booking";
import type { ActivityEntry, CustomerSignup } from "@/types/dashboard";

export function RecentBookingsCard({ bookings, className }: { bookings: Booking[]; className?: string }) {
  const user = useCurrentUser();

  return (
    <DashCard
      title="Recent bookings"
      description="Latest reservations, newest first"
      className={className}
      action={canAccess(user.role, "bookings") ? <ViewAllLink to="/admin/bookings" label="View all" /> : undefined}
    >
      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="New reservations will appear here." />
      ) : (
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-foreground-muted">
                <th scope="col" className="py-2 pr-4 font-semibold">Booking</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Customer</th>
                <th scope="col" className="hidden py-2 pr-4 font-semibold md:table-cell">Travel date</th>
                <th scope="col" className="hidden py-2 pr-4 text-right font-semibold sm:table-cell">Total</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
                <th scope="col" className="hidden py-2 font-semibold lg:table-cell">Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-semibold">{b.id}</td>
                  <td className="py-3 pr-4">
                    <span className="block font-medium">{b.customer}</span>
                    <span className="block max-w-48 truncate text-xs text-foreground-muted">{b.tour}</span>
                  </td>
                  <td className="hidden py-3 pr-4 md:table-cell">{format(parseISO(b.date), "MMM d")}</td>
                  <td className="hidden py-3 pr-4 text-right font-semibold tabular-nums sm:table-cell">
                    {formatCurrency(b.total)}
                  </td>
                  <td className="py-3 pr-4">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="hidden py-3 lg:table-cell">
                    <PaymentStatusBadge status={b.payment} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashCard>
  );
}

export function RecentCustomersCard({ customers }: { customers: CustomerSignup[] }) {
  const user = useCurrentUser();

  return (
    <DashCard
      title="New customers"
      description="Latest registrations"
      action={canAccess(user.role, "customers") ? <ViewAllLink to="/admin/customers" label="View all" /> : undefined}
    >
      {customers.length === 0 ? (
        <EmptyState title="No new customers" description="Registrations will appear here." />
      ) : (
        <ul className="divide-y">
          {customers.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar name={c.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="truncate text-xs text-foreground-muted">{c.email}</p>
              </div>
              <span className="shrink-0 text-xs text-foreground-muted">{c.joined}</span>
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  );
}

export function RecentActivityCard({ entries }: { entries: ActivityEntry[] }) {
  const user = useCurrentUser();

  return (
    <DashCard
      title="Recent admin activity"
      description="What your team changed lately"
      action={canAccess(user.role, "audit") ? <ViewAllLink to="/admin/audit-logs" label="Audit logs" /> : undefined}
    >
      {entries.length === 0 ? (
        <EmptyState title="No recent activity" description="Admin actions will appear here." />
      ) : (
        <ul className="grid gap-x-10 lg:grid-cols-2">
          {entries.map((a) => (
            <li key={a.id} className="flex items-start gap-3 border-b py-3 last:border-0">
              <Avatar name={a.actor} size="sm" />
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">{a.actor}</span> {a.action}{" "}
                <span className="font-semibold">{a.target}</span>
              </p>
              <span className="shrink-0 text-xs text-foreground-muted">{a.time}</span>
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  );
}