import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { ErrorState } from "@/components/ui/empty-state/EmptyState";
import { buildCustomerColumns } from "@/features/customers/components/customerColumns";
import { CustomerCard } from "@/features/customers/components/CustomerCard";
import { CustomerFiltersBar } from "@/features/customers/components/CustomerFiltersBar";
import { useCustomerFilters } from "@/features/customers/hooks/useCustomerFilters";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { cn } from "@/lib/utils";
import type { CustomerListItem } from "@/types/customer";

const NO_CUSTOMERS: CustomerListItem[] = [];

export function CustomersPage() {
  const navigate = useNavigate();
  const filterState = useCustomerFilters();
  const { data, isLoading, isError, isFetching, refetch } = useCustomers(filterState.filters);
  const columns = useMemo(() => buildCustomerColumns(), []);
  const filtered = filterState.activeCount > 0;

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has booked with you, and what they've spent." />

      <div className="space-y-4">
        <CustomerFiltersBar state={filterState} />

        {isError ? (
          <ErrorState
            title="We couldn't load the customers"
            description="Check your connection and try again."
            onRetry={() => refetch()}
          />
        ) : (
          <div aria-busy={isFetching} className={cn("transition-opacity duration-150", isFetching && !isLoading && "opacity-60")}>
            <DataTable<CustomerListItem>
              columns={columns}
              data={data ?? NO_CUSTOMERS}
              loading={isLoading}
              pageSize={10}
              searchPlaceholder="Search by name, email or phone"
              emptyTitle={filtered ? "No customers match these filters" : "No customers yet"}
              emptyDescription={filtered ? "Try clearing some filters." : "Customers appear here after their first booking."}
              onRowClick={(row: CustomerListItem) => navigate(`/admin/customers/${row.id}`)}
              renderCard={(customer: CustomerListItem) => <CustomerCard customer={customer} />}
            />
          </div>
        )}
      </div>
    </>
  );
}