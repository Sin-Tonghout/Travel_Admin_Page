import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { PaymentStatusBadge } from "@/features/payments/components/PaymentStatusBadge";
import { methodLabels } from "@/features/payments/lib/methods";
import { formatCurrency } from "@/lib/formatters";
import type { PaymentRecord } from "@/types/payment";

/**
 * Which columns stay as the window narrows:
 *   always:    Payment, Customer, Amount, Status
 *   ≥ 768px:   + Date
 *   ≥ 1024px:  + Booking
 *   ≥ 1280px:  + Method
 * Below 640px the page shows cards instead of this table.
 */
export function buildPaymentColumns(): ColumnDef<PaymentRecord>[] {
  return [
    {
      id: "payment",
      header: "Payment",
      accessorFn: (r) => `${r.id} ${r.reference} ${r.bookingId}`,
      cell: ({ row }) => (
        <div>
          <Link
            to={`/admin/payments/${row.original.id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {row.original.id}
          </Link>
          <p className="text-xs text-foreground-muted">{row.original.reference}</p>
        </div>
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
      accessorKey: "bookingId",
      header: "Booking",
      meta: { className: "hidden lg:table-cell" },
      cell: ({ row }) => (
        <Link
          to={`/admin/bookings/${row.original.bookingId}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {row.original.bookingId}
        </Link>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      meta: { className: "hidden xl:table-cell" },
      cell: ({ row }) => <span className="whitespace-nowrap">{methodLabels[row.original.method]}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      meta: { className: "hidden md:table-cell" },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{format(parseISO(row.original.date), "MMM d, yyyy")}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-semibold tabular-nums">{formatCurrency(row.original.amount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
  ];
}