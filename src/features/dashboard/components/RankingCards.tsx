import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { ProgressBar } from "@/components/ui/progress/ProgressBar";
import { DashCard, ViewAllLink } from "@/features/dashboard/components/DashCard";
import type { ResolvedRange } from "@/features/dashboard/lib/date-range";
import { useCurrentUser } from "@/hooks/useAuth";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { canAccess } from "@/lib/permissions";
import type { DestinationStat, TourStat } from "@/types/dashboard";

function Rank({ n }: { n: number }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
      {n}
    </span>
  );
}

export function TopDestinationsCard({ items, range }: { items: DestinationStat[]; range: ResolvedRange }) {
  const user = useCurrentUser();
  const max = Math.max(...items.map((d) => d.share), 1);

  return (
    <DashCard
      title="Top destinations"
      description={`${range.label} · by bookings`}
      action={canAccess(user.role, "destinations") ? <ViewAllLink to="/admin/destinations" label="View all" /> : undefined}
    >
      {items.length === 0 ? (
        <EmptyState title="No destination data" description="Bookings will appear here." />
      ) : (
        <ol className="space-y-4">
          {items.map((d, i) => (
            <li key={d.name} className="space-y-1.5">
              <div className="flex items-center gap-3">
                <Rank n={i + 1} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{d.name}</span>
                <span className="text-sm tabular-nums text-foreground-muted">
                  {formatNumber(d.bookings)} · {d.share}%
                </span>
              </div>
              <ProgressBar value={(d.share / max) * 100} label={`${d.name}: ${d.share}% of bookings`} />
            </li>
          ))}
        </ol>
      )}
    </DashCard>
  );
}

export function PopularToursCard({ items, range }: { items: TourStat[]; range: ResolvedRange }) {
  const user = useCurrentUser();
  const showMoney = canAccess(user.role, "payments");

  return (
    <DashCard
      title="Popular tours"
      description={`${range.label} · by bookings`}
      action={canAccess(user.role, "tours") ? <ViewAllLink to="/admin/tours" label="View all" /> : undefined}
    >
      {items.length === 0 ? (
        <EmptyState title="No tour data" description="Bookings will appear here." />
      ) : (
        <ol className="divide-y">
          {items.map((t, i) => (
            <li key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Rank n={i + 1} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <p className="flex items-center gap-1 text-xs text-foreground-muted">
                  <span className="truncate">{t.destination}</span>
                  <span aria-hidden>·</span>
                  <Star aria-hidden className="size-3 shrink-0 fill-highlight text-highlight" />
                  <span>
                    {t.rating.toFixed(1)}
                    <span className="sr-only"> out of 5</span>
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{formatNumber(t.bookings)}</p>
                <p className="text-xs tabular-nums text-foreground-muted">
                  {showMoney ? formatCurrency(t.revenue) : "bookings"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </DashCard>
  );
}