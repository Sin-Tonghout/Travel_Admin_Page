import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast/Toaster";
import {
  getPayment,
  getPaymentSummary,
  listPayments,
  markPaymentPaid,
  refundPayment,
} from "@/features/payments/services/paymentService";
import { ApiError } from "@/services/api-error";
import { queryKeys } from "@/services/query-keys";
import type { PaymentFilters, RefundInput } from "@/types/payment";

// TODO: replace with the signed-in user's name (use whatever your booking mutations pass as the actor).
const ACTOR = "Admin";

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

export function usePayments(filters: PaymentFilters) {
  return useQuery({
    queryKey: queryKeys.payments.list(JSON.stringify(filters)),
    queryFn: () => listPayments(filters),
    placeholderData: keepPreviousData,
  });
}

export function usePaymentSummary(filters: PaymentFilters) {
  return useQuery({
    queryKey: queryKeys.payments.summary(JSON.stringify(filters)),
    queryFn: () => getPaymentSummary(filters),
    placeholderData: keepPreviousData,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => getPayment(id),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 1,
  });
}

/** Payment changes also change the booking and the customer's spend, so refresh all three. */
function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.payments.all });
    qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
    qc.invalidateQueries({ queryKey: queryKeys.customers.all });
  };
}

export function useMarkPaymentPaid() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => markPaymentPaid(id, ACTOR),
    onSuccess: (p) => {
      invalidate();
      toast.success(`${p.id} marked as paid`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useRefundPayment(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input: RefundInput) => refundPayment(id, input, ACTOR),
    onSuccess: (p) => {
      invalidate();
      toast.success(p.status === "refunded" ? `${p.id} fully refunded` : "Partial refund issued");
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}