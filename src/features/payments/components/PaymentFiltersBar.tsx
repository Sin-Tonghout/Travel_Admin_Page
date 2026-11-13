import { parseISO } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-picker/DateRangePicker";
import { FilterBar } from "@/components/ui/filter-bar/FilterBar";
import { Select } from "@/components/ui/select/Select";
import { paymentOptions } from "@/features/bookings/lib/workflow";
import type { PaymentFilterState } from "@/features/payments/hooks/usePaymentFilters";
import { paymentMethods } from "@/features/payments/lib/methods";
import type { PaymentMethod, PaymentStatus } from "@/types/payment";

export function PaymentFiltersBar({ state }: { state: PaymentFilterState }) {
  const { status, method, from, to, activeCount, setStatus, setMethod, setDates, clear } = state;

  return (
    <FilterBar activeCount={activeCount} onClear={clear}>
      <div className="w-48">
        <Select
          value={status ?? "all"}
          onValueChange={(v) => setStatus(v === "all" ? undefined : (v as PaymentStatus))}
          options={[{ value: "all", label: "All statuses" }, ...paymentOptions]}
        />
      </div>
      <div className="w-52">
        <Select
          value={method ?? "all"}
          onValueChange={(v) => setMethod(v === "all" ? undefined : (v as PaymentMethod))}
          options={[{ value: "all", label: "All methods" }, ...paymentMethods]}
        />
      </div>
      <DateRangePicker
        placeholder="Payment dates"
        value={from || to ? { from: from ? parseISO(from) : undefined, to: to ? parseISO(to) : undefined } : undefined}
        onChange={setDates}
      />
    </FilterBar>
  );
}