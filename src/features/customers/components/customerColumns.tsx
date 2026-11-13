import type { ColumnDef } from "@tanstack/react-table";
import { CustomerStatusBadge } from "@/features/customers/components/CustomerStatusBadge";
import { formatDay, formatMoney } from "@/features/customers/lib/format";
import type { CustomerListItem } from "@/types/customer";

export function buildCustomerColumns(): ColumnDef<CustomerListItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-text-primary">{row.original.name}</div>
          <div className="truncate text-xs text-text-secondary">{row.original.email}</div>
        </div>
      ),
    },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => row.original.phone || "—" },
    { accessorKey: "bookingCount", header: "Bookings" },
    {
      accessorKey: "totalSpent",
      header: "Total spent",
      cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.totalSpent)}</span>,
    },
    {
      accessorKey: "lastBookingAt",
      header: "Last booking",
      cell: ({ row }) => formatDay(row.original.lastBookingAt),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CustomerStatusBadge status={row.original.status} />,
    },
  ];
}