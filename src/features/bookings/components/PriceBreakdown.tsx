import { Divider } from "@/components/ui/divider/Divider";
import { NumericText } from "@/components/ui/typography/Typography";
import type { PriceSummary } from "@/features/bookings/lib/pricing";
import { formatCurrency } from "@/lib/formatters";

export function PriceBreakdown({ summary }: { summary: PriceSummary }) {
  if (summary.lines.length === 0) {
    return <p className="text-sm text-foreground-muted">Choose a tour and add travelers to see the price.</p>;
  }

  return (
    <div>
      <dl className="space-y-2 text-sm">
        {summary.lines.map((line) => (
          <div key={line.label} className="flex items-start justify-between gap-3">
            <dt className="text-foreground-muted">
              {line.label}{" "}
              <span className="whitespace-nowrap">
                ({line.quantity} × {formatCurrency(line.unitPrice)})
              </span>
            </dt>
            <dd className="font-semibold tabular-nums">{formatCurrency(line.amount)}</dd>
          </div>
        ))}
      </dl>
      <Divider className="my-3" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Total</span>
        <NumericText className="text-xl">{formatCurrency(summary.total)}</NumericText>
      </div>
    </div>
  );
}