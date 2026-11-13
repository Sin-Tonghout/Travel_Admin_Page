import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { ErrorState } from "@/components/ui/empty-state/EmptyState";
import { buildPaymentColumns } from "@/features/payments/components/paymentColumns";
import { PaymentCard } from "@/features/payments/components/PaymentCard";
import { PaymentFiltersBar } from "@/features/payments/components/PaymentFiltersBar";
import { PaymentSummaryCards } from "@/features/payments/components/PaymentSummaryCards";
import { usePaymentFilters } from "@/features/payments/hooks/usePaymentFilters";
import { usePaymentSummary, usePayments } from "@/features/payments/hooks/usePayments";
import { cn } from "@/lib/utils";
import type { PaymentRecord } from "@/types/payment";

const NO_PAYMENTS: PaymentRecord[] = [];

export function PaymentsPage() {
  const navigate = useNavigate();
  const filterState = usePaymentFilters();
  const { data, isLoading, isError, isFetching, refetch } = usePayments(filterState.filters);
  const summary = usePaymentSummary(filterState.summaryFilters);
  const columns = useMemo(() => buildPaymentColumns(), []);
  const filtered = filterState.activeCount > 0;

  return (
    <>
      <PageHeader title="Payments" description="Track payments, failed charges and refunds." />

      <div className="space-y-4">
        <PaymentSummaryCards summary={summary.data} loading={summary.isLoading} />
        <PaymentFiltersBar state={filterState} />

        {isError ? (
          <ErrorState
            title="We couldn't load the payments"
            description="Check your connection and try again."
            onRetry={() => refetch()}
          />
        ) : (
          <div aria-busy={isFetching} className={cn("transition-opacity duration-150", isFetching && !isLoading && "opacity-60")}>
            <DataTable<PaymentRecord>
              columns={columns}
              data={data ?? NO_PAYMENTS}
              loading={isLoading}
              pageSize={10}
              searchPlaceholder="Search by payment, reference, booking or customer"
              emptyTitle={filtered ? "No payments match these filters" : "No payments yet"}
              emptyDescription={filtered ? "Try clearing some filters." : "Payments appear here when bookings are made."}
              onRowClick={(row: PaymentRecord) => navigate(`/admin/payments/${row.id}`)}
              renderCard={(payment: PaymentRecord) => <PaymentCard payment={payment} />}
            />
          </div>
        )}
      </div>
    </>
  );
}