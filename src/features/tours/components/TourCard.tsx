import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card/Card";
import { TourRowActions } from "@/features/tours/components/TourRowActions";
import { TourStatusBadge } from "@/features/tours/components/TourStatusBadge";
import { TourThumb } from "@/features/tours/components/TourThumb";
import { categoryLabel } from "@/features/tours/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import type { TourListItem } from "@/types/tour";

export function TourCard({ tour, onDelete }: { tour: TourListItem; onDelete: (tour: TourListItem) => void }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer p-4 transition-colors hover:bg-surface-muted/50"
      onClick={() => navigate(`/admin/tours/${tour.id}`)}
    >
      <div className="flex items-start gap-3">
        <TourThumb key={tour.images[0]?.url} url={tour.images[0]?.url} className="size-16 rounded-md" />
        <div className="min-w-0 flex-1">
          <Link
            to={`/admin/tours/${tour.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block truncate rounded-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {tour.name}
          </Link>
          <p className="text-xs text-foreground-muted">{tour.destination}</p>
          <div className="mt-2">
            <TourStatusBadge published={tour.published} featured={tour.featured} />
          </div>
        </div>
        <TourRowActions tour={tour} onDelete={onDelete} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 text-sm">
        <div>
          <dt className="text-xs text-foreground-muted">Price</dt>
          <dd className="font-semibold tabular-nums">{formatCurrency(tour.price)}</dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-muted">Duration</dt>
          <dd className="font-medium">
            {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-muted">Category</dt>
          <dd className="font-medium">{categoryLabel(tour.category)}</dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-muted">Bookings</dt>
          <dd className="font-medium tabular-nums">{tour.bookingCount}</dd>
        </div>
      </dl>
    </Card>
  );
}