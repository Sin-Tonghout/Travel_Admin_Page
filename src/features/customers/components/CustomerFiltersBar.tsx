import { FilterBar } from "@/components/ui/filter-bar/FilterBar";
import { Select } from "@/components/ui/select/Select";
import type { CustomerFilterState } from "@/features/customers/hooks/useCustomerFilters";
import type { CustomerFilters, CustomerStatus } from "@/types/customer";

type Segment = NonNullable<CustomerFilters["segment"]>;

export function CustomerFiltersBar({ state }: { state: CustomerFilterState }) {
  const { status, segment, activeCount, setStatus, setSegment, clear } = state;

  return (
    <FilterBar activeCount={activeCount} onClear={clear}>
      <div className="w-48">
        <Select
          value={status ?? "all"}
          onValueChange={(v) => setStatus(v === "all" ? undefined : (v as CustomerStatus))}
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
        />
      </div>
      <div className="w-48">
        <Select
          value={segment ?? "all"}
          onValueChange={(v) => setSegment(v === "all" ? undefined : (v as Segment))}
          options={[
            { value: "all", label: "All customers" },
            { value: "new", label: "New (1 booking)" },
            { value: "returning", label: "Returning (2+ bookings)" },
          ]}
        />
      </div>
    </FilterBar>
  );
}