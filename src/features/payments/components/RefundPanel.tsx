import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { formatMoney } from "@/features/payments/lib/format";
import type { PaymentRecord, RefundInput } from "@/types/payment";

interface Props {
  payment: PaymentRecord;
  submitting: boolean;
  onSubmit: (input: RefundInput) => void;
  onCancel: () => void;
}

export function RefundPanel({ payment, submitting, onSubmit, onCancel }: Props) {
  const remaining = Math.round((payment.amount - payment.refundedAmount) * 100) / 100;
  const [amount, setAmount] = useState(String(remaining));
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    const next: typeof errors = {};
    if (amount.trim() === "" || !Number.isFinite(value) || value <= 0) next.amount = "Enter an amount greater than 0.";
    else if (value > remaining) next.amount = `You can refund at most ${formatMoney(remaining)}.`;
    if (reason.trim().length < 3) next.reason = "A reason is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({ amount: value, reason });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div>
        <h2 className="text-base font-semibold">Refund payment</h2>
        <p className="text-sm text-foreground-muted">
          {formatMoney(remaining)} can still be refunded to {payment.customer}.
        </p>
      </div>

      <div>
        <Label htmlFor="refund-amount">Amount (USD)</Label>
        <div className="flex gap-2">
          <Input
            id="refund-amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "refund-amount-error" : undefined}
          />
          <Button type="button" variant="outline" onClick={() => setAmount(String(remaining))}>
            Full amount
          </Button>
        </div>
        {errors.amount && (
          <p id="refund-amount-error" role="alert" className="mt-1 text-xs text-danger">
            {errors.amount}
          </p>
        )}
        {payment.bookingStatus !== "cancelled" && (
          <p className="mt-1 text-xs text-foreground-muted">
            Refunding the full balance requires the booking to be cancelled first. A smaller amount keeps it active.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="refund-reason">Reason</Label>
        <Textarea
          id="refund-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-invalid={!!errors.reason}
          aria-describedby={errors.reason ? "refund-reason-error" : undefined}
        />
        {errors.reason && (
          <p id="refund-reason-error" role="alert" className="mt-1 text-xs text-danger">
            {errors.reason}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="destructive" loading={submitting}>
          Issue refund
        </Button>
      </div>
    </form>
  );
}