import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { DestinationRowActions } from "@/features/destinations/components/DestinationRowActions";
import { TourStatusBadge } from "@/features/tours/components/TourStatusBadge";
import { TourThumb } from "@/features/tours/components/TourThumb";
import type { DestinationListItem } from "@/types/destination";

/**
 * Columns kept as the window narrows (the sidebar takes space from 1024px up):
 *   always: Destination, Status, Actions   ≥768px: + Tours   ≥1280px: + Best season   ≥1536px: + Location
 * Below 640px the page shows cards instead.
 */
export function buildDestinationColumns(
  onDelete: (destination: DestinationListItem) => void,
): ColumnDef<DestinationListItem>[] {
  return [
    {
      id: "name",
      header: "Destination",
      accessorFn: (d) => `${d.name} ${d.region}`,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex items-center gap-3">
            <TourThumb key={d.images[0]?.url} url={d.images[0]?.url} className="size-11 rounded-md" />
            <div className="min-w-0">
              <Link
                to={`/admin/destinations/${d.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block max-w-64 truncate rounded-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {d.name}
              </Link>
              <p className="text-xs text-foreground-muted">{d.region}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tourCount",
      header: "Tours",
      meta: { className: "hidden md:table-cell" },
      cell: ({ row }) => <span className="tabular-nums">{row.original.tourCount}</span>,
    },
    {
      accessorKey: "bestSeason",
      header: "Best season",
      meta: { className: "hidden xl:table-cell" },
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.bestSeason || "—"}</span>,
    },
    {
      id: "location",
      header: "Location",
      accessorFn: (d) => `${d.latitude}, ${d.longitude}`,
      meta: { className: "hidden 2xl:table-cell" },
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums text-foreground-muted">
          {row.original.latitude.toFixed(3)}, {row.original.longitude.toFixed(3)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (d) => `${d.published ? "published" : "draft"}${d.featured ? " featured" : ""}`,
      cell: ({ row }) => <TourStatusBadge published={row.original.published} featured={row.original.featured} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => <DestinationRowActions destination={row.original} onDelete={onDelete} />,
    },
  ];
}