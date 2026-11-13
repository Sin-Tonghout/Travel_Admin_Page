import { CustomerStatusBadge } from "@/features/customers/components/CustomerStatusBadge";
import { formatDay, formatMoney } from "@/features/customers/lib/format";
import type { CustomerListItem } from "@/types/customer";

export function CustomerCard({ customer }: { customer: CustomerListItem }) {
  return (
    <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">{customer.name}</p>
          <p className="truncate text-xs text-text-secondary">{customer.email}</p>
        </div>
        <CustomerStatusBadge status={customer.status} />
      </div>
      <dl className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-text-secondary">Bookings</dt>
          <dd className="font-medium text-text-primary">{customer.bookingCount}</dd>
        </div>
        <div>
          <dt className="text-text-secondary">Spent</dt>
          <dd className="font-medium tabular-nums text-text-primary">{formatMoney(customer.totalSpent)}</dd>
        </div>
        <div>
          <dt className="text-text-secondary">Last booking</dt>
          <dd className="font-medium text-text-primary">{formatDay(customer.lastBookingAt)}</dd>
        </div>
      </dl>
    </div>
  );
}