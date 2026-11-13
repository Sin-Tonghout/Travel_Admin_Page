import type { PaymentMethod } from "@/types/payment";

export const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: "card", label: "Credit / debit card" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "khqr", label: "KHQR" },
  { value: "cash", label: "Cash" },
];

export const methodLabels = Object.fromEntries(paymentMethods.map((m) => [m.value, m.label])) as Record<
  PaymentMethod,
  string
>;