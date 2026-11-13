import { format, parseISO } from "date-fns";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { methodLabels } from "@/features/payments/lib/methods";
import { formatCurrency } from "@/lib/formatters";
import type { PaymentRecord } from "@/types/payment";

export function PaymentCard({ payment }: { payment: PaymentRecord }) {
  return (
    <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-primary">{payment.id}</p>
          <p className="truncate text-sm font-medium">{payment.customer}</p>
          <p className="truncate text-xs text-foreground-muted">{payment.customerEmail}</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>
      <dl className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-foreground-muted">Amount</dt>
          <dd className="font-semibold tabular-nums">{formatCurrency(payment.amount)}</dd>
        </div>
        <div>
          <dt className="text-foreground-muted">Method</dt>
          <dd className="font-medium">{methodLabels[payment.method]}</dd>
        </div>
        <div>
          <dt className="text-foreground-muted">Date</dt>
          <dd className="font-medium">{format(parseISO(payment.date), "MMM d, yyyy")}</dd>
        </div>
      </dl>
    </div>
  );
}