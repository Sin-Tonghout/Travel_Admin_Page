import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { formatCurrency } from "@/lib/formatters";
import type { PaymentStatus, PaymentSummary } from "@/types/payment";

const tiles: { status: PaymentStatus; label: string }[] = [
  { status: "paid", label: "Collected" },
  { status: "pending", label: "Awaiting payment" },
  { status: "failed", label: "Failed" },
  { status: "refunded", label: "Refunded" },
];

export function PaymentSummaryCards({ summary, loading }: { summary?: PaymentSummary; loading: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map(({ status, label }) => {
        const tile = summary?.byStatus[status];
        return (
          <div key={status} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-foreground-muted">{label}</p>
            {loading || !tile ? (
              <>
                <Skeleton className="mt-2 h-7 w-24" />
                <Skeleton className="mt-2 h-4 w-16" />
              </>
            ) : (
              <>
                <p className="mt-1 text-xl font-semibold tabular-nums">{formatCurrency(tile.amount)}</p>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {tile.count} {tile.count === 1 ? "payment" : "payments"}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}