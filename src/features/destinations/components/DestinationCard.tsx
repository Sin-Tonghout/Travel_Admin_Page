import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card/Card";
import { DestinationRowActions } from "@/features/destinations/components/DestinationRowActions";
import { TourStatusBadge } from "@/features/tours/components/TourStatusBadge";
import { TourThumb } from "@/features/tours/components/TourThumb";
import type { DestinationListItem } from "@/types/destination";

interface DestinationCardProps {
  destination: DestinationListItem;
  onDelete: (destination: DestinationListItem) => void;
}

export function DestinationCard({ destination, onDelete }: DestinationCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer p-4 transition-colors hover:bg-surface-muted/50"
      onClick={() => navigate(`/admin/destinations/${destination.id}`)}
    >
      <div className="flex items-start gap-3">
        <TourThumb key={destination.images[0]?.url} url={destination.images[0]?.url} className="size-16 rounded-md" />
        <div className="min-w-0 flex-1">
          <Link
            to={`/admin/destinations/${destination.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block truncate rounded-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {destination.name}
          </Link>
          <p className="text-xs text-foreground-muted">{destination.region}</p>
          <div className="mt-2">
            <TourStatusBadge published={destination.published} featured={destination.featured} />
          </div>
        </div>
        <DestinationRowActions destination={destination} onDelete={onDelete} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 text-sm">
        <div>
          <dt className="text-xs text-foreground-muted">Tours</dt>
          <dd className="font-medium tabular-nums">{destination.tourCount}</dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-muted">Best season</dt>
          <dd className="font-medium">{destination.bestSeason || "—"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-foreground-muted">Location</dt>
          <dd className="font-medium tabular-nums">
            {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}