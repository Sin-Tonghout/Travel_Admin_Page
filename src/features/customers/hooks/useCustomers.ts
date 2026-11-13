import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast/Toaster";
import {
  getCustomer,
  getCustomerBookings,
  listCustomers,
  setCustomerStatus,
  updateCustomer,
  type CustomerContactInput,
} from "@/features/customers/services/customerService";
import { ApiError } from "@/services/api-error";
import { queryKeys } from "@/services/query-keys";
import type { CustomerFilters, CustomerStatus } from "@/types/customer";

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

export function useCustomers(filters: CustomerFilters) {
  return useQuery({
    queryKey: queryKeys.customers.list(JSON.stringify(filters)),
    queryFn: () => listCustomers(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => getCustomer(id),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 1,
  });
}

export function useCustomerBookings(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.bookings(id),
    queryFn: () => getCustomerBookings(id),
  });
}

export function useSetCustomerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; status: CustomerStatus }) => setCustomerStatus(v.id, v.status),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
      toast.success(c.status === "blocked" ? `${c.name} was blocked` : `${c.name} is active again`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useUpdateCustomer(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CustomerContactInput) => updateCustomer(id, input),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
      toast.success(`${c.name} saved`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}