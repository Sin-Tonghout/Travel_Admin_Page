import { formatDateTime } from "@/features/payments/lib/format";
import type { PaymentEvent } from "@/types/payment";

export function PaymentTimeline({ events }: { events: PaymentEvent[] }) {
  return (
    <ol className="space-y-4">
      {events.map((e, i) => (
        <li key={e.id} className="relative flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 size-2.5 rounded-full bg-primary" aria-hidden />
            {i < events.length - 1 && <span className="mt-1 w-px flex-1 bg-border" aria-hidden />}
          </div>
          <div className="pb-1">
            <p className="text-sm font-medium">{e.title}</p>
            {e.detail && <p className="text-sm text-foreground-muted">{e.detail}</p>}
            <p className="text-xs text-foreground-muted">
              {formatDateTime(e.at)} · {e.actor}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}