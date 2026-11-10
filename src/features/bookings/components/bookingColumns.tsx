import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { BookingRowActions } from "@/features/bookings/components/BookingRowActions";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { formatCurrency } from "@/lib/formatters";
import type { BookingRecord } from "@/types/booking";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function buildBookingColumns(onCancel: (booking: BookingRecord) => void): ColumnDef<BookingRecord>[] {
  return [
    {
      accessorKey: "id",
      header: "Booking",
      cell: ({ row }) => (
        <Link
          to={`/admin/bookings/${row.original.id}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {row.original.id}
        </Link>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      accessorFn: (r) => `${r.customer} ${r.customerEmail}`,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.customer}</p>
          <p className="max-w-52 truncate text-xs text-foreground-muted">{row.original.customerEmail}</p>
        </div>
      ),
    },
    {
      id: "tour",
      header: "Tour",
      accessorFn: (r) => `${r.tour} ${r.destination}`,
      cell: ({ row }) => (
        <div>
          <p className="max-w-56 truncate font-medium">{row.original.tour}</p>
          <p className="text-xs text-foreground-muted">{row.original.destination}</p>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Travel date",
      cell: ({ row }) => <span className="whitespace-nowrap">{format(parseISO(row.original.date), "MMM d, yyyy")}</span>,
    },
    {
      id: "travelers",
      header: "Travelers",
      accessorFn: (r) => r.adults + r.children,
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {plural(row.original.adults, "adult")}
          {row.original.children > 0 && ` · ${plural(row.original.children, "child").replace("childs", "children")}`}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => <span className="font-semibold tabular-nums">{formatCurrency(row.original.total)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.payment} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => <BookingRowActions record={row.original} onCancel={onCancel} />,
    },
  ];
}