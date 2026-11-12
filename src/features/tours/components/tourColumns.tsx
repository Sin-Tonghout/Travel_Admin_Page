import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { TourRowActions } from "@/features/tours/components/TourRowActions";
import { TourStatusBadge } from "@/features/tours/components/TourStatusBadge";
import { TourThumb } from "@/features/tours/components/TourThumb";
import { categoryLabel } from "@/features/tours/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import type { TourListItem } from "@/types/tour";

/**
 * Columns kept as the window narrows (the sidebar takes space from 1024px up):
 *   always: Tour, Status, Actions   ≥768px: + Duration, Price   ≥1280px: + Category, Bookings   ≥1536px: + Capacity
 * Below 640px the page shows cards instead.
 */
export function buildTourColumns(onDelete: (tour: TourListItem) => void): ColumnDef<TourListItem>[] {
  return [
    {
      id: "name",
      header: "Tour",
      accessorFn: (t) => `${t.name} ${t.destination}`,
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex items-center gap-3">
            <TourThumb key={t.images[0]?.url} url={t.images[0]?.url} className="size-11 rounded-md" />
            <div className="min-w-0">
              <Link
                to={`/admin/tours/${t.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block max-w-64 truncate rounded-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {t.name}
              </Link>
              <p className="text-xs text-foreground-muted">{t.destination}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      meta: { className: "hidden xl:table-cell" },
      cell: ({ row }) => categoryLabel(row.original.category),
    },
    {
      accessorKey: "durationDays",
      header: "Duration",
      meta: { className: "hidden md:table-cell" },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.durationDays} {row.original.durationDays === 1 ? "day" : "days"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      meta: { className: "hidden md:table-cell" },
      cell: ({ row }) => <span className="font-semibold tabular-nums">{formatCurrency(row.original.price)}</span>,
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      meta: { className: "hidden 2xl:table-cell" },
      cell: ({ row }) => <span className="tabular-nums">{row.original.capacity} max</span>,
    },
    {
      accessorKey: "bookingCount",
      header: "Bookings",
      meta: { className: "hidden xl:table-cell" },
      cell: ({ row }) => <span className="tabular-nums">{row.original.bookingCount}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (t) => `${t.published ? "published" : "draft"}${t.featured ? " featured" : ""}`,
      cell: ({ row }) => <TourStatusBadge published={row.original.published} featured={row.original.featured} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => <TourRowActions tour={row.original} onDelete={onDelete} />,
    },
  ];
}