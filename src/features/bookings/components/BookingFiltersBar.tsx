import { parseISO } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-picker/DateRangePicker";
import { FilterBar } from "@/components/ui/filter-bar/FilterBar";
import { MultiSelect } from "@/components/ui/multi-select/MultiSelect";
import { Select } from "@/components/ui/select/Select";
import type { BookingFilterState } from "@/features/bookings/hooks/useBookingFilters";
import { bookingStatuses, bookingStatusLabels, paymentOptions } from "@/features/bookings/lib/workflow";
import type { BookingStatus } from "@/types/booking";
import type { PaymentStatus } from "@/types/payment";

export function BookingFiltersBar({ state }: { state: BookingFilterState }) {
  const { statuses, payment, from, to, activeCount, setStatuses, setPayment, setDates, clear } = state;

  return (
    <FilterBar activeCount={activeCount} onClear={clear}>
      <div className="w-56">
        <MultiSelect
          placeholder="All statuses"
          value={statuses}
          onChange={(v) => setStatuses(v as BookingStatus[])}
          options={bookingStatuses.map((s) => ({ value: s, label: bookingStatusLabels[s] }))}
        />
      </div>
      <div className="w-48">
        <Select
          value={payment ?? "all"}
          onValueChange={(v) => setPayment(v === "all" ? undefined : (v as PaymentStatus))}
          options={[{ value: "all", label: "All payments" }, ...paymentOptions]}
        />
      </div>
      <DateRangePicker
        placeholder="Travel dates"
        value={from || to ? { from: from ? parseISO(from) : undefined, to: to ? parseISO(to) : undefined } : undefined}
        onChange={setDates}
      />
    </FilterBar>
  );
}